import { db } from "@/server/db";
import { Octokit } from "octokit";

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
   const { data } = await octokit.rest.repos.listCommits({
      owner: "Mayank-Radadiya",
      repo: "Sundown-Studio",
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

export const pollCommits = async (projectId: string) => {
   const { project, githubUrl } = await fetchGithubUrl(projectId);
   const commitHashes = await getCommitHashes(githubUrl);
};
