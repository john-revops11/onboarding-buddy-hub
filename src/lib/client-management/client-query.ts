
import { supabase } from "@/integrations/supabase/client";
import { OnboardingClient, SubscriptionTier, Addon } from "@/lib/types/client-types";

// Fix the type definition to match SubscriptionTier
type TierOption = SubscriptionTier;

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
        drive_id,
        drive_name,
        subscriptions:subscription_id (id, name, price)
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
        addons:addon_id (id, name, price)
      `)
      .in('client_id', clientIds);
    
    if (addonsError) throw addonsError;
    
    // Organize team members and addons by client
    const teamMembersByClient: Record<string, any[]> = {};
    const addonsByClient: Record<string, Addon[]> = {};
    
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
      
      // Fix: Correctly handle the addons property by checking its type
      if (item.addons) {
        // Ensure we're treating item.addons as an object, not an array
        const addonData = item.addons as any; // Type assertion to handle the shape
        const addon: Addon = {
          id: String(addonData.id || ''),
          name: String(addonData.name || ''),
          price: Number(addonData.price || 0)
        };
        addonsByClient[item.client_id].push(addon);
      }
    });
    
    // Format the response
    return data.map(client => {
      // Handle subscriptions object type
      let subscriptionTier: SubscriptionTier = { id: '', name: 'None', price: 0 };
      
      // Fix: Correctly handle the subscriptions property by checking its type
      if (client.subscriptions && typeof client.subscriptions === 'object' && client.subscriptions !== null) {
        // Ensure we're treating client.subscriptions as an object, not an array
        const subscriptionData = client.subscriptions as any; // Type assertion to handle the shape
        subscriptionTier = {
          id: String(subscriptionData.id || ''),
          name: String(subscriptionData.name || 'None'),
          price: Number(subscriptionData.price || 0)
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
        created_at: client.created_at,
        drive_id: client.drive_id,
        drive_name: client.drive_name
      };
    });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return [];
  }
}
