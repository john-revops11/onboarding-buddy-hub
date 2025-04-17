
import { supabase } from "@/integrations/supabase/client";
import { OnboardingProgressRecord, Subscription, Addon } from "@/lib/types/client-types";

// Define a type for the raw data coming from Supabase
interface RawClientData {
  id: string;
  email: string;
  company_name: string | null;
  status: string;
  created_at: string;
  industry: string | null;
  contact_person: string | null;
  position: string | null;
  company_size: string | null;
  subscription_id: string | null;
  subscriptions: {
    id: string;
    name: string;
    price: number;
    description: string | null;
  } | null;
}

// Define a type for the raw client-addon relationship data
interface RawClientAddonData {
  client_id: string;
  addon_id: string;
  addons: {
    id: string;
    name: string;
    price: number;
    description: string | null;
  } | null;
}

// Function to fetch clients with their subscription data
export async function getOnboardingClients() {
  try {
    // Get all clients with their subscription data
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select(`
        id, 
        email, 
        company_name, 
        status, 
        created_at,
        industry,
        contact_person,
        position,
        company_size,
        subscription_id,
        subscriptions(id, name, price, description)
      `);

    if (clientsError) throw clientsError;

    // Get client-addon relationships
    const { data: clientAddonsData, error: addonsError } = await supabase
      .from('client_addons')
      .select(`
        client_id,
        addon_id,
        addons(id, name, price, description)
      `);

    if (addonsError) throw addonsError;
    
    // Group addons by client_id
    const addonsByClient: Record<string, Addon[]> = {};
    
    if (clientAddonsData) {
      // Use type assertion to ensure correct type handling
      (clientAddonsData as unknown as RawClientAddonData[]).forEach((item) => {
        if (!addonsByClient[item.client_id]) {
          addonsByClient[item.client_id] = [];
        }
        if (item.addons) {
          addonsByClient[item.client_id].push({
            id: item.addons.id || "",
            name: item.addons.name || "",
            price: item.addons.price || 0,
            description: item.addons.description || ""
          });
        }
      });
    }

    // Map the raw client data to our expected format
    return ((clientsData || []) as unknown as RawClientData[]).map(client => {
      // Parse subscription data properly
      let subscription: Subscription = {
        id: "",
        name: "No Subscription",
        price: 0,
        description: ""
      };

      // Check if subscriptions exists and is not null
      if (client.subscriptions && typeof client.subscriptions === 'object') {
        subscription = {
          id: client.subscriptions.id || "",
          name: client.subscriptions.name || "No Subscription",
          price: client.subscriptions.price || 0,
          description: client.subscriptions.description || ""
        };
      }

      // Get addons for this client from our grouped data
      const addons: Addon[] = addonsByClient[client.id] || [];

      return {
        id: client.id,
        email: client.email,
        companyName: client.company_name,
        status: client.status as "pending" | "active", // Cast to expected union type
        createdAt: client.created_at,
        industry: client.industry,
        contactPerson: client.contact_person,
        position: client.position,
        companySize: client.company_size,
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

// Calculate onboarding progress percentage for a client
export async function calculateClientProgress(clientId: string): Promise<{
  progress: number;
  completedSteps: number;
  totalSteps: number;
}> {
  try {
    const progress = await getClientProgress(clientId);
    
    if (progress.length === 0) {
      return { progress: 0, completedSteps: 0, totalSteps: 0 };
    }
    
    const totalSteps = progress.length;
    const completedSteps = progress.filter(step => step.completed).length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
    
    return {
      progress: progressPercentage,
      completedSteps,
      totalSteps
    };
  } catch (error) {
    console.error("Error calculating client progress:", error);
    return { progress: 0, completedSteps: 0, totalSteps: 0 };
  }
}

export const getClients = getOnboardingClients;
