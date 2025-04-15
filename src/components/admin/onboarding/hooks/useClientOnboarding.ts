
import { useState, useEffect, useCallback } from "react";
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
  
  // Safely get the selected addons, ensuring it's always an array
  const selectedAddons = form.watch("addons") || [];
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch subscriptions and addons in parallel
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

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const nextTab = useCallback(() => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  }, [activeTab]);

  const prevTab = useCallback(() => {
    const tabOrder = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  }, [activeTab]);

  // Improved toggle function with proper error handling and type safety
  const toggleAddon = useCallback((addonId: string) => {
    try {
      // Get current addons array, ensuring it's always an array
      const currentAddons = form.getValues("addons") || [];
      
      // Ensure we're working with an array
      if (!Array.isArray(currentAddons)) {
        console.warn("Expected addons to be an array, got:", currentAddons);
        // Reset to empty array if it's not an array
        form.setValue("addons", [], { shouldValidate: true });
        // Add the addon since we're starting fresh
        form.setValue("addons", [addonId], { shouldValidate: true });
        return;
      }
      
      // Regular toggle logic
      const isSelected = currentAddons.includes(addonId);
      const newAddons = isSelected
        ? currentAddons.filter(id => id !== addonId) 
        : [...currentAddons, addonId];
      
      // Update form state with the new array
      form.setValue("addons", newAddons, { shouldValidate: true });
    } catch (error) {
      console.error("Error toggling addon:", error);
      // Recover from error by resetting addons to empty array
      form.setValue("addons", [], { shouldValidate: true });
    }
  }, [form]);
  
  const onSubmit = useCallback(async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ensure addons is an array
      const safeAddons = Array.isArray(data.addons) ? data.addons : [];
      const formData = { ...data, addons: safeAddons };
      
      const clientId = await createClient(formData);
      
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
  }, [form, toast, setActiveTab]);
  
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
