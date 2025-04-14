
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function CollapsibleSidebarNavGroup({ 
  title, 
  items, 
  currentPath, 
  collapsed 
}: CollapsibleNavGroupProps) {
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
          className={cn(
            "flex w-full items-center justify-between py-2 px-3 text-xs font-semibold uppercase tracking-wider",
            isGroupActive ? "text-accentGreen-600" : "text-muted-foreground"
          )}
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
        <div className={cn("mt-1 space-y-1", collapsed ? "" : "pl-2")}>
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full", 
                  isActive 
                    ? "bg-accentGreen-600/10 text-accentGreen-600 font-semibold" 
                    : "text-sidebar-foreground hover:bg-primary-600/5 hover:text-primary-600",
                  collapsed ? "justify-center" : ""
                )}
                title={collapsed ? item.name : undefined}
              >
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accentGreen-600" 
                    aria-hidden="true" />
                )}
                
                {IconComponent && (
                  <IconComponent 
                    size={collapsed ? 22 : 18} 
                    className={cn(
                      isActive 
                        ? "text-accentGreen-600" 
                        : "text-muted-foreground group-hover:text-primary-600"
                    )}
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
