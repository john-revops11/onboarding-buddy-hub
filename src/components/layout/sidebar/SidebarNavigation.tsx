
import { useLocation, useNavigate } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarNavigationProps {
  items: NavItem[];
  currentPath: string;
}

export function SidebarNavigation({ items, currentPath }: SidebarNavigationProps) {
  const navigate = useNavigate();
  
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            asChild
            isActive={currentPath === item.path}
            tooltip={item.name}
          >
            <a 
              href={item.path} 
              onClick={(e) => { 
                e.preventDefault();
                navigate(item.path);
              }}
              className="justify-center"
            >
              <item.icon size={18} />
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
