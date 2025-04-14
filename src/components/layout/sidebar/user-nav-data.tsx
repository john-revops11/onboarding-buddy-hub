
import { SidebarNavGroup } from "./types";

export const userNavGroups: SidebarNavGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        icon: "Home",
        href: "/dashboard",
      }
    ],
  },
  {
    title: "Onboarding",
    items: [
      {
        title: "Onboarding",
        icon: "UserPlus",
        href: "/onboarding",
      }
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Latest Insights",
        icon: "BarChart2",
        href: "/insights",
      },
      {
        title: "Top Opportunities",
        icon: "Target",
        href: "/opportunities",
      }
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
        title: "Knowledge Hub",
        icon: "BookOpen",
        href: "/knowledge-hub",
      }
    ],
  },
  {
    title: "User",
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
