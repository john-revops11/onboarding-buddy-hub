import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

// Create a new client with subscription, addons and team members
export async function createClient(data: ClientFormValues): Promise<string> {
  try {
    const addons = Array.isArray(data.addons) ? data.addons : [];

    // Ensure subscriptionId is valid
    if (!data.subscriptionId) {
      throw new Error("Subscription ID is required.");
    }

    // Step 1: Create the client
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert([
        {
          email: data.email,
          company_name: data.companyName || null,
          subscription_id: data.subscriptionId,
          status: "pending",

          // New fields
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

    // Step 4: Create onboarding steps
    const onboardingSteps = [
      { step_name: "welcome", step_order: 1, completed: false },
      { step_name: "contract", step_order: 2, completed: false },
      { step_name: "questionnaire", step_order: 3, completed: false },
      { step_name: "upload", step_order: 4, completed: false },
      { step_name: "integration", step_order: 5, completed: false },
      { step_name: "training", step_order: 6, completed: false },
    ];

    const onboardingRecords = onboardingSteps.map((step) => ({
      client_id: clientId,
      step_name: step.step_name,
      step_order: step.step_order,
      completed: step.completed,
    }));

    const { error: onboardingError } = await supabase
      .from("onboarding_progress")
      .insert(onboardingRecords);

    if (onboardingError) throw onboardingError;

    // Success: Return client ID
    toast({
      title: "Client Created",
      description: `Client ${data.companyName} has been successfully created.`,
      variant: "success",
    });

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
