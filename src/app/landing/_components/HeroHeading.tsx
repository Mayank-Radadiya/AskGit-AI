"use client";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

const HeroHeading: FC = () => {
   const { isSignedIn } = useAuth();
   const router = useRouter();

   const getStartHandle = async () => {
      if (isSignedIn) {
         toast.success("Welcome Back 😃");
         router.push("/dashboard");
      } else {
         toast.success("Please Sign In 👍");
         router.push("/sign-in");
      }
   };

   return (
      <div className="dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex min-h-screen w-full items-center justify-center bg-white dark:bg-black">
         {/* Radial gradient for the container */}
         <div className="absolute right-10 top-8 z-50 text-xl">
            <InteractiveHoverButton
               className="rounded-md bg-blue-300"
               onClick={() => getStartHandle()}
            >
               Login 😇
            </InteractiveHoverButton>
         </div>
         <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

         <div className="relative z-20 mx-auto grid max-w-7xl gap-12 px-4 py-20 text-center">
            <div className="animate-on-scroll opacity-0">
               <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl md:text-6xl">
                  <p className="text-8xl"> AskGit AI:</p> Your Intelligent
                  Companion <br /> for Git Repositories
               </h1>
               <p className="relative z-20 mx-auto mb-8 max-w-xl bg-gradient-to-b from-neutral-400 to-neutral-500 bg-clip-text text-xl font-bold text-gray-900 text-transparent">
                  Paste your Git repository link, ask questions, and unlock
                  insights effortlessly.
               </p>
               <div className="flex justify-center gap-4">
                  <div className="flex justify-center gap-4">
                     <button
                        className="inline-flex transform items-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl"
                        onClick={() => getStartHandle()}
                     >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                     </button>
                     <button
                        className="inline-flex transform items-center rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:text-black hover:shadow-lg"
                        onClick={() =>
                           redirect(
                              "https://github.com/Mayank-Radadiya/AskGit-AI.git",
                           )
                        }
                     >
                        Learn More
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default HeroHeading;
