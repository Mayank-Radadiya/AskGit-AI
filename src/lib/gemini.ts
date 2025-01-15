import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
   throw new Error("GEMINI_API_KEY is Missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
   model: "gemini-1.5-flash",
});

export const aISummariesCommit = async (diff: string) => {
   // https//github.com/OwnerName/repoName/commit/commitHash/diff
   //https://github.com/Mayank-Radadiya/Sundown-Studio/commit/5c18b1c3e7efacd7e621f7a9aaeeedbd55ac2211.diff
   const response = await model.generateContent([
      `You are an expert programmer, and you are trying to summarize a git diff.
    Reminders about the git diff format:
    For every file, there are a few metadata lines, like (for example):
    \`\`\`
    diff --git a/lib/index.js b/lib/index.js
    index aadf691..bfef603 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
    This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
    Then there is a specifier of the lines that were modified.
    A line starting with \`+\` means it was added.
    A line that starting with \`-\` means that line was deleted.
    A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
    It is not part of the diff.
    [...]
    EXAMPLE SUMMARY COMMENTS:
    \`\`\`
    * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
    * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
    * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
    * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
    * Lowered numeric tolerance for test files
    \`\`\`
    Most commits will have less comments than this examples list.
    The last comment does not include the file names,
    because there were more than two relevant files in the hypothetical commit.
    Do not include parts of the example in your summary.
    It is given only as an example of appropriate comments.`,
      `Please summaries the following diff file: \n\n ${diff}`,
   ]);
   return response.response.text();
};

// console.log(
//    await aISummariesCommit(`diff --git a/index.html b/index.html
// index 9e25114..71d87f9 100644
// --- a/index.html
// +++ b/index.html
// @@ -308,7 +308,7 @@ <h2>Stay Updated</h2>
//                </form>
//              </div>
//            </div>
// -          <p>&copy; 2025 AI Innovations. All rights reserved.</p>
// +          <p>&copy; 2025 Sundown Studio. All rights reserved.</p>
//          </footer>
//        </div>
//      </div>
// diff --git a/style.css b/style.css
// index 00b24f7..2274a4b 100644
// --- a/style.css
// +++ b/style.css
// @@ -634,7 +634,7 @@ h3 {
//    min-height: 200px;
//  }
//  #page6 h2 {
// -  font-size: 35px;
// +  font-size: 30px;
//    font-weight: 900;
//    letter-spacing: 3px;
//    color: #000;`),
// );
