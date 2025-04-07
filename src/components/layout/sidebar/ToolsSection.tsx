
import { Calculator, HelpCircle } from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

export function ToolsSection() {
  return (
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
  );
}
