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
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReference from "./CodeReference";

interface AskQueProps {}

const AskQue: FC<AskQueProps> = ({}) => {
   const { project } = useProject();
   const [question, setQuestion] = useState("");
   const [loading, setLoading] = useState(false);
   const [fileReference, setFileReference] = useState<
      {
         fileName: string;
         sourceCode: string;
         summary: string;
      }[]
   >([]);
   const [answer, setAnswer] = useState("");

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAnswer("");
      setFileReference([]);
      if (!project?.id) return;
      setLoading(true);

      const { output, fileReferences } = await askQuestion(
         question,
         project.id,
      );
      setFileReference(fileReferences);
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
                     placeholder="Which file should I edit to change Home page? "
                     onChange={(e) => setQuestion(e.target.value)}
                  />
                  <div className="h-4"></div>

                  <Sheet>
                     <SheetTrigger
                        className="group relative overflow-hidden rounded-md border border-b-4 border-blue-400 bg-blue-600 px-4 py-2 font-medium text-white outline-none duration-300 hover:border-b hover:border-t-4 hover:brightness-150 active:opacity-75"
                        type="submit"
                     >
                        <span className="absolute -top-[150%] left-0 inline-flex h-[5px] w-80 rounded-md bg-blue-400 opacity-50 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)] shadow-blue-400 duration-500 group-hover:top-[150%]" />
                        Ask to AI
                     </SheetTrigger>
                     <SheetContent
                        style={{ maxWidth: "60vw" }}
                        className="max-h-screen overflow-y-scroll"
                     >
                        <SheetHeader>
                           <SheetTitle>
                              <Image
                                 src="/logo.svg"
                                 width={40}
                                 height={40}
                                 alt="logo"
                              />
                           </SheetTitle>
                           <SheetDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                           </SheetDescription>
                        </SheetHeader>
                        <SheetDescription className="overflow-y-scroll">
                           <MDEditor.Markdown
                              source={answer}
                              className="!h-full max-h-[40vh] overflow-scroll"
                           />
                           <div className="h-4"></div>
                           <CodeReference fileReference={fileReference} />
                        </SheetDescription>
                     </SheetContent>
                  </Sheet>
               </form>
            </CardContent>
         </Card>
      </>
   );
};

export default AskQue;
