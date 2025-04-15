
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { X, Menu } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { TopBar } from "./TopBar";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Only visible on lg breakpoint */}
      {!isMobile && <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      
      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        !isMobile && collapsed ? "ml-[70px]" : ""
      )}>
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
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-sidebar-accent/10 text-muted-foreground transition-colors"
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

// Export the icon component mapping for reuse
export {
  DesktopSidebar,
  MobileSidebar,
};
