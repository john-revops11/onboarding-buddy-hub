
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { 
  Home, Users, ClipboardCheck, FileText, UserPlus, Target, Key, 
  Package, CreditCard, BarChart2, FileSearch, BookOpen, User, 
  Settings, CheckSquare, Upload, Menu, X, ChevronLeft, ChevronRight,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SearchBar } from "./sidebar/SearchBar";
import { LogoutButton } from "./sidebar/LogoutButton";
import { ToolsSection } from "./sidebar/ToolsSection";
import { SidebarNavGroup } from "./sidebar/SidebarNavGroup";
import { adminNavGroups, userNavGroups } from "./sidebar/SidebarNavData";
import { TopBar } from "./TopBar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardSidebarProps) {
  const { state } = useAuth();
  const isAdmin = state.user?.role === "admin";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Only visible on lg breakpoint */}
      {!isMobile && <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      
      <main className="flex-1 overflow-auto">
        <TopBar 
          showMobileMenu={isMobile} 
          onMobileMenuClick={() => setDrawerOpen(true)} 
        />
        
        {/* Mobile Drawer - Only visible on sm and md breakpoints */}
        {isMobile && (
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="fixed inset-y-0 left-0 z-50 h-full max-w-[80vw] w-[280px] rounded-r-lg rounded-l-none">
              <button 
                onClick={() => setDrawerOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <div className="h-full overflow-y-auto">
                <MobileSidebar onNavItemClick={() => setDrawerOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
        )}
        
        <motion.div 
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
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

export function MobileSidebar({ onNavItemClick }: { onNavItemClick: () => void }) {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Use the appropriate navigation groups based on user role
  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  const handleNavClick = (path: string) => {
    navigate(path);
    onNavItemClick();
  };

  return (
    <div className="min-w-full h-full flex flex-col">
      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
            alt="Revify Logo"
            className="h-16 w-auto"
          />
          <span className="font-bold text-lg mt-2 text-primary-700">Revify</span>
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
                icon: iconComponentMap[item.icon as keyof typeof iconComponentMap],
                onClick: () => handleNavClick(item.href)
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

interface DashboardSidebarInternalProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function DashboardSidebar({ collapsed, setCollapsed }: DashboardSidebarInternalProps) {
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

// Create a CollapsibleSidebarNavGroup component that supports the collapsed state
interface CollapsibleNavGroupProps {
  title: string;
  items: {
    name: string;
    path: string;
    icon: React.ComponentType<any>;
  }[];
  currentPath: string;
  collapsed: boolean;
}

function CollapsibleSidebarNavGroup({ title, items, currentPath, collapsed }: CollapsibleNavGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  
  // Check if any item in this group is active
  const isGroupActive = items.some(item => currentPath === item.path);
  
  // Don't show the collapse/expand button if sidebar is collapsed
  return (
    <div className="mb-4">
      {!collapsed && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between py-2 px-3 text-xs font-semibold uppercase tracking-wider ${
            isGroupActive ? "text-sidebar-accent" : "text-muted-foreground"
          }`}
        >
          <span>{title}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}
      
      {(isOpen || collapsed) && (
        <div className={`mt-1 space-y-1 ${collapsed ? "" : "pl-2"}`}>
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                } ${collapsed ? "w-full justify-center" : "w-full"}`}
                title={collapsed ? item.name : undefined}
              >
                {IconComponent && (
                  <IconComponent 
                    size={collapsed ? 22 : 18} 
                    className={isActive 
                      ? "text-sidebar-accent-foreground" 
                      : "text-muted-foreground group-hover:text-sidebar-accent"
                    }
                  />
                )}
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
