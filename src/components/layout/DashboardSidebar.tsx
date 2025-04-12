import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Home, Users, ClipboardCheck, FileText, UserPlus, Target, Key, Package, CreditCard, BarChart2, FileSearch, BookOpen, User, Settings, CheckSquare, Upload } from "lucide-react";

import { SearchBar } from "./sidebar/SearchBar";
import { LogoutButton } from "./sidebar/LogoutButton";
import { UserMenu } from "./sidebar/UserMenu";
import { ToolsSection } from "./sidebar/ToolsSection";
import { SidebarNavGroup } from "./sidebar/SidebarNavGroup";
import { adminNavGroups, userNavGroups } from "./sidebar/SidebarNavData";
import { TopBar } from "./TopBar";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardSidebarProps) {
  const { state } = useAuth();
  const isAdmin = state.user?.role === "admin";
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <TopBar />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// Create a mapping of icon names to components
const iconComponentMap = {
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

export function DashboardSidebar() {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;

  // Use the appropriate navigation groups based on user role
  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  return (
    <div className="min-w-[240px] max-w-[240px] bg-sidebar flex flex-col h-full border-r transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
            alt="Revify Logo"
            className="h-12 w-auto"
          />
          <span className="font-bold text-sm mt-2 text-primary-700">Revify</span>
        </div>
        
        <SearchBar />
        
        <div className="mb-6 overflow-y-auto">
          {navGroups.map((group, index) => (
            <SidebarNavGroup
              key={index}
              title={group.title}
              items={group.items.map(item => ({
                name: item.title,
                path: item.href,
                icon: iconComponentMap[item.icon as keyof typeof iconComponentMap]
              }))}
              currentPath={currentPath}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <ToolsSection />
        
        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
