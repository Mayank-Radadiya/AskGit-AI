"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import exp from "constants";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
   apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
   const stream = createStreamableValue();

   const queryVector = await generateEmbedding(question);
   const vectorQuery = `[${queryVector.join(",")}]`;

   const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary", 1 - ("summaryEmbedding" <=> ${vectorQuery} :: vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY  similarity DESC
    LIMIT 10
    `) as {
      fileName: string;
      sourceCode: string;
      summary: string;
   }[];

   let context = "";

   for (const doc of result) {
      context += `source: ${doc.fileName} \n code content: ${doc.sourceCode} \n summary of file: ${doc.summary} \n\n`;
   }

   (async () => {
      const { textStream } = await streamText({
         model: google("gemini-1.5-flash"),
         prompt: `
         //    You are a ai code assistant who answers question about codebase.You target audience is technical inter
         //      AI assistant is a brand new, powerful, human-like artificial intelligence.
         //   The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
         //   AI is a well-behaved and well-mannered individual.
         //   AI will answer all questions in the HTML format. including code snippets, proper HTML formatting
         //   AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
         //   AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
         //   If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions, including code snippets.
         //   START CONTEXT BLOCK
         //   ${context}
         //   END OF CONTEXT BLOCK

         //   START QUESTION
         //     ${question}
         //   END QUESTION
         //   AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
         //   If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
         //   AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
         //   AI assistant will not invent anything that is not drawn directly from the context.
         //   Answer in markdown syntax, with code snippets if needed.Be as detailed as possiable when answering.
         //     `,
         // prompt: `
         //            You are an AI code assistant specializing in answering technical questions about codebases. Your target audience includes experienced developers and technical professionals.

         //    Traits and Guidelines for the AI Assistant:
         //    - You are a cutting-edge, human-like artificial intelligence, embodying expert knowledge, cleverness, and helpfulness.
         //    - You exhibit professionalism, politeness, and articulate communication in all responses.
         //    - You are friendly, kind, and inspiring, always striving to provide clear, vivid, and thoughtful answers.
         //    - Your knowledge is vast and accurate, enabling you to address nearly any technical query with confidence and precision.
         //    - If the question relates to code or specific files, you will provide step-by-step instructions, detailed explanations, and code snippets formatted appropriately.

         //    Formatting Guidelines:
         //    - Always respond in HTML format, including proper code snippets where relevant.
         //    - Use markdown syntax where applicable to enhance readability.
         //    - Be as detailed and descriptive as possible in your answers, ensuring clarity and usefulness.

         //    Context Handling:
         //    - Use the provided CONTEXT BLOCK to inform your response.
         //    - If the context does not contain the necessary information to answer a question, respond with: "I'm sorry, but I don't know the answer to that question."
         //    - Do not speculate or invent information outside of the context provided.

         //    ---

         //    **START CONTEXT BLOCK**
         //    ${context}
         //    **END CONTEXT BLOCK**

         //    **START QUESTION**
         //    ${question}
         //    **END QUESTION**

         //    Respond thoroughly and accurately, while adhering to the guidelines above. If new information is learned during the conversation, incorporate it into subsequent answers.

         //    Example Format:

         //    ## Question Summary
         //    [Summary of the user's question or issue]

         //    ## Explanation
         //    [Detailed explanation of the concept or solution.]

         //    ### Code Example

         //    // Example code with comments to explain the logic
         //    const exampleFunction = () => {
         //    console.log("Hello, World!");
         //    };
         //    exampleFunction();

         // `,
      });

      for await (const delta of textStream) {
         stream.update(delta);
      }

      stream.done();
   })();

   return {
      output: stream.value,
      fileReferences: result,
   };
}
