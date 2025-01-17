"use client";

import { ReactNode } from "react";

interface FeatureCardProps {
   icon: ReactNode;
   title: string;
   description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
   return (
      <div className="animate-on-scroll rounded-xl bg-white p-6 opacity-0 shadow-lg transition-shadow hover:shadow-xl">
         <div className="mb-4 inline-block rounded-full bg-blue-50 p-3">
            {icon}
         </div>
         <h3 className="mb-3 text-xl font-semibold">{title}</h3>
         <p className="text-gray-600">{description}</p>
      </div>
   );
}
