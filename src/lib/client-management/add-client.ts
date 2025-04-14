
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const addClient = async ({
  email,
  companyName,
  subscriptionId = null,
  status = 'active',
  onboardingCompleted = false
}: {
  email: string;
  companyName: string;
  subscriptionId?: string | null;
  status?: string;
  onboardingCompleted?: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([
        { 
          email, 
          company_name: companyName,
          subscription_id: subscriptionId,
          status,
          onboarding_completed: onboardingCompleted
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`Client ${companyName} added successfully!`);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding client:", error);
    toast.error(error.message || "Failed to add client");
    return { success: false, error };
  }
};

// Function to add Revology Analytics client
export const addRevologyAnalyticsClient = async () => {
  return addClient({
    email: "contact@revology-analytics.com",
    companyName: "Revology Analytics",
    status: "active",
    onboardingCompleted: true
  });
};
