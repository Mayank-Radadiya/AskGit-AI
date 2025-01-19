"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import styles from "react-syntax-highlighter/dist/esm/styles/prism/dracula";

interface CodeReferenceProps {
   fileReference: { fileName: string; summary: string; sourceCode: string }[];
}

const CodeReference: FC<CodeReferenceProps> = ({ fileReference }) => {
   const [tab, setTab] = useState(fileReference[0]?.fileName);
   if (fileReference.length === 0) return;

   return (
      <>
         <div>
            <Tabs value={tab} onValueChange={setTab}>
               <div className="flex gap-2 overflow-scroll rounded-md bg-gray-200 p-2">
                  {fileReference.map((file) => {
                     return (
                        <>
                           <button
                              key={file.fileName}
                              className={cn(
                                 "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                                 {
                                    "bg-primary text-foreground":
                                       tab === file.fileName,
                                 },
                              )}
                           >
                              {file.fileName}
                           </button>
                        </>
                     );
                  })}
               </div>
               {fileReference.map((file) => (
                  <TabsContent
                     key={file.fileName}
                     value={file.fileName}
                     className="max-h-[40vh] max-w-7xl overflow-y-scroll rounded-md"
                  >
                     <SyntaxHighlighter language="typescript" style={styles}>
                        {file.sourceCode}
                     </SyntaxHighlighter>
                  </TabsContent>
               ))}
            </Tabs>
         </div>
      </>
   );
};

export default CodeReference;
