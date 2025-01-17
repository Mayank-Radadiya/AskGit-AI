"use client";

import { Check } from "lucide-react";

interface PricingCardProps {
   name: string;
   price: string;
   features: string[];
   highlighted?: boolean;
}

export function PricingCard({
   name,
   price,
   features,
   highlighted = false,
}: PricingCardProps) {
   return (
      <div
         className={`rounded-xl p-8 ${highlighted ? "bg-blue-600 text-white ring-4 ring-blue-200 hover:bg-blue-700" : "bg-white hover:bg-gray-100"} animate-on-scroll opacity-0 shadow-lg`}
      >
         <h3 className="mb-2 text-2xl font-bold">{name}</h3>
         <div className="mb-6">
            <span className="text-4xl font-bold">{price}</span>
            {price !== "Custom" && <span className="text-lg">/month</span>}
         </div>
         <ul className="mb-8 space-y-4">
            {features.map((feature, index) => (
               <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>{feature}</span>
               </li>
            ))}
         </ul>
         <button
            className={`w-full rounded-lg py-3 font-semibold transition-colors ${
               highlighted
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
         >
            {price === "$0" ? "Get Started" : "Start Free Trial"}
         </button>
      </div>
   );
}
