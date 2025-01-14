"use client";
import { useProject } from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const page: FC = ({}) => {
   const { project } = useProject();
   return (
      <div>
         <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="w-fit rounded-md bg-primary px-4 py-3">
               <div className="flex items-center">
                  <Github className="size-5 text-white" />
                  <div className="ml-4">
                     <p className="text-sm font-medium text-white">
                        This project link to {""}
                        <Link
                           href={project?.githubUrl ?? ""}
                           className="inline-flex items-center text-white/80 hover:underline"
                        >
                           {project?.githubUrl}
                           <ExternalLink className="ml-1 size-4" />
                        </Link>
                     </p>
                  </div>
               </div>
            </div>

            <div className="h-4"></div>

            <div className="flex items-center gap-4">{/* team member */}</div>
         </div>

         <div className="m-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
               {/* ask Que and meeting */}
               {project?.id}
            </div>
         </div>
      </div>
   );
};

export default page;
