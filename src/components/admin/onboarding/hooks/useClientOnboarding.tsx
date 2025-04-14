import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ClientFormSchema, ClientFormValues } from "../formSchema";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/client-management";
import { sendClientInvitation } from "@/lib/client-management/client-invitations";
import { supabase } from "@/integrations/supabase/client";

export const useClientOnboarding = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("client-info");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);

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
      // Ensure the teamMembers array contains objects with required email properties
      const validTeamMembers = data.teamMembers.map(member => ({
        email: member.email || "" // Ensure email is always a string, even if empty
      }));

      const clientId = await createClient({
        email: data.email,
        companyName: data.companyName,
        subscriptionTierId: data.subscriptionTierId,
        addons: selectedAddons,
        teamMembers: validTeamMembers
      });
      
      if (clientId) {
        toast({
          title: "Client onboarded successfully",
          description: `${data.email} has been onboarded with the selected subscription and add-ons.`,
        });
        
        // Send invitation emails to team members
        setSendingInvites(true);
        
        try {
          // Query the newly created team members
          const { data: teamMembers, error } = await supabase
            .from("team_members")
            .select("id, email")
            .eq("client_id", clientId);
            
          if (error) throw error;
          
          // Send invitations to each team member
          for (const member of teamMembers) {
            await sendClientInvitation(
              member.id, 
              member.email, 
              data.companyName
            );
          }
          
          toast({
            title: "Invitations sent",
            description: "Email invitations have been sent to all team members.",
          });
        } catch (inviteError: any) {
          console.error("Error sending invitations:", inviteError);
          toast({
            title: "Warning",
            description: "Client created but there was an issue sending invitations.",
            variant: "destructive",
          });
        } finally {
          setSendingInvites(false);
        }
        
        // Reset form
        form.reset();
        setSelectedAddons([]);
        setActiveTab("client-info");
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
    isSubmitting: isSubmitting || sendingInvites,
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
