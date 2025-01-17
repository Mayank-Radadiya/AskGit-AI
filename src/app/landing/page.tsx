"use client";
// #fafafa
// #2362eb

import { useEffect, useState } from "react";
import { howItWorksSteps } from "./_constants/data";
import HeroHeading from "./_components/HeroHeading";
import FooterSection from "./_components/FooterSection";
import Qna from "./_components/Qna";
import PriceSection from "./_components/PriceSection";
import ComparisonTable from "./_components/ComparisonTable";
import ChooseUS from "./_components/ChooseUS";
import WorkSection from "./_components/WorkSection";
import FeaturesSection from "./_components/ FeaturesSection";

export default function Home() {
   const [currentStep, setCurrentStep] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentStep((prev) => (prev + 1) % howItWorksSteps.length);
      }, 3000);

      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  entry.target.classList.add("animate-fade-in");
                  observer.unobserve(entry.target);
               }
            });
         },
         { threshold: 0.1 },
      );

      document.querySelectorAll(".animate-on-scroll").forEach((element) => {
         observer.observe(element);
      });

      return () => {
         clearInterval(interval);
         observer.disconnect();
      };
   }, []);

   return (
      <div className="relative min-h-screen bg-white">
         {/* Hero Section */}
         <HeroHeading />

         {/* Features Section */}

         <FeaturesSection />

         {/* How It Works Section */}
         <WorkSection currentStep={currentStep} />

         {/* Why Choose Us Section */}
         <div className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4">
               <ChooseUS />

               {/* Comparison Table */}
               <ComparisonTable />
            </div>
         </div>

         {/* Pricing Section */}
         <PriceSection />

         {/* FAQ Section */}
         <Qna />

         {/* Footer */}
         <FooterSection />
      </div>
   );
}
