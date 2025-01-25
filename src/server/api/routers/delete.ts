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
            // Delete all related UserToProject entries
            await ctx.db.userToProject.deleteMany({
               where: { projectId: input.projectId },
            });

            // Delete all related commits
            await ctx.db.commit.deleteMany({
               where: { projectId: input.projectId },
            });

            // Delete all related source code embeddings
            await ctx.db.sourceCodeEmbedding.deleteMany({
               where: { projectId: input.projectId },
            });

            // Delete the project itself
            await ctx.db.project.delete({
               where: { id: input.projectId },
            });

            return { success: true };
         } catch (error) {
            console.error("Error deleting project:", error);
            throw new Error("Failed to delete project");
         }
      }),
});
