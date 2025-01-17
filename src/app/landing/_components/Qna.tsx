import { ArrowRight } from "lucide-react";
import { FC } from "react";
import { faqs } from "../_constants/data";

const Qna: FC = () => {
   return (
      <div className="bg-white py-20">
         <div className="mx-auto max-w-3xl px-4">
            <div className="animate-on-scroll mb-16 text-center opacity-0">
               <h2 className="mb-4 text-4xl font-bold">
                  Got Questions? We've Got Answers!
               </h2>
               <p className="text-xl text-gray-600">
                  Everything you need to know about AskGit AI
               </p>
            </div>
            <div className="space-y-6">
               {faqs.map((faq, index) => (
                  <details
                     key={index}
                     className="animate-on-scroll group rounded-lg bg-gray-50 p-6 opacity-0 transition-all duration-500 hover:shadow-xl"
                  >
                     <summary className="flex cursor-pointer items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                           {faq.question}
                        </h3>
                        <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform group-open:rotate-180">
                           <ArrowRight className="h-4 w-4" />
                        </span>
                     </summary>
                     <p className="mt-4 text-gray-600 transition-all duration-500 ease-in-out">
                        {faq.answer}
                     </p>
                  </details>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Qna;
