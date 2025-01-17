import { FC } from "react";
import { stats } from "../_constants/data";

const ChooseUS: FC = ({}) => {
   return (
      <>
         <div className="animate-on-scroll mb-16 text-center opacity-0">
            <h2 className="mb-4 text-4xl font-bold">Why Choose AskGit AI?</h2>
            <p className="text-xl text-gray-600">
               Compare and see the difference
            </p>
         </div>
         <div className="mb-16 grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
               <div
                  key={index}
                  className="animate-on-scroll text-center opacity-0 transition-all duration-700"
               >
                  <div className="mb-2 text-4xl font-bold text-blue-600">
                     {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
               </div>
            ))}
         </div>
      </>
   );
};

export default ChooseUS;
