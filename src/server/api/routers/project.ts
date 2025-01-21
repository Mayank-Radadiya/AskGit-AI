// import { z } from "zod";
// import { createTRPCRouter, protectedProcedure } from "../trpc";
// import { pollCommits, deleteProject } from "@/lib/github";
// import { TRPCError } from "@trpc/server";
// import { indexGithubRepo } from "@/lib/github_loader";

// export const projectRouter = createTRPCRouter({
//    createProject: protectedProcedure
//       .input(
//          z.object({
//             projectName: z.string(),
//             repoUrl: z.string(),
//             githubToken: z.string().optional(),
//          }),
//       )
//       .mutation(async ({ ctx, input }) => {
//          // Validate if the user exists
//          const userExists = await ctx.db.user.findUnique({
//             where: { id: ctx.user.userId! },
//          });

//          if (!userExists) {
//             throw new Error("User does not exist");
//          }

//          // Create the project and link to the user
//          const project = await ctx.db.project.create({
//             data: {
//                githubUrl: input.repoUrl,
//                name: input.projectName,
//                userToProjects: {
//                   create: {
//                      userId: ctx.user.userId!,
//                   },
//                },
//             },
//          });

//          // await indexGithubRepo(project.id, input.repoUrl, input.githubToken);

//          await pollCommits(project.id);

//          return project;
//       }),

//    getProjects: protectedProcedure.query(async ({ ctx }) => {
//       try {
//          // Fetch all projects linked to the user
//          const projects = await ctx.db.project.findMany({
//             where: {
//                userToProjects: {
//                   some: {
//                      userId: ctx.user.userId!,
//                   },
//                },
//                deletedAt: null, // Exclude deleted projects
//             },
//          });

//          return projects;
//       } catch (error) {
//          console.error("Error fetching projects:", error);
//          throw new TRPCError({
//             code: "INTERNAL_SERVER_ERROR",
//             message: "Failed to fetch projects.",
//          });
//       }
//    }),

//    getCommits: protectedProcedure
//       .input(
//          z.object({
//             projectId: z.string(),
//          }),
//       )
//       .query(async ({ ctx, input }) => {
//          await pollCommits(input.projectId).then().catch(console.error);
//          return await ctx.db.commit.findMany({
//             where: {
//                projectId: input.projectId,
//             },
//          });
//       }),
// });


import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits, deleteProject } from "@/lib/github";
import { TRPCError } from "@trpc/server";
import { indexGithubRepo } from "@/lib/github_loader";

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
         const user = await ctx.db.user.findUnique({
            where: { id: ctx.user.userId! },
         });

         if (!user) {
            throw new TRPCError({
               code: "UNAUTHORIZED",
               message: "User does not exist.",
            });
         }

         // Create the project and link to the user
         try {
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

            // Index the GitHub repository (optional step)
            // try {
            //    if (input.githubToken) {
            //       await indexGithubRepo(
            //          project.id,
            //          input.repoUrl,
            //          input.githubToken,
            //       );
            //    }
            // } catch (error) {
            //    console.error("Failed to index GitHub repo:", error);
            //    throw new TRPCError({
            //       code: "INTERNAL_SERVER_ERROR",
            //       message: "Failed to index the GitHub repository.",
            //    });
            // }

            // Poll commits for the new project
            try {
               await pollCommits(project.id);
            } catch (error) {
               console.error("Error polling commits:", error);
               throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to poll commits.",
               });
            }

            return project;
         } catch (error) {
            console.error("Error creating project:", error);
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: "Failed to create project.",
            });
         }
      }),

   getProjects: protectedProcedure.query(async ({ ctx }) => {
      try {
         // Fetch all projects linked to the user
         const projects = await ctx.db.project.findMany({
            where: {
               userToProjects: {
                  some: {
                     userId: ctx.user.userId!,
                  },
               },
               deletedAt: null, // Exclude deleted projects
            },
         });

         return projects;
      } catch (error) {
         console.error("Error fetching projects:", error);
         throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch projects.",
         });
      }
   }),

   getCommits: protectedProcedure
      .input(
         z.object({
            projectId: z.string(),
         }),
      )
      .query(async ({ ctx, input }) => {
         try {
            await pollCommits(input.projectId);
            const commits = await ctx.db.commit.findMany({
               where: {
                  projectId: input.projectId,
               },
            });

            return commits;
         } catch (error) {
            console.error("Error fetching commits:", error);
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: "Failed to fetch commits.",
            });
         }
      }),
});
