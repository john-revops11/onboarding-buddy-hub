import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";
import { sendInviteEmail } from "@/lib/email/sendInviteEmail"; // ✅ import the email function

// Create a new client with subscription, addons and team members
export async function createClient(data: ClientFormValues): Promise<string> {
  try {
    const addons = Array.isArray(data.addons) ? data.addons : [];

    // Step 1: Create the client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        email: data.email,
        company_name: data.companyName || null,
        subscription_id: data.subscriptionId,
        status: 'pending'
      })
      .select('id')
      .single();

    if (clientError) throw clientError;

    const clientId = clientData.id;

    // Step 2: Add addons
    if (addons.length > 0) {
      const addonRecords = addons.map(addonId => ({
        client_id: clientId,
        addon_id: addonId
      }));

      const { error: addonError } = await supabase
        .from('client_addons')
        .insert(addonRecords);

      if (addonError) throw addonError;
    }

    // Step 3: Add team members
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

    // Step 4: Onboarding steps
    const onboardingSteps = [
