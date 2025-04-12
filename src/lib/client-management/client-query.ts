
import { supabase } from "@/integrations/supabase/client";
import { OnboardingClient } from "@/lib/types/client-types";

// Type definition for subscription tier options
type TierOption = { id: string; name: string };

// Get all clients with their subscription info
export async function getClients(): Promise<OnboardingClient[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id, 
        email, 
        company_name, 
        status, 
        created_at,
        subscriptions:subscription_id (id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get team members for each client
    const clientIds = data.map(client => client.id);
    
    const { data: teamMembersData, error: teamError } = await supabase
      .from('team_members')
      .select('client_id, email, invitation_status')
      .in('client_id', clientIds);
    
    if (teamError) throw teamError;
    
    // Get addons for each client
    const { data: addonsData, error: addonsError } = await supabase
      .from('client_addons')
      .select(`
        client_id,
        addons:addon_id (id, name)
      `)
      .in('client_id', clientIds);
    
    if (addonsError) throw addonsError;
    
    // Organize team members and addons by client
    const teamMembersByClient: Record<string, any[]> = {};
    const addonsByClient: Record<string, any[]> = {};
    
    teamMembersData?.forEach(member => {
      if (!teamMembersByClient[member.client_id]) {
        teamMembersByClient[member.client_id] = [];
      }
      teamMembersByClient[member.client_id].push({
        email: member.email,
        invitationStatus: member.invitation_status
      });
    });
    
    addonsData?.forEach(item => {
      if (!addonsByClient[item.client_id]) {
        addonsByClient[item.client_id] = [];
      }
      if (item.addons) {
        addonsByClient[item.client_id].push(item.addons);
      }
    });
    
    // Format the response
    return data.map(client => {
      // Handle subscriptions object type
      let subscriptionTier: TierOption = { id: '', name: 'None' };
      
      // Check if client.subscriptions exists and is an object with id and name properties
      if (client.subscriptions && typeof client.subscriptions === 'object' && 'id' in client.subscriptions && 'name' in client.subscriptions) {
        subscriptionTier = {
          id: String(client.subscriptions.id),
          name: String(client.subscriptions.name)
        };
      }
        
      return {
        id: client.id,
        email: client.email,
        companyName: client.company_name,
        subscriptionTier: subscriptionTier,
        addons: addonsByClient[client.id] || [],
        teamMembers: teamMembersByClient[client.id] || [],
        status: client.status,
        created_at: client.created_at
      };
    });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return [];
  }
}
