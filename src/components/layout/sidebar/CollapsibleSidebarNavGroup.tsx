
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
  const isGroupActive = items.some(item => currentPath.startsWith(item.path));
  
  // Don't show the collapse/expand button if sidebar is collapsed
  return (
    <div className="mb-4">
      {!collapsed && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between py-2 px-3 text-xs font-semibold uppercase tracking-wider transition-colors",
            isGroupActive 
              ? "text-brand dark:text-brand/80" 
              : "text-muted-foreground hover:text-brand/70"
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
        <div className={`mt-1 space-y-1 ${collapsed ? "" : "pl-2"}`}>
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath.startsWith(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all w-full",
                  isActive 
                    ? "bg-brand/10 text-brand font-semibold border-l-4 border-brand" 
                    : "text-sidebar-foreground hover:bg-brand/5 hover:text-brand border-l-4 border-transparent",
                  collapsed ? "justify-center" : ""
                )}
                title={collapsed ? item.name : undefined}
              >
                {IconComponent && (
                  <IconComponent 
                    size={collapsed ? 22 : 18} 
                    className={cn(
                      "transition-colors",
                      isActive 
                        ? "text-brand" 
                        : "text-muted-foreground group-hover:text-sidebar-accent"
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
