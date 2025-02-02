"use client";
import { Button } from "@/components/ui/button";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarTrigger,
   useSidebar,
} from "@/components/ui/sidebar";
import { sidebarItem } from "@/constants/SidebarConstants";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { Album, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { FC } from "react";

const AppSidebar: FC = ({}) => {
   const pathname = usePathname();
   const { open } = useSidebar();
   const { projects, selectedProjectId, setSelectedProjectId } = useProject();
   return (
      <Sidebar collapsible="icon" variant="floating">
         <SidebarHeader>
            <div
               className={cn("flex items-center justify-between gap-2", {
                  "flex-col-reverse": !open,
               })}
            >
               <Link href="/dashboard">
                  <Image src="logo.svg" width={40} height={40} alt="logo" />
               </Link>
               {open && <h1 className="text-xl font-bold">AskGit AI</h1>}
               <SidebarTrigger />
            </div>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel> Application</SidebarGroupLabel>

               <SidebarGroupContent>
                  <SidebarMenu>
                     {sidebarItem.map((item) => {
                        return (
                           <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton asChild>
                                 <Link
                                    href={item.url}
                                    className={cn(
                                       {
                                          "!bg-primary !text-white":
                                             pathname === item.url,
                                       },
                                       "mb-1 list-none",
                                    )}
                                 >
                                    <item.icon />
                                    {open && <span>{item.title}</span>}
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        );
                     })}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
               <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
               <SidebarMenu>
                  {projects?.length! > 0 ? (
                     projects?.map((item) => (
                        <SidebarMenuItem key={item.id}>
                           <SidebarMenuButton asChild>
                              <div
                                 onClick={() => {
                                    setSelectedProjectId(item.id);
                                    redirect("/dashboard");
                                 }}
                                 className="flex cursor-pointer items-center gap-2"
                              >
                                 <div
                                    className={cn(
                                       "flex h-7 w-7 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                                       {
                                          "bg-primary text-white":
                                             item.id === selectedProjectId,
                                       },
                                    )}
                                 >
                                    {item.name[0]!.toUpperCase()}
                                 </div>
                                 {open && (
                                    <span className="text-sm font-medium">
                                       {item.name}
                                    </span>
                                 )}
                              </div>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))
                  ) : (
                     <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <Album className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-500">
                           No projects found. Create a new project to get
                           started!
                        </p>
                     </div>
                  )}

                  <div className="h-2"></div>
                  {open && (
                     <SidebarMenuItem>
                        <Link href="/create">
                           <Button variant="outline">
                              <Plus />
                              Create Project
                           </Button>
                        </Link>
                     </SidebarMenuItem>
                  )}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
};

export default AppSidebar;
