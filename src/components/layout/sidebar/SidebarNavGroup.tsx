
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
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
      
      {isOpen && (
        <div className="mt-1 space-y-1 pl-2">
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-brand/10 text-brand font-semibold border-l-4 border-brand" 
                    : "text-sidebar-foreground hover:bg-brand/5 hover:text-brand border-l-4 border-transparent"
                )}
              >
                {IconComponent && (
                  <IconComponent 
                    size={18} 
                    className={cn(
                      "transition-colors",
                      isActive 
                        ? "text-brand" 
                        : "text-muted-foreground group-hover:text-brand"
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
