"use client";
import Loader from "@/components/global/loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReFetch } from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import Image from "next/image";
import { redirect } from "next/navigation";
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
   // const refetch =  useReFetch(["project.getAllProjects"]); // Specify the query key

   const onSubmit = (data: formInput) => {
      toast.warning(`It may take few second. \n Please Wait~`);
      createProject.mutate(
         {
            projectName: data.projectName,
            repoUrl: data.repoUrl,
            githubToken: data.githubToken,
         },
         {
            onSuccess: () => {
               toast.success("Project Created Successfully");
               refetch();
               setTimeout(() => {
                  toast.success("Select your project from the sidebar");
               }, 2000); // Delay of 2 seconds (2000 milliseconds)
            },
            onError: () => {
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
                     <Input
                        className="mb-4"
                        type="text"
                        required
                        {...register("projectName", { required: true })}
                        placeholder="Project Name"
                     />

                     <Input
                        className="mb-3"
                        type="url"
                        required
                        {...register("repoUrl", { required: true })}
                        placeholder="Github Repository URL"
                     />

                     <Input
                        className="mb-3"
                        {...register("githubToken")}
                        placeholder="Github Token (Only for Private Repository)"
                     />

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
                           <>Create Project</>
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
