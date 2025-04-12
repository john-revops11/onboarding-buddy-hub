import { Home, LayoutDashboard, Settings } from "lucide-react";

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
    title: "Admin",
    href: "/admin",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin"],
  },
];
