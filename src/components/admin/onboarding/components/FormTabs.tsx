
import { 
  Building as ClientInfoIcon, 
  Package as SubscriptionIcon, 
  Plus as AddonIcon, 
  Users as TeamIcon, 
  User as ConfirmIcon 
} from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";

export function FormTabs() {
  return (
    <>
      <TabsTrigger value="client-info" className="flex gap-2 items-center">
        <ClientInfoIcon size={16} /> Client Info
      </TabsTrigger>
      <TabsTrigger value="subscription" className="flex gap-2 items-center">
        <SubscriptionIcon size={16} /> Subscription
      </TabsTrigger>
      <TabsTrigger value="addons" className="flex gap-2 items-center">
        <AddonIcon size={16} /> Add-ons
      </TabsTrigger>
      <TabsTrigger value="team" className="flex gap-2 items-center">
        <TeamIcon size={16} /> Team
      </TabsTrigger>
      <TabsTrigger value="confirm" className="flex gap-2 items-center">
        <ConfirmIcon size={16} /> Confirm
      </TabsTrigger>
    </>
  );
}
