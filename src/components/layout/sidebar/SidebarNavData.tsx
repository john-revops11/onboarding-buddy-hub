
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
