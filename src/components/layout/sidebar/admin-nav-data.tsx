
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
    title: "Client Management",
    items: [
      {
        title: "Clients",
        icon: "Users",
        href: "/admin/clients",
      },
      {
        title: "Onboarding",
        icon: "UserPlus",
        href: "/admin/onboarding",
      },
      {
        title: "Opportunities",
        icon: "Target",
        href: "/admin/opportunities",
      },
      {
        title: "Files",
        icon: "FileText",
        href: "/admin/files",
      },
    ],
  },
  {
    title: "System Settings",
    items: [
      {
        title: "Subscription Tiers",
        icon: "CreditCard",
        href: "/admin/subscriptions",
      },
      {
        title: "Add-ons",
        icon: "Package",
        href: "/admin/addons",
      },
      {
        title: "Onboarding Templates",
        icon: "ClipboardCheck",
        href: "/admin/checklists",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Admin Users",
        icon: "Shield",
        href: "/admin/users",
      },
      {
        title: "Settings",
        icon: "Settings",
        href: "/admin/settings",
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
];
