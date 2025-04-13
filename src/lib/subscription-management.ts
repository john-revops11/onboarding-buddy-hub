
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
    
    return data || [];
  } catch (error) {
    console.error("Error fetching subscription tiers:", error);
    return [];
  }
}

// Delete a subscription tier
export async function deleteSubscriptionTier(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting subscription tier:", error);
    return false;
  }
}

// Create a new subscription tier
export async function createSubscriptionTier(subscription: Omit<SubscriptionTier, 'id'>): Promise<SubscriptionTier | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        name: subscription.name,
        description: subscription.description,
        price: subscription.price
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating subscription tier:", error);
    return null;
  }
}

// Update an existing subscription tier
export async function updateSubscriptionTier(id: string, subscription: Partial<SubscriptionTier>): Promise<SubscriptionTier | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        name: subscription.name,
        description: subscription.description,
        price: subscription.price
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating subscription tier:", error);
    return null;
  }
}
