import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
   createProject: protectedProcedure
      .input(
         z.object({
            projectName: z.string(),
            repoUrl: z.string(),
            githubToken: z.string().optional(),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         // Validate if the user exists
         const userExists = await ctx.db.user.findUnique({
            where: { id: ctx.user.userId! },
         });

         if (!userExists) {
            throw new Error("User does not exist");
         }

         // Create the project and link to the user
         const project = await ctx.db.project.create({
            data: {
               githubUrl: input.repoUrl,
               name: input.projectName,
               userToProjects: {
                  create: {
                     userId: ctx.user.userId!,
                  },
               },
            },
         });

         return project;
      }),

   getAllProjects: protectedProcedure.query(async ({ ctx }) => {
      return await ctx.db.project.findMany({
         where: {
            userToProjects: {
               some: {
                  userId: ctx.user.userId!,
               },
            },
            deletedAt: null,
         },
      });
   }),
});
