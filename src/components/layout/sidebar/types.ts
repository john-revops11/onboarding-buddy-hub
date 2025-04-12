
export interface SidebarNavItem {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
  external?: boolean;
  badge?: {
    content: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}
