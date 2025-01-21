"use client";

import { api } from "@/trpc/react";

export default function ProjectsPage() {
   const {
      data: projects,
      isLoading,
      error,
   } = api.project.getProjects.useQuery();

   if (isLoading) return <p>Loading projects...</p>;
   if (error) return <p>Error: {error.message}</p>;

   return (
      <div>
         <h1>Your Projects</h1>
         <ul>
            {projects?.map((project) => (
               <li key={project.id}>{project.name}</li>
            ))}
         </ul>
      </div>
   );
}
