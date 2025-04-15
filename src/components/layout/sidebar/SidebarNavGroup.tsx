
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
            ? "text-[#9b87f5] dark:text-[#7E69AB]" 
            : "text-muted-foreground hover:text-primary-500/80"
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
                    ? "bg-[#9b87f5]/10 text-[#9b87f5] font-semibold border-l-4 border-[#9b87f5]" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground border-l-4 border-transparent"
                )}
              >
                {IconComponent && (
                  <IconComponent 
                    size={18} 
                    className={cn(
                      "transition-colors",
                      isActive 
                        ? "text-[#9b87f5]" 
                        : "text-muted-foreground group-hover:text-sidebar-accent"
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
