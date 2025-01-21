import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariesCode } from "./gemini";
import { db } from "@/server/db";
// From docs
// export const run = async () => {
//    const loader = new GithubRepoLoader(
//       "https://github.com/langchain-ai/langchainjs",
//       {
//          branch: "main",
//          recursive: false,
//          unknown: "warn",
//          ignorePaths: ["*.md"],
//       },
//    );
//    const docs = await loader.load();
//    console.log({ docs });
//    // Will not include any .md files
// };

export const loadGithubRepo = async (
   githubUrl: string,
   githubToken?: string,
) => {
   const loader = new GithubRepoLoader(githubUrl, {
      accessToken: githubToken || "",
      branch: "main",
      recursive: true,
      unknown: "warn",
      maxConcurrency: 5,
      ignorePaths: [
         "*.md", // Markdown files (e.g., README.md, docs.md)
         "bun.lockb", // Bun lock file
         ".gitignore", // Git ignore file
         "*.config.*", // Any config files (e.g., webpack.config.js, vite.config.ts)
         "*.json", // JSON files (e.g., package.json, tsconfig.json)
         "*.lock", // Lock files (e.g., yarn.lock, package-lock.json)
         "*.yml", // YAML files (e.g., .github/workflows/*.yml)
         "*.yaml", // Additional YAML files
         "*.env", // Environment files (e.g., .env, .env.local)
         "*.log", // Log files (e.g., error.log, debug.log)
         "*.xml", // XML files (e.g., sitemap.xml)
         "*.iml", // IDE-specific files (e.g., IntelliJ module files)
         ".DS_Store", // macOS system file
         "Thumbs.db", // Windows system file
         "*.svg", // SVG assets
         "*.ico", // Icon files
         "*.png", // PNG images
         "*.jpg", // JPG images
         "*.jpeg", // JPEG images
         "*.webp", // WEBP images
         "*.gif", // GIF images
         "node_modules", // Node.js modules folder
         "dist", // Distribution folder
         "build", // Build folder
         "public", // Public assets folder
         ".husky", // Husky hooks folder
         ".vscode", // VSCode settings folder
         ".idea", // IntelliJ IDEA settings folder
         "*.bak", // Backup files
         "*.tmp", // Temporary files
      ],
   });

   const docs = await loader.load();
   return docs;
};

const generateEmbeddings = async (docs: Document[]) => {
   return await Promise.all(
      docs.map(async (doc) => {
         const summary = await summariesCode(doc);
         const embedding = await generateEmbedding(summary);
         return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
         };
      }),
   );
};

export const indexGithubRepo = async (
   projectId: string,
   githubUrl: string,
   githubToken?: string,
) => {
   const docs = await loadGithubRepo(githubUrl, githubToken);
   const allEmbedding = await generateEmbeddings(docs);
   await Promise.allSettled(
      allEmbedding.map(async (embedding, index) => {
         console.log(`processing ${index} of ${embedding.fileName}`);

         if (!embedding) return;

         const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
               summary: embedding.summary,
               sourceCode: embedding.sourceCode,
               fileName: embedding.fileName,
               projectId,
            },
         });
         // console.log("length => ", embedding.embedding.length); // Check vector dimensions
         // const adjustedVector =
         //    embedding.embedding.length === 786
         //       ? embedding.embedding
         //       : embedding.embedding.length > 786
         //         ? embedding.embedding.slice(0, 786)
         //         : [
         //              ...embedding.embedding,
         //              ...new Array(786 - embedding.embedding.length).fill(0),
         //           ];

         console.log("Embedding length:", embedding.embedding.length);
         await db.$executeRaw`
         UPDATE "SourceCodeEmbedding"
         SET "summaryEmbedding" = ${embedding.embedding}::vector
         WHERE "id" = ${sourceCodeEmbedding.id}
         `;
      }),
   );
};
