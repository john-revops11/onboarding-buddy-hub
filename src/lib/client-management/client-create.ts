
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

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
    
    // Step 3: Add team members if any
    if (data.teamMembers && data.teamMembers.length > 0) {
      const teamMemberRecords = data.teamMembers.map(member => ({
        client_id: clientId,
        email: member.email,
        invitation_status: 'pending'
      }));
      
      const { error: teamError } = await supabase
        .from('team_members')
        .insert(teamMemberRecords);
      
      if (teamError) throw teamError;
    }
    
    // Step 4: Create a Google Drive for the client
    try {
      const { data: driveData, error: driveError } = await supabase.functions.invoke('create-google-drive', {
        body: {
          userEmail: data.email,
          companyName: data.companyName || `Client-${clientId}`
        }
      });
      
      if (driveError) {
        console.error('Error creating Google Drive:', driveError);
        // Continue with client creation despite Drive creation failure
      } else if (driveData && driveData.driveId) {
        // Update client with the drive ID
        await supabase
          .from('clients')
          .update({ drive_id: driveData.driveId })
          .eq('id', clientId);
      }
    } catch (driveError) {
      console.error('Failed to create Google Drive:', driveError);
      // Continue with client creation despite Drive creation failure
    }
    
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
