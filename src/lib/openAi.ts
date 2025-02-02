import OpenAI from "openai";
import { Document } from "@langchain/core/documents";

if (!process.env.DEEPSEEK_API_KEY) {
   throw new Error("DEEPSEEK_API_KEY is Missing");
}

// const deepseek = new OpenAI(process.env.DEEPSEEK_API_KEY);

const deepseek = new OpenAI({
   baseURL: "https://openrouter.ai/api/v1",
   apiKey: process.env.DEEPSEEK_API_KEY,
});

export const aISummariesCommit = async (diff: string) => {
   const response = await deepseek.chat.completions.create({
      model: "deepseek-chat-1.3",
      messages: [
         {
            role: "system",
            content: `You are an expert programmer, and you are trying to summarize a git diff.
         Reminders about the git diff format:
         For every file, there are metadata lines like:
         \`\`\`
         diff --git a/lib/index.js b/lib/index.js
         index aadf691..bfef603 100644
         --- a/lib/index.js
         +++ b/lib/index.js
         \`\`\`
         This means \`lib/index.js\` was modified. Then there are line changes:
         - \`+\` indicates added lines
         - \`-\` indicates removed lines
         - Other lines are context
         [...]
         EXAMPLE SUMMARY COMMENTS:
         \`\`\`
         * Raised returned recordings from 10 to 100 [server/recordings_api.ts]
         * Fixed github action typo [.github/workflows/ci.yml]
         * Moved octokit init to separate file [src/octokit.ts]
         * Added OpenAI API integration [utils/apis/openai.ts]
         \`\`\`}
         Provide concise summaries focusing on key changes.`,
         },
         {
            role: "user",
            content: `Summarize this git diff:\n\n${diff}`,
         },
      ],
      temperature: 0.2,
   });

   return response.choices[0]?.message.content;
};

export async function summariesCode(doc: Document) {
   try {
      const code = doc.pageContent.slice(0, 15000);
      const response = await deepseek.chat.completions.create({
         model: "deepseek-code-1.3",
         messages: [
            {
               role: "system",
               content: `You are a senior engineer onboarding juniors. Explain the purpose of ${doc.metadata.source} in 100 words.`,
            },
            {
               role: "user",
               content: `Code:\n---\n${code}\n---\nConcise summary:`,
            },
         ],
         temperature: 0.3,
      });

      return response.choices[0]?.message.content;
   } catch (error) {
      console.log("Error in summariesCode", error);
      return "";
   }
}

export const generateEmbedding = async (summary: string) => {
   const response = await deepseek.embeddings.create({
      model: "text-embedding-1.0",
      input: summary,
   });

   return response.data[0]?.embedding;
};
