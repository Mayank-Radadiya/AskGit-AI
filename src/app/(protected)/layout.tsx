import AppSidebar from "@/components/global/app-sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { FC } from "react";

interface layoutProps {
   children: React.ReactNode;
}

const sidebarLayout: FC<layoutProps> = ({ children }) => {
   return (
      <>
         <SidebarProvider>
            <AppSidebar />
            <main className="m-2 w-full">
               <div className="flex items-center gap-2 rounded-md bg-sidebar p-2 px-4 shadow">
                  {/* <Searchbar/> */}
                  <div className="ml-auto"></div>
                  <UserButton />
               </div>

               <div className="h-4"></div>
               {/* main Content */}
               <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md bg-sidebar p-4 shadow">
                  {children}
               </div>
            </main>
         </SidebarProvider>
      </>
   );
};

export default sidebarLayout;
