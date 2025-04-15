
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { createClient } from "@/lib/client-management/client-create";
import { getAddons } from "@/lib/addon-management";
import { ClientFormSchema, ClientFormValues } from "@/components/admin/onboarding/formSchema";

export function useClientOnboarding() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("client-info");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Initialize form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      email: "",
      companyName: "",
      subscriptionTierId: "",
      addons: [],
      teamMembers: [{ email: "" }],
      notes: "",
    },
  });
  
  // Load subscription tiers and addons on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [subscriptionsData, addonsData] = await Promise.all([
          getSubscriptionTiers(),
          getAddons(),
        ]);
        
        setSubscriptions(subscriptionsData);
        setAddons(addonsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription tiers and addons.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Navigation between tabs
  const nextTab = () => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  // Toggle addon selection
  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });

    // Update form value
    const currentAddons = form.getValues("addons") || [];
    if (currentAddons.includes(addonId)) {
      form.setValue("addons", currentAddons.filter(id => id !== addonId));
    } else {
      form.setValue("addons", [...currentAddons, addonId]);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await createClient(data);
      
      if (result) {
        form.reset();
        setActiveTab("client-info");
        setSelectedAddons([]);
        
        toast({
          title: "Client created",
          description: `${data.companyName} has been added. Invitation sent to ${data.email}`,
        });
        
        return result;
      } else {
        throw new Error("Failed to create client");
      }
    } catch (error: any) {
      console.error("Error creating client:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create client. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    subscriptions,
    addons,
    isLoading,
    isSubmitting,
    activeTab,
    selectedAddons,
    handleTabChange,
    nextTab,
    prevTab,
    toggleAddon,
    onSubmit
  };
}
