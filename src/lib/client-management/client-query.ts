
import { supabase } from "@/integrations/supabase/client";
import { OnboardingProgressRecord, OnboardingClient, Subscription, Addon } from "@/lib/types/client-types";

// Get all clients
export async function getClients(): Promise<OnboardingClient[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id, email, company_name, status, created_at,
        subscriptions:subscription_id (id, name, price, description),
        client_addons (
          addons:addon_id (id, name, price, description)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(client => {
      // Extract subscription data
      const subscriptionData = client.subscriptions;
      const subscriptionTier: Subscription = subscriptionData ? {
        id: subscriptionData.id,
        name: subscriptionData.name,
        price: subscriptionData.price,
        description: subscriptionData.description
      } : {
        id: "default",
        name: "Basic",
        price: 0,
        description: "Default subscription"
      };
      
      // Extract add-ons data
      const addons: Addon[] = (client.client_addons || [])
        .map(item => item.addons)
        .filter(Boolean)
        .map(addon => ({
          id: addon.id,
          name: addon.name,
          price: addon.price,
          description: addon.description
        }));
      
      return {
        id: client.id,
        email: client.email,
        companyName: client.company_name,
        status: client.status,
        createdAt: client.created_at,
        subscriptionTier,
        addons
      };
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

// Get progress for a specific client
export async function getClientProgress(clientId: string): Promise<OnboardingProgressRecord[]> {
  try {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('client_id', clientId)
      .order('step_order', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      clientId: item.client_id,
      stepName: item.step_name,
      stepOrder: item.step_order,
      completed: item.completed,
      startedAt: item.started_at,
      completedAt: item.completed_at
    }));
  } catch (error) {
    console.error("Error fetching client progress:", error);
    return [];
  }
}
