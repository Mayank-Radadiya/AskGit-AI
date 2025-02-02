"use client";
import { useProject } from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import CommitLog from "./_components/CommitLog";
import AskQue from "./_components/AskQue";
import { Button } from "@/components/ui/button";
import DeleteButton from "./_components/DeleteButton";
import { Cover } from "@/components/ui/cover";
import CreateProjectButton from "./_components/CreateProjectButton";

const page: FC = ({}) => {
   const { project, selectedProjectId, hasProjects } = useProject();

   return (
      <>
         {hasProjects ? (
            <>
               <div>
                  <div className="flex flex-wrap items-center gap-2 gap-y-4">
                     <div className="w-fit rounded-md bg-primary px-4 py-3">
                        <div className="flex items-center">
                           <Github className="size-5 text-white" />
                           <div className="ml-4">
                              <p className="text-sm font-medium text-white">
                                 {selectedProjectId && project?.githubUrl ? (
                                    <>
                                       This project links to{" "}
                                       <Link
                                          href={project.githubUrl}
                                          className="inline-flex items-center text-white/80 hover:underline"
                                       >
                                          {project.githubUrl}
                                          <ExternalLink className="ml-1 size-4" />
                                       </Link>
                                    </>
                                 ) : (
                                    "Select Project"
                                 )}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-center">
                        {project?.id ? (
                           <DeleteButton projectId={project.id} />
                        ) : (
                           <></>
                        )}
                     </div>
                     <div className="h-4"></div>

                     <div className="flex items-center gap-4">
                        {/* team member */}
                     </div>
                  </div>

                  <div className="m-4">
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                        <AskQue />
                        {/* ask Que and meeting */}
                     </div>
                  </div>

                  <CommitLog />
               </div>
            </>
         ) : (
            <>
               <div className="flex h-full w-full items-center justify-center flex-col">
                  <h1 className="leading-extra relative z-20 mx-10 mt-6 max-w-7xl bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 bg-clip-text py-6 text-center text-4xl font-semibold text-transparent dark:from-neutral-800 dark:via-white dark:to-white md:text-4xl lg:text-7xl">
                     Build amazing project <br /> with <Cover>AskGit AI</Cover>
                  </h1>
                  <CreateProjectButton />
               </div>
            </>
         )}
      </>
   );
};

export default page;
