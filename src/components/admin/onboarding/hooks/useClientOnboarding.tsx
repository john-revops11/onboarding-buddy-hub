import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ClientFormSchema, ClientFormValues } from "../formSchema";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/client-management";

export const useClientOnboarding = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("client-info");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptionTiers
  });

  const { data: addons = [], isLoading: isLoadingAddons } = useQuery({
    queryKey: ["addons"],
    queryFn: getAddons
  });

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

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((current) => {
      if (current.includes(addonId)) {
        return current.filter((id) => id !== addonId);
      } else {
        return [...current, addonId];
      }
    });
  };

  const onSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);

      const validTeamMembers = data.teamMembers.map(member => ({
        email: member.email || ""
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
          variant: "success"
        });

        form.reset();
        setSelectedAddons([]);
        setActiveTab("client-info");
      } else {
        throw new Error("Client ID was not returned.");
      }
    } catch (error: any) {
      console.error("Error onboarding client:", error);

      toast({
        title: "Error",
        description: error?.message || "Failed to onboard client. Please try again.",
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
