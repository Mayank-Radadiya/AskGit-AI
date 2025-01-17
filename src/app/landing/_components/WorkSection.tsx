import { FC } from "react";
import { howItWorksSteps } from "../_constants/data";
import { MultiStepLoaderDemo } from "./_components/HowToUseGitAi";

interface WorkSectionProps {
   currentStep: number;
}

const WorkSection: FC<WorkSectionProps> = ({ currentStep }) => {
   return (
      <div className="bg-gray-50 py-20">
         <div className="mx-auto max-w-7xl px-4">
            <div className="animate-on-scroll mb-16 text-center opacity-0">
               <h2 className="mb-4 text-4xl font-bold">
                  How to Use AskGit AI?
               </h2>
               <p className="text-xl text-gray-600">
                  Three simple steps to unlock your repository's potential
               </p>
            </div>
            <div className="relative">
               <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 transform bg-blue-100"></div>
               <div className="relative grid gap-8 md:grid-cols-3">
                  {howItWorksSteps.map((step, index) => (
                     <div
                        key={index}
                        className={`relative transform rounded-xl bg-white p-8 opacity-100 shadow-lg transition-all duration-500 ${
                           currentStep === index
                              ? "z-10 scale-105 ring-2 ring-blue-400"
                              : ""
                        } hover:z-10 hover:scale-105 hover:ring-2 hover:ring-blue-400`}
                     >
                        <div className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                           {index + 1}
                        </div>
                        <div className="pt-4">
                           <div className="mb-4 text-blue-600">{step.icon}</div>
                           <h3 className="mb-2 text-xl font-semibold">
                              {step.title}
                           </h3>
                           <p className="text-gray-600">{step.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="mt-20 flex max-h-20 w-full justify-center  relative object-contain">
               <MultiStepLoaderDemo />
            </div>
         </div>
      </div>
   );
};

export default WorkSection;
