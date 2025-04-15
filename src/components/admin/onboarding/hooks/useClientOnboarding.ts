
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { createClient } from "@/lib/client-management/client-create";
import { getAddons } from "@/lib/addon-management";

// Form schema
const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  companyName: z.string().min(1, "Company name is required"),
  subscriptionId: z.string().min(1, "Subscription tier is required"),
  addons: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof formSchema>;

export function useClientOnboarding() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  
  // Initialize form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      companyName: "",
      subscriptionId: "",
      addons: [],
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
  
  // Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await createClient(data);
      
      if (result.success && result.client) {
        form.reset();
        
        toast({
          title: "Client created",
          description: `${data.companyName} has been added. Invitation sent to ${data.email}`,
        });
        
        return result.client;
      } else {
        throw new Error(result.error || "Failed to create client");
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
      setIsLoading(false);
    }
  };
  
  return {
    form,
    subscriptions,
    addons,
    isLoading,
    onSubmit,
  };
}
