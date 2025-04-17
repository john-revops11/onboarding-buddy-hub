import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/lib/types/client-types";

// ✅ Fetch all subscription tiers
export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("price", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subscription tiers:", error);
    return [];
  }
}

// ✅ Alias for legacy compatibility
export const getSubscriptions = getSubscriptionTiers;

// ✅ Fetch a single subscription tier by ID
export async function getSubscriptionTier(id: string): Promise<SubscriptionTier | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching subscription tier:", error);
    return null;
  }
}

// ✅ Create a new subscription tier
export async function createSubscriptionTier(
  subscription: Omit<SubscriptionTier, "id">
): Promise<SubscriptionTier | null> {
  try {
    if (!Array.isArray(subscription.features)) {
      throw new Error("Features must be an array of strings.");
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .insert(subscription)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("❌ Failed to create subscription:", error.message || error);
    return null;
  }
}

// ✅ Update an existing subscription tier
export async function updateSubscriptionTier(
  id: string,
  subscription: Partial<Omit<SubscriptionTier, "id">>
): Promise<SubscriptionTier | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(subscription)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("❌ Failed to update subscription:", error.message || error);
    return null;
  }
}

// ✅ Delete a subscription tier
export async function deleteSubscriptionTier(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("❌ Failed to delete subscription:", error.message || error);
    return false;
  }
}
