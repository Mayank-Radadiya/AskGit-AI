import { FC } from "react";
import { features } from "../_constants/data";

const FeaturesSection: FC = ({}) => {
   return (
      <div className="bg-white py-20">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">
               What Makes AskGit AI Powerful?
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {features.map((feature, index) => (
                  <div
                     key={index}
                     className="group rounded-xl border border-gray-100 bg-white p-6 transition duration-300 hover:shadow-xl"
                  >
                     <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition duration-300 group-hover:bg-blue-600">
                        <div className="text-blue-600 group-hover:text-white">
                           {feature.icon}
                        </div>
                     </div>
                     <h3 className="mb-2 text-xl font-semibold">
                        {feature.title}
                     </h3>
                     <p className="text-gray-600">{feature.description}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default FeaturesSection;
