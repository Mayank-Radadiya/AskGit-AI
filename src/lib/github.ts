import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aISummariesCommit } from "./gemini";

export const octokit = new Octokit({
   auth: process.env.GITHUB_TOKEN,
});

async function checkRateLimit() {
   const { data } = await octokit.request("GET /rate_limit");
   console.log("Rate Limit Info:", data);
}

checkRateLimit();


type Response = {
   commitMessage: string;
   commitHash: string;
   commitAuthorName: string;
   commitAuthorAvatar: string;
   commitDate: string;
};

// Fetch commit data from GitHub
export const getCommitHashes = async (
   githubUrl: string,
): Promise<Response[]> => {
   const [owner, repo] = githubUrl.split("/").slice(-2);
   if (!owner || !repo) {
      throw new Error("Invalid GitHub URL.");
   }

   try {
      const { data } = await octokit.rest.repos.listCommits({
         owner,
         repo,
         per_page: 15, // Explicitly set page size
         page: 1, // Implement pagination
         headers: {
            // Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Authenticate the request
         },
      });

      return data.slice(0, 15).map((commit: any) => ({
         commitHash: commit.sha,
         commitMessage: commit.commit.message || "",
         commitAuthorName: commit.commit.author?.name || "Unknown",
         commitAuthorAvatar: commit.author?.avatar_url || "",
         commitDate: commit.commit.author?.date || "",
      }));
   } catch (error: any) {
      handleGitHubError(error);
      console.error("Error fetching commits:", error.message);
      throw new Error(
         error.status === 403
            ? "API rate limit exceeded. Please try again later."
            : "Failed to fetch commits. Check the GitHub URL and token.",
      );
   }
};

// Fetch GitHub URL for a project
const fetchGithubUrl = async (projectId: string) => {
   const project = await db.project.findUnique({
      where: { id: projectId },
      select: { githubUrl: true },
   });

   if (!project?.githubUrl) {
      throw new Error("Project does not have a valid GitHub URL.");
   }
   return { githubUrl: project.githubUrl.replace(/\.git$/, "") };
};

// Filter unprocessed commits
const filterUnprocessedCommit = async (
   projectId: string,
   commits: Response[],
) => {
   const processedCommits = await db.commit.findMany({
      where: { projectId },
      select: { commitHash: true },
   });

   const processedHashes = new Set(processedCommits.map((c) => c.commitHash));
   return commits.filter((commit) => !processedHashes.has(commit.commitHash));
};

// Generate summaries for commits
const summariesCommits = async (githubUrl: string, commitHash: string) => {
   try {
      const { data } = await axios.get(
         `${githubUrl}/commit/${commitHash}.diff`,
         {
            headers: { Accept: "application/vnd.github.v3.diff" },
         },
      );
      return await aISummariesCommit(data);
   } catch (error: any) {
      console.error(
         `Error fetching or summarizing diff for commit ${commitHash}:`,
         error.message,
      );
      return ""; // Return an empty summary on failure
   }
};

// Delay utility
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Poll commits and process summaries
export const pollCommits = async (projectId: string) => {
   const { githubUrl } = await fetchGithubUrl(projectId);
   const commitHashes = await getCommitHashes(githubUrl);
   const unprocessedCommits = await filterUnprocessedCommit(
      projectId,
      commitHashes,
   );

   const batchSize = 3; // Number of commits to process in a single batch
   const summariesResponse: { summary: string; commit: Response }[] = [];

   for (let i = 0; i < unprocessedCommits.length; i += batchSize) {
      const batch = unprocessedCommits.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
         batch.map(async (commit) => {
            try {
               const summary = await summariesCommits(
                  githubUrl,
                  commit.commitHash,
               );
               return { summary, commit };
            } catch (error: any) {
               console.error(
                  `Failed to summarize commit ${commit.commitHash}:`,
                  error.message,
               );
               return null; // Ignore failed commits
            }
         }),
      );

      summariesResponse.push(
         ...batchResults
            .filter((result) => result.status === "fulfilled" && result.value)
            .map((result: any) => result.value),
      );

      await delay(5000); // Wait 2 seconds between batches to respect API limits
   }

   const validSummaries = summariesResponse.map(({ summary, commit }) => ({
      projectId,
      commitHash: commit.commitHash,
      commitMessage: commit.commitMessage,
      commitAuthorAvatar: commit.commitAuthorAvatar,
      commitAuthorName: commit.commitAuthorName,
      commitDate: commit.commitDate,
      summary:
         summary ||
         "Sorry 🥲!  No summary available for this Commit Your commit too large.",
   }));

   if (validSummaries.length > 0) {
      await db.commit.createMany({ data: validSummaries });
   }

   return validSummaries;
};

function handleGitHubError(error: any) {
   if (error.status === 403) {
      // Check for authentication issues first
      if (!process.env.GITHUB_TOKEN) {
         throw new Error("GitHub token is missing - authentication required");
      }

      // Parse rate limit headers
      const remaining = error.response.headers["x-ratelimit-remaining"];
      const resetTime = error.response.headers["x-ratelimit-reset"];

      if (remaining === "0") {
         const resetDate = new Date(parseInt(resetTime) * 1000);
         const delayMs = resetDate.getTime() - Date.now() + 5000; // Add buffer

         console.log(
            `Rate limit exhausted. Resets at ${resetDate.toISOString()}`,
         );
         return new Promise((resolve) =>
            setTimeout(resolve, Math.max(delayMs, 0)),
         );
      }

      throw new Error(`GitHub API forbidden: ${error.message}`);
   }

   // Handle secondary rate limits
   if (error.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || 30;
      console.log(`Secondary rate limit - retrying after ${retryAfter}s`);
      return new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
   }

   throw error;
}
