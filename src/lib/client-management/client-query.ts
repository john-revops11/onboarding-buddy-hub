
import { supabase } from "@/integrations/supabase/client";
import { OnboardingProgressRecord, Subscription, Addon } from "@/lib/types/client-types";

// Function to fetch clients with their subscription and addon data
export async function getOnboardingClients() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id, 
        email, 
        company_name, 
        status, 
        created_at,
        subscription_id,
        subscriptions(id, name, price, description),
        addons(id, name, price, description)
      `);

    if (error) throw error;

    return (data || []).map(client => {
      // Parse subscription data properly - ensure it's a valid Subscription object
      const subscription: Subscription = client.subscriptions ? {
        id: client.subscriptions.id || "",
        name: client.subscriptions.name || "No Subscription",
        price: client.subscriptions.price || 0,
        description: client.subscriptions.description || ""
      } : {
        id: "",
        name: "No Subscription",
        price: 0,
        description: ""
      };

      // Parse addons data - ensure it's an array
      const addons: Addon[] = Array.isArray(client.addons) ? client.addons.map(addon => ({
        id: addon.id || "",
        name: addon.name || "",
        price: addon.price || 0,
        description: addon.description || ""
      })) : [];

      return {
        id: client.id,
        email: client.email,
        companyName: client.company_name,
        status: client.status,
        createdAt: client.created_at,
        subscriptionTier: subscription,
        addons,
        teamMembers: [] // Add empty teamMembers array to match OnboardingClient type
      };
    });
  } catch (error) {
    console.error("Error fetching onboarding clients:", error);
    return [];
  }
}

// Get client onboarding progress
export async function getClientProgress(clientId: string): Promise<OnboardingProgressRecord[]> {
  try {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('client_id', clientId)
      .order('step_order', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(record => ({
      clientId: record.client_id,
      stepName: record.step_name,
      stepOrder: record.step_order,
      completed: record.completed,
      startedAt: record.started_at,
      completedAt: record.completed_at
    }));
  } catch (error) {
    console.error("Error fetching client progress:", error);
    return [];
  }
}
