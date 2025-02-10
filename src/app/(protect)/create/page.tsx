"use client";
import Loader from "@/components/global/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReFetch } from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { FileText, Github, KeyRound, Send } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type formInput = {
   projectName: string;
   repoUrl: string;
   githubToken?: string;
};

const CreatePage = () => {
   const createProject = api.project.createProject.useMutation();
   const { register, handleSubmit, reset } = useForm<formInput>();
   const refetch = useReFetch();

   const onSubmit = (data: formInput) => {
      toast.warning(`It may take few second. \n Please Wait~`, {
         duration: 10000, // Keeps the toast visible for 5 seconds
      });
      createProject.mutate(
         {
            projectName: data.projectName,
            repoUrl: data.repoUrl,
            githubToken: data.githubToken,
         },
         {
            onSuccess: () => {
               toast.dismiss();
               toast.success("Project Created Successfully");
               refetch();
               setTimeout(() => {
                  toast.success("Select your project from the sidebar");
               }, 3000);
            },
            onError: () => {
               toast.dismiss();
               toast.error("Failed to create project.");
            },
         },
      );
      reset();
   };

   return (
      <>
         <div className="flex h-full items-center justify-center gap-12">
            <Image src="/img1.jpg" alt="image" width={400} height={400} />
            <div>
               <div>
                  <h1 className="text-2xl font-semibold">
                     Link your Github Repository
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Enter the URL of your Repository to link it to AskGit AI
                  </p>
               </div>
               <div>
                  <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                     <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-3 flex items-center">
                           <FileText className="text-gray-500" />
                        </span>

                        <Input
                           className="w-full pl-12" // Add padding to the left for the icon space
                           type="text"
                           required
                           {...register("projectName", { required: true })}
                           placeholder="Project Name"
                        />
                     </div>

                     <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-3 flex items-center">
                           <Github className="text-gray-500" />
                        </span>
                        <Input
                           className="mb-3 pl-12"
                           type="url"
                           required
                           {...register("repoUrl", { required: true })}
                           placeholder="Github Repository URL"
                        />
                     </div>

                     <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-3 flex items-center">
                           <KeyRound className="text-gray-500" />
                        </span>
                        <Input
                           className="mb-3 pl-12"
                           {...register("githubToken")}
                           placeholder="*Github Token (Only for Private Repository)"
                        />
                     </div>

                     <Button
                        type="submit"
                        variant="default"
                        disabled={createProject.isPending}
                     >
                        {createProject.isPending ? (
                           <>
                              <Loader />{" "}
                           </>
                        ) : (
                           <>
                              <Send /> Create Project
                           </>
                        )}
                     </Button>
                  </form>
               </div>
            </div>
         </div>
      </>
   );
};

export default CreatePage;
