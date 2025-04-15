
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { assignTemplateToClient } from "@/lib/client-management/onboarding-templates";
import { getSubscriptions } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";
import { supabase } from "@/integrations/supabase/client";

// Form schema
const clientSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  subscriptionId: z.string().min(1, "Subscription is required"),
  notes: z.string().optional(),
  primaryContact: z.object({
    name: z.string().min(2, "Contact name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    role: z.string().optional(),
  }),
  teamMembers: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.string().optional(),
    })
  ).optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export function useClientOnboarding() {
  const [activeTab, setActiveTab] = useState("client-info");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phone: "",
      address: "",
      subscriptionId: "",
      notes: "",
      primaryContact: {
        name: "",
        email: "",
        phone: "",
        role: "",
      },
      teamMembers: [
        { email: "", role: "" }
      ],
    },
  });

  // Load subscriptions and addons on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load subscriptions and addons
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionsData, addonsData] = await Promise.all([
        getSubscriptions(),
        getAddons()
      ]);
      
      setSubscriptions(subscriptionsData);
      setAddons(addonsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions and addons.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Navigate to next tab
  const nextTab = () => {
    const tabs = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Navigate to previous tab
  const prevTab = () => {
    const tabs = ["client-info", "subscription", "addons", "team", "confirm"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
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

  // Handle form submission
  const onSubmit = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          company_name: values.companyName,
          email: values.email,
          subscription_id: values.subscriptionId,
          notes: values.notes,
          status: 'pending',
          metadata: {
            phone: values.phone,
            address: values.address,
            primary_contact: values.primaryContact
          }
        })
        .select()
        .single();
      
      if (clientError) throw clientError;
      
      // Add selected addons
      if (selectedAddons.length > 0) {
        const addonInserts = selectedAddons.map(addonId => ({
          client_id: client.id,
          addon_id: addonId
        }));
        
        const { error: addonsError } = await supabase
          .from('client_addons')
          .insert(addonInserts);
        
        if (addonsError) throw addonsError;
      }
      
      // Add team members
      if (values.teamMembers && values.teamMembers.length > 0) {
        const validTeamMembers = values.teamMembers.filter(member => member.email);
        
        if (validTeamMembers.length > 0) {
          const teamMemberInserts = validTeamMembers.map(member => ({
            client_id: client.id,
            email: member.email,
            metadata: { role: member.role }
          }));
          
          const { error: teamError } = await supabase
            .from('team_members')
            .insert(teamMemberInserts);
          
          if (teamError) throw teamError;
        }
      }
      
      // Assign onboarding template based on subscription
      const templateAssigned = await assignTemplateToClient(client.id);
      
      if (!templateAssigned) {
        console.warn("Failed to assign onboarding template to client");
      }
      
      toast({
        title: "Client created",
        description: `${values.companyName} has been created successfully.`,
      });
      
      // Reset form
      form.reset();
      setSelectedAddons([]);
      setActiveTab("client-info");
      
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to create client. " + (error.message || "Please try again."),
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
