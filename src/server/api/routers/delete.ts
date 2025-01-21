// server/api/routers/deleteProjectRouter.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const deleteProjectRouter = createTRPCRouter({
   deleteProject: protectedProcedure
      .input(
         z.object({
            projectId: z.string(),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         try {
            await ctx.db.project.delete({
               where: { id: input.projectId },
            });
         } catch (error) {
            console.error("Error deleting project:", error);
            throw new Error("Failed to delete project");
         }
      }),
});
