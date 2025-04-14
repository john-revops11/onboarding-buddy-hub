
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { X, Menu } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar - Only visible on lg breakpoint */}
      {!isMobile && <DesktopSidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden",
        collapsed && !isMobile ? "w-[calc(100%-90px)]" : isMobile ? "w-full" : "w-[calc(100%-280px)]"
      )}>
        <TopBar 
          showMobileMenu={isMobile} 
          onMobileMenuClick={() => setDrawerOpen(true)} 
        />
        
        {/* Mobile Drawer - Only visible on sm and md breakpoints */}
        {isMobile && (
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="fixed inset-y-0 left-0 z-50 h-full max-w-[85vw] w-[320px] rounded-r-lg rounded-l-none">
              <button 
                onClick={() => setDrawerOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground p-1 rounded-full hover:bg-muted/30"
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
        
        <div className="flex-1 overflow-auto">
          <motion.div 
            className="p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Export the components
export { DesktopSidebar, MobileSidebar };
