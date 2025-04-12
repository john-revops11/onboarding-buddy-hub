
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { LogoutButton } from "./LogoutButton";
import { ToolsSection } from "./ToolsSection";
import { CollapsibleSidebarNavGroup } from "./CollapsibleSidebarNavGroup";
import { adminNavGroups, userNavGroups } from "./SidebarNavData";

// Create a mapping of icon names to components
import {
  Home, Users, ClipboardCheck, FileText, UserPlus, Target, Key,
  Package, CreditCard, BarChart2, FileSearch, BookOpen, User,
  Settings, CheckSquare, Upload
} from "lucide-react";

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

interface DesktopSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function DesktopSidebar({ collapsed, setCollapsed }: DesktopSidebarProps) {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;

  // Use the appropriate navigation groups based on user role
  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  return (
    <div className={`bg-sidebar flex flex-col h-full border-r transition-all duration-300 ease-in-out overflow-y-auto ${collapsed ? 'w-[70px]' : 'min-w-[240px] max-w-[240px]'}`}>
      <div className="p-4 relative">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
            alt="Revify Logo"
            className="h-16 w-auto"
          />
          {!collapsed && <span className="font-bold text-lg mt-2 text-primary-700">Revify</span>}
        </div>
        
        {/* Toggle collapse button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-2 top-4 p-1.5 rounded-full hover:bg-sidebar-accent text-sidebar-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        
        {!collapsed && <SearchBar />}
        
        <div className="mb-6 overflow-y-auto">
          {navGroups.map((group, index) => (
            <CollapsibleSidebarNavGroup
              key={index}
              title={group.title}
              items={group.items.map(item => ({
                name: item.title,
                path: item.href,
                icon: iconComponentMap[item.icon as keyof typeof iconComponentMap],
              }))}
              currentPath={currentPath}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t">
        {!collapsed && <ToolsSection />}
        
        <div className="mt-3">
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
}
