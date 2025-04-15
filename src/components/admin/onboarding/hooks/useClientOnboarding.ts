
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
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      email: "",
      companyName: "",
      subscriptionId: "",
      addons: [],
      teamMembers: [{ email: "" }],
      notes: "",
    },
  });
  
  // Derive selected addons from form values to ensure single source of truth
  const selectedAddons = form.watch("addons") || [];
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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

  // Simplified toggle addon function that directly updates form state
  const toggleAddon = (addonId: string) => {
    const currentAddons = form.getValues("addons") || [];
    const isSelected = currentAddons.includes(addonId);
    
    // Create a new array to ensure React detects the change
    const newAddons = isSelected
      ? currentAddons.filter(id => id !== addonId)
      : [...currentAddons, addonId];
    
    // Update form state in a single operation
    form.setValue("addons", newAddons, { shouldValidate: true });
  };
  
  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      const clientId = await createClient(data);
      
      if (clientId) {
        form.reset();
        setActiveTab("client-info");
        
        toast({
          title: "Client created",
          description: `${data.companyName || 'New client'} has been added. Invitation sent to ${data.email}`,
        });
        
        return clientId;
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
