
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { 
  Home, Users, ClipboardCheck, FileText, UserPlus, Target, Key, 
  Package, CreditCard, BarChart2, FileSearch, BookOpen, User, 
  Settings, CheckSquare, Upload, Menu, X
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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Only visible on lg breakpoint */}
      {!isMobile && <DashboardSidebar />}
      
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

export function DashboardSidebar() {
  const { state } = useAuth();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;

  // Use the appropriate navigation groups based on user role
  const navGroups = isAdmin ? adminNavGroups : userNavGroups;

  return (
    <div className="min-w-[240px] max-w-[240px] bg-sidebar flex flex-col h-full border-r transition-all duration-300 ease-in-out overflow-y-auto">
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
