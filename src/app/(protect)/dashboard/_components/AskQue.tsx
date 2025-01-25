"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/hooks/use-project";
import Image from "next/image";
import { FC, useState } from "react";
import { askQuestion } from "../_action/action";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReference from "./CodeReference";
import "@/styles/globals.css";

const AskQue: FC = () => {
   const { project } = useProject();
   const [question, setQuestion] = useState("");
   const [loading, setLoading] = useState(false);
   const [fileReferences, setFileReferences] = useState<
      {
         fileName: string;
         sourceCode: string;
         summary: string;
      }[]
   >([]);
   const [answer, setAnswer] = useState("");

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!project?.id) return;
      setAnswer("");
      setFileReferences([]);
      setLoading(true);

      const { output, fileReferences } = await askQuestion(
         question,
         project.id,
      );
      setFileReferences(fileReferences);
      for await (const delta of readStreamableValue(output)) {
         if (delta) {
            setAnswer((ans) => ans + delta);
         }
      }
      setLoading(false);
   };

   return (
      <>
         {/* Ask Que Card */}
         <Card className="relative col-span-3">
            <CardHeader>
               <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={onSubmit}>
                  <Textarea
                     placeholder="Which file should I edit to change the Home page?"
                     onChange={(e) => setQuestion(e.target.value)}
                     disabled={loading}
                  />
                  <div className="h-4"></div>

                  <Sheet>
                     <SheetTrigger
                        className="group relative overflow-hidden rounded-md border border-b-4 border-blue-400 bg-blue-600 px-4 py-2 font-medium text-white outline-none duration-300 hover:border-b hover:border-t-4 hover:brightness-150 active:opacity-75"
                        type="submit"
                     >
                        <span className="absolute -top-[150%] left-0 inline-flex h-[5px] w-80 rounded-md bg-blue-400 opacity-50 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)] shadow-blue-400 duration-500 group-hover:top-[150%]" />
                        {loading ? "Processing..." : "Ask to AI"}
                     </SheetTrigger>
                     <SheetContent
                        style={{ maxWidth: "65vw" }}
                        className="scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 max-h-screen overflow-y-auto"
                     >
                        <SheetHeader>
                           <SheetTitle>
                              <div className="flex items-center gap-3 text-2xl">
                                 <Image
                                    src="/logo.svg"
                                    width={40}
                                    height={40}
                                    alt="logo"
                                 />
                                 AskGit AI
                              </div>
                           </SheetTitle>
                        </SheetHeader>

                        {/* Separate block content */}
                        <div className="mt-5 text-sm text-muted-foreground">
                           {loading && (
                              <div className="mb-5 flex items-center justify-center gap-3 rounded-md bg-blue-50 p-4 text-blue-700">
                                 <svg
                                    className="h-5 w-5 animate-spin text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                 >
                                    <circle
                                       className="opacity-25"
                                       cx="12"
                                       cy="12"
                                       r="10"
                                       stroke="currentColor"
                                       strokeWidth="4"
                                    ></circle>
                                    <path
                                       className="opacity-75"
                                       fill="currentColor"
                                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                                    ></path>
                                 </svg>
                                 <span className="text-sm font-medium">
                                    Generating the summary... Please wait a few
                                    seconds.
                                 </span>
                              </div>
                           )}

                           {answer && (
                              <MDEditor.Markdown
                                 source={answer}
                                 className="scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 mb-5 max-h-[50vh] overflow-y-auto"
                                 style={{
                                    whiteSpace: "wrap",
                                    padding: "20px",
                                    fontFamily: "monospace",
                                    justifyContent: "center",
                                 }}
                              />
                           )}
                           {fileReferences.length > 0 && (
                              <CodeReference fileReference={fileReferences} />
                           )}
                        </div>
                     </SheetContent>
                  </Sheet>
               </form>
            </CardContent>
         </Card>
      </>
   );
};

export default AskQue;
