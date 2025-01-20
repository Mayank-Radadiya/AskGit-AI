// import { db } from "@/server/db";
// import { Octokit } from "octokit";
// import axios from "axios";
// import { aISummariesCommit } from "./gemini";

// export const octokit = new Octokit({
//    auth: process.env.GITHUB_TOKEN,
// });

// type Response = {
//    commitMessage: string;
//    commitHash: string;
//    commitAuthorName: string;
//    commitAuthorAvatar: string;
//    commitDate: string;
// };

// // get data from github from github api key
// // export const getCommitHashes = async (
// //    githubUrl: string,
// // ): Promise<Response[]> => {
// //    // Extract owner and repo from URL
// //    const [owner, repo] = githubUrl.split("/").slice(-2);
// //    if (!owner || !repo) {
// //       throw new Error(
// //          "Invalid GitHub URL. Make sure it points to a repository.",
// //       );
// //    }
// //    const cleanRepoUrl = repo.replace(/\.git$/, "");

// //    let allCommits: Response[] = [];

// //    try {
// //       while (true) {
// //          const { data } = await octokit.rest.repos.listCommits({
// //             owner,
// //             repo: cleanRepoUrl,
// //             headers: {
// //                Authorization: `token ${process.env.GITHUB_TOKEN}`,
// //             },
// //          });
// //          if (data.length === 0) break;

// //          const commits = data.map((commit) => ({
// //             commitHash: commit.sha,
// //             commitMessage: commit.commit.message ?? "",
// //             commitAuthorName: commit.commit?.author?.name ?? "",
// //             commitAuthorAvatar: commit.author?.avatar_url ?? "",
// //             commitDate: commit.commit?.author?.date ?? "",
// //          }));
// //       }

// //       // Sort commits by date (descending)
// //       return allCommits.sort(
// //          (a, b) =>
// //             new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime(),
// //       );
// //    } catch (error: any) {
// //       if (error.status === 403) {
// //          console.error(
// //             "API rate limit exceeded. Ensure your GitHub token is valid and has sufficient permissions.",
// //          );
// //       } else {
// //          console.error("Error fetching commits:", error.message);
// //       }
// //       throw new Error(
// //          "Failed to fetch commits. Please check the repository URL or API rate limit.",
// //       );
// //    }
// // };

// export const getCommitHashes = async (
//    githubUrl: string,
// ): Promise<Response[]> => {
//    const [owner, repo] = githubUrl.split("/").slice(-2);
//    if (!owner || !repo) {
//       throw new Error("Invalid Github Url");
//    }
//    const cleanRepoUrl = repo.replace(/\.git$/, "");
//    const { data } = await octokit.rest.repos.listCommits({
//       owner,
//       repo: cleanRepoUrl,
//       headers: {
//          Authorization: `token ${process.env.GITHUB_TOKEN}`,
//       },
//    });

//    const sortedCommits = data.sort(
//       (a: any, b: any) =>
//          new Date(b.commit.author?.date).getTime() -
//          new Date(a.commit.author?.date).getTime(),
//    ) as any[];
//    return sortedCommits.map((commit) => ({
//       commitHash: commit.sha as string,
//       commitMessage: commit.commit.message ?? "",
//       commitAuthorName: commit.commit?.author?.name ?? "",
//       commitAuthorAvatar: commit.author?.avatar_url ?? "",
//       commitDate: commit.commit?.author?.date ?? "",
//    }));
// };

// // get project  and githubUrl from github
// const fetchGithubUrl = async (projectId: string) => {
//    const project = await db.project.findUnique({
//       where: {
//          id: projectId,
//       },
//       select: {
//          githubUrl: true,
//       },
//    });

//    if (!project?.githubUrl) {
//       throw new Error("Project has no Github Url");
//    }
//    return { project, githubUrl: project?.githubUrl };
// };

// const filterUnprocessedCommit = async (
//    projectId: string,
//    commitHash: Response[],
// ) => {
//    const processedCommits = await db.commit.findMany({
//       where: { projectId },
//    });

//    const unprocessedCommits = commitHash.filter(
//       (commit) =>
//          !processedCommits.some(
//             (processedCommits) =>
//                processedCommits.commitHash === commit.commitHash,
//          ),
//    );
//    return unprocessedCommits;
// };

// const summariesCommits = async (githubUrl: string, commitHash: string) => {
//    //https://github.com/Mayank-Radadiya/Sundown-Studio/commit/5c18b1c3e7efacd7e621f7a9aaeeedbd55ac2211.diff
//    const cleanGithubUrl = githubUrl.replace(/\.git$/, "");

//    const { data } = await axios.get(
//       `${cleanGithubUrl}/commit/${commitHash}.diff`,
//       {
//          headers: {
//             Accept: "application/vnd.github.v3.diff",
//          },
//       },
//    );
//    console.log("Ai Summary => ", await aISummariesCommit(data));

//    return await aISummariesCommit(data);
// };

// export const pollCommits = async (projectId: string) => {
//    const { githubUrl } = await fetchGithubUrl(projectId);
//    console.log(1);

//    const commitHashes = await getCommitHashes(githubUrl);
//    console.log(2);

//    const unprocessedCommits = await filterUnprocessedCommit(
//       projectId,
//       commitHashes,
//    );
//    console.log(3);

//    const delay = (ms: number) =>
//       new Promise((resolve) => setTimeout(resolve, ms));

//    const summariesResponse = await Promise.allSettled(
//       unprocessedCommits.map(async (commit, index) => {
//          await delay(index * 150); // Introduce a delay (e.g., 100ms per request)
//          return summariesCommits(githubUrl, commit.commitHash);
//       }),
//    );

//    console.log(4);

//    //https://github.com/Mayank-Radadiya/Sundown-Studio/commit/5c18b1c3e7efacd7e621f7a9aaeeedbd55ac2211.diff
//    const summaries = summariesResponse.map((response) => {
//       console.log("status", response.status);

//       if (response.status === "fulfilled") {
//          // For successfully resolved promises, return the value
//          return response.value ?? ""; // Fallback to empty string if value is null/undefined
//       } else if (response.status === "rejected") {
//          // For rejected promises, log the reason and return an empty string
//          console.error("Rejected reason:", response.reason);
//          return ""; // Handle rejection gracefully
//       }
//       return ""; // Fallback in case of unexpected status
//    });

//    console.log("summary => ", summaries);

//    const commits = await db.commit.createMany({
//       data: summaries
//          .map((summary, index) => {
//             if (!summary || !unprocessedCommits[index]) return null; // Handle invalid data
//             return {
//                projectId: projectId,
//                commitHash: unprocessedCommits[index]!.commitHash,
//                commitMessage: unprocessedCommits[index]!.commitMessage,
//                commitAuthorAvatar:
//                   unprocessedCommits[index]!.commitAuthorAvatar,
//                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
//                commitDate: unprocessedCommits[index]!.commitDate,
//                summary: summary,
//             };
//          })
//          .filter((item) => item !== null), // Remove null entries
//    });

//    return commits;
// };

import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aISummariesCommit } from "./gemini";

export const octokit = new Octokit({
   auth: process.env.GITHUB_TOKEN,
});

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
   const cleanRepoUrl = repo.replace(/\.git$/, "");

   try {
      const { data } = await octokit.rest.repos.listCommits({
         owner,
         repo: cleanRepoUrl,
         headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
         },
      });

      return data
         .map((commit: any) => ({
            commitHash: commit.sha,
            commitMessage: commit.commit.message ?? "",
            commitAuthorName: commit.commit.author?.name ?? "",
            commitAuthorAvatar: commit.author?.avatar_url ?? "",
            commitDate: commit.commit.author?.date ?? "",
         }))
         .sort(
            (a, b) =>
               new Date(b.commitDate).getTime() -
               new Date(a.commitDate).getTime(),
         );
   } catch (error: any) {
      if (error.status === 403) {
         console.error("API rate limit exceeded.");
      } else {
         console.error("Error fetching commits:", error.message);
      }
      throw new Error("Failed to fetch commits.");
   }
};

const fetchGithubUrl = async (projectId: string) => {
   const project = await db.project.findUnique({
      where: { id: projectId },
      select: { githubUrl: true },
   });

   if (!project?.githubUrl) {
      throw new Error("Project has no GitHub URL.");
   }
   return { githubUrl: project.githubUrl };
};

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

const summariesCommits = async (githubUrl: string, commitHash: string) => {
   const cleanGithubUrl = githubUrl.replace(/\.git$/, "");

   try {
      const { data } = await axios.get(
         `${cleanGithubUrl}/commit/${commitHash}.diff`,
         {
            headers: { Accept: "application/vnd.github.v3.diff" },
         },
      );
      return await aISummariesCommit(data);
   } catch (error) {
      console.error("Error fetching or summarizing commit diff:", error);
      return ""; // Return an empty summary on failure
   }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollCommits = async (projectId: string) => {
   const { githubUrl } = await fetchGithubUrl(projectId);
   const commitHashes = await getCommitHashes(githubUrl);
   const unprocessedCommits = await filterUnprocessedCommit(
      projectId,
      commitHashes,
   );

   const batchSize = 5; // Process in batches of 5 commits
   const summariesResponse: { summary: string; commit: Response }[] = [];

   for (let i = 0; i < unprocessedCommits.length; i += batchSize) {
      const batch = unprocessedCommits.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
         batch.map(async (commit) => {
            const summary = await summariesCommits(
               githubUrl,
               commit.commitHash,
            );
            return { summary, commit };
         }),
      );

      summariesResponse.push(
         ...batchResults
            .filter((result) => result.status === "fulfilled")
            .map((result: any) => result.value),
      );

      await delay(2000); // Wait 2 seconds between batches to respect rate limits
   }

   const validSummaries = summariesResponse.map(({ summary, commit }) => ({
      projectId,
      commitHash: commit.commitHash,
      commitMessage: commit.commitMessage,
      commitAuthorAvatar: commit.commitAuthorAvatar,
      commitAuthorName: commit.commitAuthorName,
      commitDate: commit.commitDate,
      summary: summary || "No summary available.",
   }));

   const commits = await db.commit.createMany({
      data: validSummaries,
   });

   return commits;
};
