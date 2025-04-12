
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues, OnboardingClient } from "@/lib/types/client-types";

// Create a new client with subscription, addons and team members
export async function createClient(data: ClientFormValues) {
  try {
    // Step 1: Create the client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        email: data.email,
        company_name: data.companyName || null,
        subscription_id: data.subscriptionTierId,
        status: 'pending'
      })
      .select('id')
      .single();

    if (clientError) throw clientError;
    
    const clientId = clientData.id;
    
    // Step 2: Add addons if selected
    if (data.addons && data.addons.length > 0) {
      const addonRecords = data.addons.map(addonId => ({
        client_id: clientId,
        addon_id: addonId
      }));
      
      const { error: addonError } = await supabase
        .from('client_addons')
        .insert(addonRecords);
      
      if (addonError) throw addonError;
    }
    
    // Step 3: Add team members
    const teamMemberRecords = data.teamMembers.map(member => ({
      client_id: clientId,
      email: member.email,
      invitation_status: 'pending'
    }));
    
    const { error: teamError } = await supabase
      .from('team_members')
      .insert(teamMemberRecords);
    
    if (teamError) throw teamError;
    
    // Step 4: Send invitations (handled separately)
    // This would typically involve sending emails via a server function
    
    return clientId;
  } catch (error: any) {
    toast({
      title: "Error creating client",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
}

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
      addonsByClient[item.client_id].push(item.addons);
    });
    
    // Format the response
    return data.map(client => ({
      id: client.id,
      email: client.email,
      companyName: client.company_name,
      subscriptionTier: client.subscriptions ? {
        id: client.subscriptions.id,
        name: client.subscriptions.name
      } : { id: '', name: 'None' },
      addons: addonsByClient[client.id] || [],
      teamMembers: teamMembersByClient[client.id] || [],
      status: client.status,
      created_at: client.created_at
    }));
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

// Send client invitation
export async function sendClientInvitation(clientId: string, email: string) {
  try {
    // In a real implementation, this would call a server function to send an email
    // For now, we'll just update the status
    const { error } = await supabase
      .from('team_members')
      .update({ invitation_status: 'sent' })
      .eq('client_id', clientId)
      .eq('email', email);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error sending invitation",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}

// Complete client onboarding
export async function completeClientOnboarding(clientId: string) {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ 
        status: 'active',
        onboarding_completed: true 
      })
      .eq('id', clientId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error completing onboarding",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}
