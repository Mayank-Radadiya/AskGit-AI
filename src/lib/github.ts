import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aISummariesCommit } from "./gemini";

export const octokit = new Octokit({
   auth: process.env.GITHUB_TOKEN,
});

const TestGithubUrl = "https://github.com/Mayank-Radadiya/Sundown-Studio";

type Response = {
   commitMessage: string;
   commitHash: string;
   commitAuthorName: string;
   commitAuthorAvatar: string;
   commitDate: string;
};
// get data from github from github api key
export const getCommitHashes = async (
   githubUrl: string,
): Promise<Response[]> => {
   const [owner, repo] = githubUrl.split("/").slice(-2);
   if (!owner || !repo) {
      throw new Error("Invalid Github Url");
   }
   const cleanRepo = repo.replace(/\.git$/, "");

   const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo: cleanRepo,
   });

   const sortedCommits = data.sort(
      (a: any, b: any) =>
         new Date(b.commit.author?.date).getTime() -
         new Date(a.commit.author?.date).getTime(),
   ) as any[];

   return sortedCommits.map((commit) => ({
      commitHash: commit.sha as string,
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit?.author?.name ?? "",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit?.author?.date ?? "",
   }));
};

// get project  and githubUrl from github
const fetchGithubUrl = async (projectId: string) => {
   const project = await db.project.findUnique({
      where: {
         id: projectId,
      },
      select: {
         githubUrl: true,
      },
   });

   if (!project?.githubUrl) {
      throw new Error("Project has no Github Url");
   }

   return { project, githubUrl: project?.githubUrl };
};

const filterUnprocessedCommit = async (
   projectId: string,
   commitHash: Response[],
) => {
   const processedCommits = await db.commit.findMany({
      where: { projectId },
   });

   const unprocessedCommits = commitHash.filter(
      (commit) =>
         !processedCommits.some(
            (processedCommits) =>
               processedCommits.commitHash === commit.commitHash,
         ),
   );

   return unprocessedCommits;
};

const summariesCommits = async (githubUrl: string, commitHash: string) => {
   //https://github.com/Mayank-Radadiya/Sundown-Studio/commit/5c18b1c3e7efacd7e621f7a9aaeeedbd55ac2211.diff
   // try {
   //    const { data } = await axios.get(
   //       `${githubUrl}/commit/${commitHash}.diff`,
   //       {
   //          headers: {
   //             Accept: "application/vnd.github.v3.diff",
   //          },
   //       },
   //    );
   //    return (await aISummariesCommit(data)) || "Error from  AI Server";
   // } catch (error) {
   //    console.log("Error during Commit Summaries");
   // }
   const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
      headers: {
         Accept: "application/vnd.github.v3.diff",
      },
   });
   console.log("data => ", data);

   return (await aISummariesCommit(data)) || "";
};

export const pollCommits = async (projectId: string) => {
   const { project, githubUrl } = await fetchGithubUrl(projectId);
   const commitHashes = await getCommitHashes(githubUrl);
   const unprocessedCommits = await filterUnprocessedCommit(
      projectId,
      commitHashes,
   );
   console.log(2);

   const summariesResponse = await Promise.allSettled(
      unprocessedCommits.map((commit) => {
         return summariesCommits(githubUrl, commit.commitHash);
      }),
   );
   console.log(3);

   const summaries = summariesResponse.map((response) => {
      if (response.status === "fulfilled") {
         console.log("=>", response.value);

         return response.value;
      }
      return "";
   });
   console.log(4);

   console.log(summaries);

   const commits = await db.commit.createMany({
      data: summaries.map((summary, index) => ({
         projectId: projectId,
         commitHash: unprocessedCommits[index]!.commitHash,
         commitMessage: unprocessedCommits[index]!.commitMessage,
         commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
         commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
         commitDate: unprocessedCommits[index]!.commitDate,
         summary: summary ?? "", // Provide a default value if undefined
      })),
   });

   return commits;
};
