
import { SidebarNavGroup } from "./types";

export const adminNavGroups: SidebarNavGroup[] = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        icon: "Home",
        href: "/admin",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Users",
        icon: "Users",
        href: "/admin/users",
      },
      {
        title: "Checklists",
        icon: "ClipboardCheck",
        href: "/admin/checklists",
      },
      {
        title: "Files",
        icon: "FileText",
        href: "/admin/files",
      },
    ],
  },
  {
    title: "Client Journey",
    items: [
      {
        title: "Onboard Client",
        icon: "UserPlus",
        href: "/admin/onboarding",
      },
      {
        title: "Opportunities",
        icon: "Target",
        href: "/admin/opportunities",
      },
    ],
  },
  {
    title: "Insights & Reviews",
    items: [
      {
        title: "Insights",
        icon: "BarChart2",
        href: "/admin/insights",
      },
      {
        title: "Diagnostic Reviews",
        icon: "FileSearch",
        href: "/admin/diagnostic-reviews",
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Add-ons",
        icon: "Package",
        href: "/admin/addons",
      },
      {
        title: "Subscriptions",
        icon: "CreditCard",
        href: "/admin/subscriptions",
      },
    ],
  },
];
