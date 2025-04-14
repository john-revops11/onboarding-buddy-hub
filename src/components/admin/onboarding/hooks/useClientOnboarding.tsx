
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ClientFormSchema, ClientFormValues } from "../formSchema";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/client-management/create-client";

export const useClientOnboarding = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("client-info");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query subscriptions and addons from Supabase
  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptionTiers
  });

  const { data: addons = [], isLoading: isLoadingAddons } = useQuery({
    queryKey: ["addons"],
    queryFn: getAddons
  });

  // Initialize form with default values
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

  // Define tab navigation handlers
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const nextTab = () => {
    switch (activeTab) {
      case "client-info":
        setActiveTab("subscription");
        break;
      case "subscription":
        setActiveTab("addons");
        break;
      case "addons":
        setActiveTab("team");
        break;
      case "team":
        setActiveTab("confirm");
        break;
      default:
        break;
    }
  };

  const prevTab = () => {
    switch (activeTab) {
      case "subscription":
        setActiveTab("client-info");
        break;
      case "addons":
        setActiveTab("subscription");
        break;
      case "team":
        setActiveTab("addons");
        break;
      case "confirm":
        setActiveTab("team");
        break;
      default:
        break;
    }
  };

  // Toggle addon selection
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((current) => {
      if (current.includes(addonId)) {
        return current.filter((id) => id !== addonId);
      } else {
        return [...current, addonId];
      }
    });
  };

  // Submit form
  const onSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Form data:", data);
      console.log("Selected addons:", selectedAddons);

      // Create client with selected addons
      const result = await createClient(data, selectedAddons);
      
      if (result.success) {
        toast({
          title: "Client onboarded successfully",
          description: `${data.email} has been onboarded with the selected subscription and add-ons.`,
        });
        
        if (!result.driveCreationSuccess) {
          toast({
            title: "Note about Google Drive",
            description: "There was an issue creating the Google Drive for this client. You can try again later from the Client Status page.",
            variant: "destructive",  // Changed from "warning" to "destructive"
          });
        }
        
        // Reset form
        form.reset();
        setSelectedAddons([]);
        setActiveTab("client-info");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error onboarding client:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to onboard client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading: isLoadingSubscriptions || isLoadingAddons,
    isSubmitting,
    activeTab,
    subscriptions,
    addons,
    selectedAddons,
    handleTabChange,
    nextTab,
    prevTab,
    toggleAddon,
    onSubmit,
  };
};
