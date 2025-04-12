
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
    ],
  },
  {
    title: "Data Management",
    items: [
      {
        title: "Data Uploads",
        icon: "Upload",
        href: "/data-uploads",
      },
      {
        title: "Onboarding",
        icon: "CheckSquare",
        href: "/onboarding",
      },
    ],
  },
];
