
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Settings, 
  Users, 
  CheckSquare, 
  Key, 
  LogOut,
  Menu,
  FileUp,
  UploadCloud,
  BarChart3
} from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarProvider
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

import { UserMenu } from "./sidebar/UserMenu";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { ToolsSection } from "./sidebar/ToolsSection";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardSidebarProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex w-full min-h-screen">
        <DashboardSidebar />
        <div className="flex-1">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto flex items-center space-x-2">
              <UserMenu />
            </div>
          </div>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function DashboardSidebar() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = state.user?.role === "admin";
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userNavItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Knowledge Hub",
      path: "/knowledge-hub",
      icon: FileText,
    },
    {
      name: "Opportunities",
      path: "/opportunities",
      icon: BarChart3,
    },
    {
      name: "Data Uploads",
      path: "/data-uploads",
      icon: UploadCloud,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const adminNavItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Checklists",
      path: "/admin/checklists",
      icon: CheckSquare,
    },
    {
      name: "Files",
      path: "/admin/files",
      icon: FileUp,
    },
    {
      name: "API Keys",
      path: "/admin/api-keys",
      icon: Key,
    },
    {
      name: "Opportunities",
      path: "/admin/opportunities",
      icon: BarChart3,
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/78ce9c1d-4a0e-48f9-b47b-d2ed2bacdbe5.png"
            alt="Revify Logo"
            className="h-8 w-auto"
          />
          <span className="font-bold text-xl">Revify</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarNavigation items={navItems} currentPath={currentPath} />
          </SidebarGroupContent>
        </SidebarGroup>
        
        {!isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <ToolsSection />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-center" 
          onClick={handleLogout}
        >
          <LogOut size={18} />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
