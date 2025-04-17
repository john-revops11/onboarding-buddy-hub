import { supabase } from "@/integrations/supabase/client";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

export async function updateClient(clientId: string, data: Partial<ClientFormValues>): Promise<void> {
  const { error } = await supabase
    .from("clients")
    .update({
      email: data.email,
      company_name: data.companyName,
      contact_person: data.contactPerson,
      position: data.position,
      industry: data.industry,
      company_size: data.companySize,
      subscription_id: data.subscriptionId,
      onboarding_status: data.onboardingStatus,
    })
    .eq("id", clientId);

  if (error) {
    console.error("Error updating client:", error);
    throw new Error(error.message);
  }
}

export async function updateClientAddons(clientId: string, addonIds: string[]): Promise<void> {
  // Delete existing
  const { error: deleteError } = await supabase
    .from("client_addons")
    .delete()
    .eq("client_id", clientId);

  if (deleteError) {
    console.error("Error removing existing addons:", deleteError);
    throw new Error(deleteError.message);
  }

  if (addonIds.length === 0) return;

  // Insert new
  const newAddons = addonIds.map((addonId) => ({
    client_id: clientId,
    addon_id: addonId,
  }));

  const { error: insertError } = await supabase.from("client_addons").insert(newAddons);

  if (insertError) {
    console.error("Error inserting new addons:", insertError);
    throw new Error(insertError.message);
  }
}
