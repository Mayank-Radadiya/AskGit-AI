import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";

export const sidebarItem = [
  {
    id: 1,
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    id: 3,
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    id: 4,
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];
