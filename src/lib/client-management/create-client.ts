
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

export async function createClient(data: ClientFormValues, selectedAddons: string[]) {
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

    if (clientError) {
      console.error("Error creating client:", clientError);
      throw clientError;
    }
    
    const clientId = clientData.id;
    let driveCreationSuccess = false;
    let driveId = null;
    
    // Step 2: Create a Google Drive for the client
    try {
      // Updated to use proper method with apiKey from Supabase client
      const { data: driveData, error: driveError } = await supabase.functions.invoke('create-google-drive', {
        body: {
          userEmail: data.email,
          companyName: data.companyName || `Client-${clientId}`
        }
      });
      
      if (driveError) {
        console.error('Error creating Google Drive:', driveError);
        // Log the error but continue with client creation
      } else if (driveData && driveData.driveId) {
        // Update client with the drive ID
        driveId = driveData.driveId;
        driveCreationSuccess = true;
        
        await supabase
          .from('clients')
          .update({ 
            drive_id: driveData.driveId,
            drive_name: driveData.simulated ? `(Simulated) ${data.companyName}` : data.companyName
          })
          .eq('id', clientId);
      }
    } catch (driveError) {
      console.error('Failed to create Google Drive:', driveError);
      // Continue with client creation despite Drive creation failure
    }
    
    // Step 3: Add selected addons
    if (selectedAddons.length > 0) {
      const addonRecords = selectedAddons.map(addonId => ({
        client_id: clientId,
        addon_id: addonId
      }));
      
      const { error: addonError } = await supabase
        .from('client_addons')
        .insert(addonRecords);
      
      if (addonError) {
        console.error("Error adding addons:", addonError);
        throw addonError;
      }
    }
    
    // Step 4: Add team members
    if (data.teamMembers && data.teamMembers.length > 0) {
      const teamMemberRecords = data.teamMembers
        .filter(member => member.email.trim() !== '')
        .map(member => ({
          client_id: clientId,
          email: member.email,
          invitation_status: 'pending'
        }));
        
      if (teamMemberRecords.length > 0) {
        const { error: teamError } = await supabase
          .from('team_members')
          .insert(teamMemberRecords);
          
        if (teamError) {
          console.error("Error adding team members:", teamError);
          throw teamError;
        }
      }
    }
    
    // Return client creation result with drive creation status
    return { 
      success: true, 
      clientId, 
      driveCreationSuccess,
      driveId
    };
  } catch (error: any) {
    console.error("Error creating client:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred" 
    };
  }
}
