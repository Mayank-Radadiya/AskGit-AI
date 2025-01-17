import { FC } from "react";
import { comparisonFeatures } from "../_constants/data";

const ComparisonTable: FC = ({}) => {
   return (
      <div className="animate-on-scroll mb-20 overflow-x-auto opacity-0">
         <table className="w-full border-collapse">
            <thead>
               <tr>
                  <th className="border-b-2 border-r-2 border-gray-200 bg-gray-50 p-4 text-left">
                     Feature
                  </th>
                  <th className="border-b-2 border-r-2 border-gray-200 bg-gray-50 p-4 text-center">
                     Traditional Tools
                  </th>
                  <th className="border-b-2 border-r-2 border-blue-200 bg-blue-50 p-4 text-center">
                     AskGit AI
                  </th>
               </tr>
            </thead>
            <tbody>
               {comparisonFeatures.map((feature, index) => (
                  <tr
                     key={index}
                     className="border-b-2 border-gray-100 transition-all duration-300 hover:bg-gray-50"
                  >
                     <td className="border-b-2 border-r-2 border-gray-200 p-4 text-sm text-gray-700">
                        {feature.name}
                     </td>
                     <td className="border-b-2 border-r-2 border-gray-200 p-4 text-center text-sm text-gray-700">
                        {feature.traditional}
                     </td>
                     <td className="border-b-2 border-r-2 border-gray-200 bg-blue-50 p-4 text-center text-sm text-blue-600">
                        {feature.askGitAi}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default ComparisonTable;
