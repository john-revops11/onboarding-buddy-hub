
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  Users, 
  CheckSquare, 
  Key, 
  Search,
  FileUp,
  UploadCloud,
  BarChart3,
  BookOpen,
  LineChart,
  FileBarChart,
  Plus,
  UserPlus,
  CreditCard,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// User navigation groups
export const userNavGroups: NavGroup[] = [
  {
    title: "Home",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      }
    ]
  },
  {
    title: "Content",
    items: [
      {
        name: "Latest Insights",
        path: "/insights",
        icon: LineChart,
      },
      {
        name: "Top Opportunities",
        path: "/opportunities",
        icon: BarChart3,
      },
      {
        name: "Diagnostic Reviews",
        path: "/diagnostic-reviews",
        icon: FileBarChart,
      },
      {
        name: "Knowledge Hub",
        path: "/knowledge-hub",
        icon: BookOpen,
      },
    ]
  },
  {
    title: "Account",
    items: [
      {
        name: "Data Uploads",
        path: "/data-uploads",
        icon: UploadCloud,
      },
      {
        name: "Profile",
        path: "/profile",
        icon: User,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ]
  }
];

// Admin navigation groups
export const adminNavGroups: NavGroup[] = [
  {
    title: "Home",
    items: [
      {
        name: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
      },
      {
        name: "Checklists",
        path: "/admin/checklists",
        icon: CheckSquare,
      },
      {
        name: "Files",
        path: "/admin/files",
        icon: FileUp,
      }
    ]
  },
  {
    title: "Client Journey",
    items: [
      {
        name: "Onboard Client",
        path: "/admin/onboarding",
        icon: UserPlus,
      },
      {
        name: "Opportunities",
        path: "/admin/opportunities",
        icon: BarChart3,
      }
    ]
  },
  {
    title: "Insights & Reviews",
    items: [
      {
        name: "Insights",
        path: "/admin/insights",
        icon: LineChart,
      },
      {
        name: "Diagnostic Reviews",
        path: "/admin/diagnostic-reviews",
        icon: FileBarChart,
      },
    ]
  },
  {
    title: "Platform",
    items: [
      {
        name: "API Keys",
        path: "/admin/api-keys",
        icon: Key,
      },
      {
        name: "Add-ons",
        path: "/admin/addons",
        icon: Plus,
      },
    ]
  },
  {
    title: "Billing",
    items: [
      {
        name: "Subscriptions",
        path: "/admin/subscriptions",
        icon: CreditCard,
      },
    ]
  }
];
