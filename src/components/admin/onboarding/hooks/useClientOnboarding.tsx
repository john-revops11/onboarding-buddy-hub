
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ClientFormSchema, ClientFormValues } from "../formSchema";
import { createClient } from "@/lib/client-management";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";

export function useClientOnboarding() {
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
      // Ensure we pass a proper ClientFormValues object with required fields
      await createClient({
        email: data.email,
        companyName: data.companyName,
        subscriptionTierId: data.subscriptionTierId,
        addons: data.addons,
        teamMembers: data.teamMembers.map(member => ({ email: member.email }))
      });
      
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

  return {
    form,
    isLoading,
    isSubmitting,
    activeTab,
    subscriptions,
    addons,
    selectedAddons,
    handleTabChange,
    nextTab,
    prevTab,
    toggleAddon,
    onSubmit
  };
}
