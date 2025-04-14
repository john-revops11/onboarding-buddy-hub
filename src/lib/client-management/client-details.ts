
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

// Interfaces for client details
interface ClientDetails {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  notes?: string;
  status?: string;
  created_at?: string;
  subscription_id?: string;
  subscription_name?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  addons?: {
    id: string;
    name: string;
  }[];
  team_members?: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
}

/**
 * Fetch client details by ID
 */
export async function fetchClientDetails(
  clientId: string
): Promise<ClientDetails | null> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `
        *,
        subscription:subscription_id (id, name, status, start_date, end_date),
        addons:client_addons (id, addon:addon_id (id, name)),
        team_members:client_team_members (id, name, email, role)
      `
      )
      .eq("id", clientId)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Format the response
    const clientDetails: ClientDetails = {
      id: data.id,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      notes: data.notes,
      status: data.status,
      created_at: data.created_at,
      subscription_id: data.subscription?.id,
      subscription_name: data.subscription?.name,
      subscription_status: data.subscription?.status,
      subscription_start_date: data.subscription?.start_date,
      subscription_end_date: data.subscription?.end_date,
      addons: data.addons?.map((item: any) => ({
        id: item.addon.id,
        name: item.addon.name,
      })),
      team_members: data.team_members?.map((member: any) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
      })),
    };

    return clientDetails;
  } catch (error: any) {
    console.error("Error fetching client details:", error);
    toast({
      title: "Error fetching client details",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Update client details
 */
export async function updateClientDetails(
  clientId: string,
  details: Partial<ClientDetails>
): Promise<{ success: boolean; error?: PostgrestError }> {
  try {
    // Extract fields that belong directly to the clients table
    const { addons, team_members, subscription_id, ...clientData } = details;

    // Update the client details
    const { error } = await supabase
      .from("clients")
      .update(clientData)
      .eq("id", clientId);

    if (error) throw error;

    // Update subscription if provided
    if (subscription_id) {
      const { error: subscriptionError } = await supabase
        .from("clients")
        .update({ subscription_id })
        .eq("id", clientId);

      if (subscriptionError) throw subscriptionError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating client details:", error);
    toast({
      title: "Error updating client details",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error };
  }
}
