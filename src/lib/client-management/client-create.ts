import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

/**
 * Create a new client along with subscription, add-ons, team members, and onboarding progress.
 */
export async function createClient(data: ClientFormValues): Promise<string> {
  try {
    const addons = Array.isArray(data.addons) ? data.addons : [];

    // Step 1: Create the client
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert({
        email: data.email,
        company_name: data.companyName || null,
        contact_person: data.contactPerson || null,
        position: data.position || null,
        industry: data.industry || null,
        company_size: data.companySize || null,
        subscription_id: data.subscriptionId,
        status: "pending",
        onboarding_status: "not_started",
      })
      .select("id")
      .single();

    if (clientError) throw clientError;
    const clientId = clientData.id;

    // Step 2: Add addons
    if (addons.length > 0) {
      const addonRecords = addons.map((addonId) => ({
        client_id: clientId,
        addon_id: addonId,
      }));

      const { error: addonError } = await supabase
        .from("client_addons")
        .insert(addonRecords);

      if (addonError) throw addonError;
    }

    // Step 3: Add team members
    if (data.teamMembers && data.teamMembers.length > 0) {
      const teamMemberRecords = data.teamMembers.map((member) => ({
        client_id: clientId,
        email: member.email,
        invitation_status: "pending",
      }));

      const { error: teamError } = await supabase
        .from("team_members")
        .insert(teamMemberRecords);

      if (teamError) throw teamError;
    }

    // Step 4: Add onboarding steps
    const onboardingSteps = [
      "welcome",
      "contract",
      "questionnaire",
      "upload",
      "integration",
      "training",
    ];

    const onboardingRecords = onboardingSteps.map((step, index) => ({
      client_id: clientId,
      step_name: step,
      step_order: index + 1,
      completed: false,
    }));

    const { error: onboardingError } = await supabase
      .from("onboarding_progress")
      .insert(onboardingRecords);

    if (onboardingError) throw onboardingError;

    return clientId;
  } catch (error: any) {
    console.error("Client creation failed:", error);
    toast({
      title: "Error creating client",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    throw error;
  }
}
