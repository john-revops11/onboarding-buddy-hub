
import {
  Home,
  Users,
  ClipboardCheck,
  FileText,
  UserPlus,
  Target,
  Key,
  Package,
  CreditCard,
  BarChart2,
  FileSearch,
  BookOpen,
  User,
  Settings,
  CheckSquare,
  Upload,
} from "lucide-react";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
  external?: boolean;
  badge?: {
    content: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

// Define icon strings that match the imported Lucide icon names
const Icons = {
  Home,
  Users,
  ClipboardCheck,
  FileText,
  UserPlus,
  Target,
  Key,
  Package,
  CreditCard,
  BarChart2,
  FileSearch,
  BookOpen,
  User,
  Settings,
  CheckSquare,
  Upload,
};

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
        title: "API Keys",
        icon: "Key",
        href: "/admin/api-keys",
      },
      {
        title: "Add-ons",
        icon: "Package",
        href: "/admin/addons",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Subscriptions",
        icon: "CreditCard",
        href: "/admin/subscriptions",
      },
    ],
  },
];

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
