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
    const addonsByClient = (clientAddonsData || []).reduce((acc, item) => {
      if (!acc[item.client_id]) {
        acc[item.client_id] = [];
      }
      if (item.addons) {
        acc[item.client_id].push({
          id: item.addons.id || "",
          name: item.addons.name || "",
          price: item.addons.price || 0,
          description: item.addons.description || ""
        });
      }
      return acc;
    }, {});

    // Map the raw client data to our expected format
    return ((clientsData || []) as unknown as RawClientData[]).map(client => {
      // Parse subscription data properly
      let subscription: Subscription = {
        id: "",
        name: "No Subscription",
        price: 0,
        description: ""
      };

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
        status: client.status as "pending" | "active",
        createdAt: client.created_at,
        industry: client.industry,
        contactPerson: client.contact_person,
        position: client.position,
        companySize: client.company_size,
        subscription,
        addons,
      };
    });
  } catch (error) {
    console.error("Error fetching onboarding clients:", error);
    throw error;
  }
}
