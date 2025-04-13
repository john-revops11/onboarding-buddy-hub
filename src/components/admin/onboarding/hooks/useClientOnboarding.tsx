
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { clientFormSchema, ClientFormValues } from "../formSchema";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    resolver: zodResolver(clientFormSchema),
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

      // Store client in database
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          email: data.email,
          company_name: data.companyName || null,
          subscription_id: data.subscriptionTierId,
          status: 'pending'
        })
        .select();

      if (clientError) throw clientError;
      
      const clientId = clientData[0].id;
      
      // Add selected addons
      if (selectedAddons.length > 0) {
        const addonInserts = selectedAddons.map(addonId => ({
          client_id: clientId,
          addon_id: addonId
        }));
        
        const { error: addonsError } = await supabase
          .from('client_addons')
          .insert(addonInserts);
          
        if (addonsError) throw addonsError;
      }
      
      // Add team members
      if (data.teamMembers.length > 0) {
        const memberInserts = data.teamMembers
          .filter(member => member.email.trim() !== '')
          .map(member => ({
            client_id: clientId,
            email: member.email,
            invitation_status: 'pending'
          }));
          
        if (memberInserts.length > 0) {
          const { error: teamError } = await supabase
            .from('team_members')
            .insert(memberInserts);
            
          if (teamError) throw teamError;
        }
      }
      
      toast({
        title: "Client onboarded successfully",
        description: `${data.email} has been onboarded with the selected subscription and add-ons.`,
      });
      
      // Reset form
      form.reset();
      setSelectedAddons([]);
      setActiveTab("client-info");
      
    } catch (error) {
      console.error("Error onboarding client:", error);
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
