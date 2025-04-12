
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/lib/types/client-types";

// Fetch available subscription tiers
export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, name, description, price')
      .order('price', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching subscription tiers:", error);
    return [];
  }
}
