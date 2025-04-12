
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ClientFormSchema, ClientFormValues } from "./formSchema";
import { createClient } from "@/lib/client-management";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import ClientInfoForm from "./form-tabs/ClientInfoForm";
import SubscriptionForm from "./form-tabs/SubscriptionForm";
import AddonsForm from "./form-tabs/AddonsForm";
import TeamMembersForm from "./form-tabs/TeamMembersForm";
import ConfirmationTab from "./form-tabs/ConfirmationTab";
import FormNavigation from "./form-tabs/FormNavigation";

export function ClientOnboardingForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("client-info");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      email: "",
      companyName: "",
      subscriptionTierId: "",
      addons: [],
      teamMembers: [{ email: "" }],
    },
  });

  const selectedAddons = form.watch("addons");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [subscriptionsData, addonsData] = await Promise.all([
          getSubscriptionTiers(),
          getAddons()
        ]);
        
        setSubscriptions(subscriptionsData);
        setAddons(addonsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Failed to load data",
          description: "Could not load subscription tiers and add-ons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [toast]);

  const handleTabChange = (value: string) => {
    form.trigger();
    setActiveTab(value);
  };

  const nextTab = async () => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex < tabOrder.length - 1) {
      // Validate the current tab's fields before proceeding
      let shouldProceed = false;
      
      switch(activeTab) {
        case "client-info":
          shouldProceed = await form.trigger(["email", "companyName"]);
          break;
        case "subscription":
          shouldProceed = await form.trigger("subscriptionTierId");
          break;
        case "addons":
          shouldProceed = true; // Addons are optional
          break;
        case "team":
          // Validate all team member emails
          shouldProceed = await form.trigger("teamMembers");
          break;
        default:
          shouldProceed = true;
      }
      
      if (shouldProceed) {
        setActiveTab(tabOrder[currentIndex + 1]);
      }
    }
  };

  const prevTab = () => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const toggleAddon = (addonId: string) => {
    const current = form.getValues("addons");
    if (current.includes(addonId)) {
      form.setValue(
        "addons",
        current.filter((id) => id !== addonId)
      );
    } else {
      form.setValue("addons", [...current, addonId]);
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      await createClient(data);
      
      toast({
        title: "Client onboarding initiated",
        description: "Invitations have been sent to the client and team members.",
      });
      
      // Navigate back to admin dashboard
      navigate("/admin/onboarding");
    } catch (error) {
      console.error("Error submitting client onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to onboard client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <FormTabs />
          </TabsList>

          <TabsContent value="client-info" className="space-y-4 mt-4">
            <Card>
              <ClientInfoForm form={form} />
            </Card>
            <FormNavigation nextTab={nextTab} showPrevious={false} />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4 mt-4">
            <Card>
              <SubscriptionForm form={form} subscriptions={subscriptions} />
            </Card>
            <FormNavigation prevTab={prevTab} nextTab={nextTab} />
          </TabsContent>

          <TabsContent value="addons" className="space-y-4 mt-4">
            <Card>
              <AddonsForm 
                form={form} 
                addons={addons} 
                selectedAddons={selectedAddons} 
                toggleAddon={toggleAddon}
              />
            </Card>
            <FormNavigation prevTab={prevTab} nextTab={nextTab} />
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            <Card>
              <TeamMembersForm form={form} />
            </Card>
            <FormNavigation prevTab={prevTab} nextTab={nextTab} />
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4 mt-4">
            <Card>
              <ConfirmationTab 
                form={form} 
                subscriptions={subscriptions} 
                addons={addons}
                selectedAddons={selectedAddons}
              />
            </Card>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevTab}>
                Previous: Team Members
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit & Send Invitations"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

function FormTabs() {
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

import { Building as ClientInfoIcon, Package as SubscriptionIcon, Plus as AddonIcon, Users as TeamIcon, User as ConfirmIcon } from "lucide-react";

export default ClientOnboardingForm;
