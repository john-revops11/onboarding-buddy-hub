import { supabase } from "@/integrations/supabase/client";
import { ClientFormValues } from "@/components/admin/onboarding/formSchema";

export async function updateClient(clientId: string, values: ClientFormValues): Promise<boolean> {
  const { error } = await supabase.from("clients").update({
    company_name: values.companyName,
    email: values.email,
    contact_person: values.contactPerson,
    position: values.position,
    industry: values.industry,
    company_size: values.companySize,
    subscription_id: values.subscriptionId,
    notes: values.notes || null,
  }).eq("id", clientId);

  return !error;
}
