"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import draculaStyle from "react-syntax-highlighter/dist/esm/styles/prism/dracula";

interface CodeReferenceProps {
   fileReference: { fileName: string; summary: string; sourceCode: string }[];
}

const CodeReference: FC<CodeReferenceProps> = ({ fileReference }) => {
   const [tab, setTab] = useState(fileReference[0]?.fileName || "");

   if (fileReference.length === 0) {
      return (
         <div className="rounded-md bg-gray-100 p-4 text-center text-sm text-gray-600">
            No files to display.
         </div>
      );
   }

   return (
      <Tabs value={tab} onValueChange={setTab}>
         {/* File Tabs */}
         <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex gap-2 overflow-x-auto rounded-md bg-gray-100 p-2">
            {fileReference.map((file) => (
               <button
                  key={file.fileName}
                  onClick={() => setTab(file.fileName)}
                  className={cn(
                     "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                     {
                        "bg-blue-600 text-white shadow-md":
                           tab === file.fileName,
                        "bg-gray-200 text-gray-700 hover:bg-gray-300":
                           tab !== file.fileName,
                     },
                  )}
               >
                  {file.fileName}
               </button>
            ))}
         </div>

         {/* Source Code Viewer */}
         {fileReference.map((file) => (
            <TabsContent
               key={file.fileName}
               value={file.fileName}
               className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-[70vh] overflow-y-auto rounded-md bg-white p-6 shadow-md"
            >
               <h1 className="text-xl font-semibold">Summary of This code : </h1>
               <div className="mb-4 text-gray-700">{file.summary}</div>
               <SyntaxHighlighter
                  style={draculaStyle}
                  language="typescript"
                  customStyle={{
                     margin: 0,
                     padding: "1rem",
                     borderRadius: "0.5rem",
                     background: "#2d2d2d",
                     color: "#f8f8f2",
                     fontSize: "0.875rem",
                     lineHeight: "1.5",
                  }}
               >
                  {file.sourceCode}
               </SyntaxHighlighter>
            </TabsContent>
         ))}
      </Tabs>
   );
};

export default CodeReference;
