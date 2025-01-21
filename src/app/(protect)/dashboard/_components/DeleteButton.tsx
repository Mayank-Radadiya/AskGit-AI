"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { FC } from "react";
import { toast } from "sonner";

interface DeleteButtonProps {
   projectId: string;
}

const DeleteButton: FC<DeleteButtonProps> = ({ projectId }) => {
   const deleteProject = api.delete.deleteProject.useMutation();

   const handle = async () => {
      try {
         await deleteProject.mutateAsync({ projectId });
         toast.success("Project deleted successfully");
      } catch (error) {
         toast.error("Failed to delete project");
      }
   };

   return (
      <Button onClick={handle} className="bg-red-400">
         Delete
      </Button>
   );
};

export default DeleteButton;
