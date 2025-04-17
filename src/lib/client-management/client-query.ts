import { supabase } from "@/integrations/supabase/client";
import { OnboardingProgressRecord, Subscription, Addon } from "@/lib/types/client-types";
import { Client } from "@/lib/types/client-types";

// Get a single client by ID
export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) throw error;

    return {
      id: data.id,
      email: data.email,
      companyName: data.company_name,
      status: data.status,
      createdAt: data.created_at,
      industry: data.industry,
      contactPerson: data.contact_person,
      position: data.position,
      companySize: data.company_size,
      subscriptionId: data.subscription_id,
      onboardingStatus: data.onboarding_status,
    };
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    return null;
  }
}


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
    const { data: clientsData, error: clientsError } = await supabase
      .from("clients")
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

    const { data: clientAddonsData, error: addonsError } = await supabase
      .from("client_addons")
      .select(`
        client_id,
        addon_id,
        addons(id, name, price, description)
      `);

    if (addonsError) throw addonsError;

    const addonsByClient: Record<string, Addon[]> = {};
    (clientAddonsData || []).forEach((item) => {
      if (!addonsByClient[item.client_id]) addonsByClient[item.client_id] = [];
      if (item.addons && !Array.isArray(item.addons)) {
        addonsByClient[item.client_id].push({
          id: item.addons.id || "",
          name: item.addons.name || "",
          price: item.addons.price || 0,
          description: item.addons.description || ""
        });
      }
    });

    return ((clientsData || []) as unknown as RawClientData[]).map((client) => {
      let subscription: Subscription = {
        id: "",
        name: "No Subscription",
        price: 0,
        description: ""
      };

      if (client.subscriptions && typeof client.subscriptions === "object") {
        subscription = {
          id: client.subscriptions.id || "",
          name: client.subscriptions.name || "No Subscription",
          price: client.subscriptions.price || 0,
          description: client.subscriptions.description || ""
        };
      }

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
        subscriptionId: client.subscription_id,
        subscriptionTier: subscription,
        addons,
        teamMembers: []
      };
    });
  } catch (error) {
    console.error("Error fetching onboarding clients:", error);
    return [];
  }
}

export async function getClientProgress(clientId: string): Promise<OnboardingProgressRecord[]> {
  try {
    const { data, error } = await supabase
      .from("onboarding_progress")
      .select("*")
      .eq("client_id", clientId)
      .order("step_order", { ascending: true });

    if (error) throw error;

    return (data || []).map((record) => ({
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
    const completedSteps = progress.filter((step) => step.completed).length;
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