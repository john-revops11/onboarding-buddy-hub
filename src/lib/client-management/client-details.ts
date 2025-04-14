
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Type definitions for client details
export interface ClientDetails {
  id: string;
  email: string;
  company_name: string | null;
  onboarding_completed: boolean;
  status: string;
  created_at: string;
  subscription: string;
  addons: string[];
  joinDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

/**
 * Fetches detailed information about a client including subscription, addons and team members
 */
export async function getClientDetails(clientId: string): Promise<{
  client: ClientDetails | null;
  teamMembers: TeamMember[];
  error?: string;
}> {
  try {
    // Fetch client data
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select(`
        id, 
        email, 
        company_name, 
        onboarding_completed, 
        status, 
        created_at,
        subscription:subscription_id(name)
      `)
      .eq('id', clientId)
      .single();
    
    if (clientError) throw clientError;
    
    if (!clientData) {
      return { client: null, teamMembers: [], error: "Client not found" };
    }
    
    // Fetch client add-ons
    const { data: addonData, error: addonError } = await supabase
      .from('client_addons')
      .select(`
        addon_id,
        addon:addon_id(name)
      `)
      .eq('client_id', clientId);
    
    if (addonError) throw addonError;
    
    // Fetch team members
    const { data: teamData, error: teamError } = await supabase
      .from('team_members')
      .select(`
        id,
        email,
        invitation_status,
        user:user_id(name, email, role)
      `)
      .eq('client_id', clientId);
    
    if (teamError) throw teamError;
    
    // Format the client data
    const formattedClient: ClientDetails = {
      ...clientData,
      subscription: clientData.subscription?.name || 'No Subscription',
      addons: Array.isArray(addonData) 
        ? addonData.map((item) => {
            if (item && item.addon) {
              return item.addon.name || 'Unknown Addon';
            }
            return 'Unknown Addon';
          }) 
        : [],
      joinDate: clientData.created_at ? new Date(clientData.created_at).toISOString().split('T')[0] : 'Unknown'
    };
    
    // Format team members data
    const formattedTeamMembers: TeamMember[] = Array.isArray(teamData) 
      ? teamData.map((member) => ({
          id: member.id,
          name: member.user?.name || 'Pending User',
          email: member.email,
          role: member.user?.role || 'Pending',
          status: member.invitation_status
        })) 
      : [];
    
    return {
      client: formattedClient,
      teamMembers: formattedTeamMembers
    };
  } catch (error: any) {
    console.error("Error fetching client details:", error);
    return {
      client: null,
      teamMembers: [],
      error: error.message || "Failed to load client details"
    };
  }
}

/**
 * Updates a client's basic information
 */
export async function updateClientBasicInfo(
  clientId: string, 
  updates: {
    company_name?: string;
    email?: string;
    notes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', clientId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating client:", error);
    return {
      success: false,
      error: error.message || "Failed to update client information"
    };
  }
}
