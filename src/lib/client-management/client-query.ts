
import { supabase } from "@/integrations/supabase/client";
import { OnboardingProgressRecord, Subscription, Addon } from "@/lib/types/client-types";

// Define a type for the raw data coming from Supabase
interface RawClientData {
  id: string;
  email: string;
  company_name: string | null;
  status: string;
  created_at: string;
  subscription_id: string | null;
  subscriptions: {
    id: string;
    name: string;
    price: number;
    description: string | null;
  } | null;
  addons: Array<{
    id: string;
    name: string;
    price: number;
    description: string | null;
  }> | null;
}

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

    return (data as RawClientData[] || []).map(client => {
      // Parse subscription data properly - ensure it's a valid Subscription object
      let subscription: Subscription = {
        id: "",
        name: "No Subscription",
        price: 0,
        description: ""
      };

      // Check if subscriptions exists and is not null before accessing its properties
      if (client.subscriptions && typeof client.subscriptions === 'object') {
        subscription = {
          id: client.subscriptions.id || "",
          name: client.subscriptions.name || "No Subscription",
          price: client.subscriptions.price || 0,
          description: client.subscriptions.description || ""
        };
      }

      // Parse addons data - ensure it's an array
      const addons: Addon[] = Array.isArray(client.addons) 
        ? client.addons.map((addon) => ({
            id: addon.id || "",
            name: addon.name || "",
            price: addon.price || 0,
            description: addon.description || ""
          })) 
        : [];

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

export const getClients = getOnboardingClients;
