"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { loadingStates } from "../../_constants/data";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function MultiStepLoaderDemo() {
   const [loading, setLoading] = useState(false);
   return (
      <div className="flex w-full items-center justify-center">
         {/* Core Loader Modal */}
         <Loader
            loadingStates={loadingStates}
            loading={loading}
            duration={2000}
         />

         {/* <button
            onClick={() => setLoading(true)}
            className="text-neutarl-700 rounded-md border border-black bg-[#65a0e0] px-4 py-2 text-sm transition duration-200 hover:shadow-[6px_6px_6px_0px_rgba(0,0,0)]"
         >
            Get Clear instructions
         </button> */}
         <InteractiveHoverButton className="text-xl bg-blue-500 rounded-md" onClick={() => setLoading(true)}>
            Get Clear instructions 👉
         </InteractiveHoverButton>

         {loading && (
            <button
               className="fixed right-4 top-4 z-[120] text-black dark:text-white"
               onClick={() => setLoading(false)}
            >
               <IconSquareRoundedX className="h-10 w-10" />
            </button>
         )}
      </div>
   );
}
