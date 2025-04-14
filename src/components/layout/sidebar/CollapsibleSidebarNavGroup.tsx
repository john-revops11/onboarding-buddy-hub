
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
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors", 
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  collapsed ? "w-full justify-center" : "w-full"
                )}
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
