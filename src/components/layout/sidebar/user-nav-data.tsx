
import { SidebarNavGroup } from "./types";

export const userNavGroups: SidebarNavGroup[] = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        icon: "Home",
        href: "/dashboard",
      },
      {
        title: "Onboarding",
        icon: "CheckSquare",
        href: "/onboarding",
        badge: {
          content: "New",
          variant: "default",
        },
      },
    ],
  },
  {
    title: "Data & Insights",
    items: [
      {
        title: "Insights",
        icon: "BarChart2",
        href: "/insights",
      },
      {
        title: "Diagnostic Reviews",
        icon: "FileSearch",
        href: "/diagnostic-reviews",
      },
      {
        title: "Data Uploads",
        icon: "Upload",
        href: "/data-uploads",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Knowledge Hub",
        icon: "BookOpen",
        href: "/knowledge-hub",
      },
      {
        title: "Opportunities",
        icon: "Target",
        href: "/opportunities",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        icon: "User",
        href: "/profile",
      },
      {
        title: "Settings",
        icon: "Settings",
        href: "/settings",
      },
    ],
  },
];
