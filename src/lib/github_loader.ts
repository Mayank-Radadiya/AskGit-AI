import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

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

console.log(
   await loadGithubRepo("https://github.com/Mayank-Radadiya/PRICE_WISE"),
);
