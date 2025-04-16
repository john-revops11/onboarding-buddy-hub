import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

// Create a new client with subscription, addons and team members
export async function createClient(data: ClientFormValues): Promise<string> {
  try {
    // Ensure addons is an array
    const addons = Array.isArray(data.addons) ? data.addons : [];

    // Step 1: Insert into 'clients' table
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert([
        {
          email: data.email,
          company_name: data.companyName || null,
          subscription_id: data.subscriptionId,
          status: "pending",

          // ✅ New fields
          industry: data.industry || null,
          contact_person: data.contactPerson || null,
          position: data.position || null,
          company_size: data.companySize || null,
        }
      ])
      .select("id")
      .single();

    if (clientError) throw clientError;

    const clientId = clientData.id;

    // Step 2: Insert selected addons
    if (addons.length > 0) {
      const addonRecords = addons.map(addonId => ({
        client_id: clientId,
        addon_id: addonId,
      }));

      const { error: addonError } = await supabase
        .from("client_addons")
        .insert(addonRecords);

      if (addonError) throw addonError;
    }

    // Step 3: Insert team members
    if (data.teamMembers && data.teamMembers.length > 0) {
      const teamMemberRecords = data.teamMembers.map(member => ({
        client_id: clientId,
        email: member.email,
        invitation_status: "pending",
      }));

      const { error: teamError } = await supabase
        .from("team_members")
        .insert(teamMemberRecords);

      if (teamError) throw teamError;
    }

    // Step 4: Create default onboarding steps
