import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
   title: "AskGit AI",
   description:
      "Ask questions about your Git repositories and get instant, intelligent answers powered by AI.",
};

export default function RootLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   return (
      <ClerkProvider>
         <html lang="en" className={`${GeistSans.variable}`}>
            <body>
               <TRPCReactProvider>{children}</TRPCReactProvider>
               <Toaster richColors />
            </body>
         </html>
      </ClerkProvider>
   );
}
