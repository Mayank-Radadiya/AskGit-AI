import { FC } from "react";
import { PricingCard } from "./_components/PriceCard";
import { pricingPlans } from "../_constants/data";

interface PriceSectionProps {}

const PriceSection: FC<PriceSectionProps> = ({}) => {
   return (
      <div className="bg-gray-50 py-20">
         <div className="mx-auto max-w-7xl px-4">
            <div className="animate-on-scroll mb-16 text-center opacity-0">
               <h2 className="mb-4 text-4xl font-bold">
                  Choose a Plan That Fits Your Needs
               </h2>
               <p className="text-xl text-gray-600">
                  Start free and scale as you grow
               </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
               {pricingPlans.map((plan, index) => (
                  <PricingCard key={index} {...plan} />
               ))}
            </div>
         </div>
      </div>
   );
};

export default PriceSection;
