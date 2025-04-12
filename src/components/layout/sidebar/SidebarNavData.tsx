
import { Home, LayoutDashboard, Settings, LineChart, Upload, FileText, TrendingUp, LightbulbIcon } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["user", "admin"],
  },
  {
    title: "Welcome",
    href: "/welcome",
    icon: <Home className="h-5 w-5" />,
    roles: ["user", "admin"]
  },
  {
    title: "Insights",
    href: "/insights",
    icon: <LineChart className="h-5 w-5" />,
    roles: ["user", "admin"]
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ["user", "admin"]
  },
  {
    title: "Data Uploads",
    href: "/data-uploads",
    icon: <Upload className="h-5 w-5" />,
    roles: ["user", "admin"]
  },
  {
    title: "Admin",
    href: "/admin",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin"],
  },
];

// Define admin navigation groups
export const adminNavGroups = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Onboarding",
        href: "/admin/onboarding",
        icon: "UserPlus",
      },
      {
        title: "Subscriptions",
        href: "/admin/subscriptions",
        icon: "CreditCard",
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: "Users",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Files",
        href: "/admin/files",
        icon: "FileText",
      },
      {
        title: "Opportunities",
        href: "/admin/opportunities",
        icon: "Target",
      },
      {
        title: "Insights",
        href: "/admin/insights",
        icon: "LineChart",
      },
    ],
  },
];

// Define user navigation groups
export const userNavGroups = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "Welcome",
        href: "/welcome",
        icon: "Home",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        title: "Insights",
        href: "/insights",
        icon: "LineChart",
      },
      {
        title: "Opportunities",
        href: "/opportunities",
        icon: "TrendingUp",
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        title: "Data Uploads",
        href: "/data-uploads",
        icon: "Upload",
      },
      {
        title: "Reviews",
        href: "/diagnostic-reviews",
        icon: "ClipboardCheck",
      },
    ],
  },
];
