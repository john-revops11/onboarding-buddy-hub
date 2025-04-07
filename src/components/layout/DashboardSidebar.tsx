
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
  BarChart3,
  HelpCircle,
  Calculator
} from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <SidebarMenu>
              {navItems.map((item) => (
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
          </SidebarGroupContent>
        </SidebarGroup>
        
        {!isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Pricing Calculator"
                  >
                    <a 
                      href="https://revify.com/pricing-calculator" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="justify-center"
                    >
                      <Calculator size={18} />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Support"
                  >
                    <a 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault();
                        // Open support form
                      }}
                      className="justify-center"
                    >
                      <HelpCircle size={18} />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
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

function UserMenu() {
  const { state } = useAuth();
  const user = state.user;
  
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Avatar>
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>
          {user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
