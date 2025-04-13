
import { SidebarNavGroup } from "./types";

export const userNavGroups: SidebarNavGroup[] = [
  {
    title: "Onboarding",
    items: [
      {
        title: "Dashboard",
        icon: "Home",
        href: "/dashboard",
      },
      {
        title: "Onboarding",
        icon: "UserPlus",
        href: "/onboarding",
      }
    ],
  },
  {
    title: "Latest Insights",
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
      }
    ],
  },
  {
    title: "Top Opportunities",
    items: [
      {
        title: "Opportunities",
        icon: "Target",
        href: "/opportunities",
      },
      {
        title: "Knowledge Hub",
        icon: "BookOpen",
        href: "/knowledge-hub",
      }
    ],
  },
  {
    title: "Data Uploads",
    items: [
      {
        title: "Data Uploads",
        icon: "Upload",
        href: "/data-uploads",
      }
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
      }
    ],
  }
];
