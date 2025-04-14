
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export interface NavGroupProps {
  title: string;
  items: NavItemProps[];
  currentPath: string;
}

export function SidebarNavGroup({ title, items, currentPath }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  
  // Check if any item in this group is active
  const isGroupActive = items.some(item => currentPath === item.path);
  
  return (
    <div className="mb-4">
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
      
      {isOpen && (
        <div className="mt-1 space-y-1 pl-2">
          {items.map((item) => {
            // Check if item.icon is defined before rendering
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accentGreen-600/10 text-accentGreen-600 font-semibold" 
                    : "text-sidebar-foreground hover:bg-primary-600/5 hover:text-primary-600"
                )}
              >
                {isActive && (
                  <span 
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accentGreen-600" 
                    aria-hidden="true" 
                  />
                )}
                
                {IconComponent && (
                  <IconComponent 
                    size={18} 
                    className={cn(
                      isActive 
                        ? "text-accentGreen-600" 
                        : "text-muted-foreground group-hover:text-primary-600"
                    )}
                  />
                )}
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
