import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export const useProject = () => {
   const { data: projects = [], error } = api.project.getProjects.useQuery();
   if (error) console.log(error);

   const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
      "selectedProjectId",
      " ",
   );

   // find current project with current projectId witch stored in localStorage
   //      projectId ==== LocalStorage selectedProjectId
   const project = projects?.find(
      (project) => project.id === selectedProjectId,
   );

   // Handle when no projects are available
   const hasProjects = projects && projects?.length > 0;

   // Fallback mechanism for selecting a project when none exists
   const defaultProject = hasProjects ? projects[0] : null;

   return {
      projects,
      project: project || defaultProject,
      selectedProjectId,
      setSelectedProjectId,
      hasProjects
   };
};
