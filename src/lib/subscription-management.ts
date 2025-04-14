
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/lib/types/client-types";

// Fetch available subscription tiers
export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, name, description, price')
      .order('price', { ascending: true });
    
    if (error) {
      console.error("Error fetching subscription tiers:", error);
      throw error;
    }
    
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
    
    if (error) {
      console.error("Error deleting subscription tier:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting subscription tier:", error);
    return false;
  }
}

// Create a new subscription tier
export async function createSubscriptionTier(subscription: Omit<SubscriptionTier, 'id'>): Promise<SubscriptionTier | null> {
  try {
    // Use the service role to bypass RLS
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      throw error;
    }
    
    // Use rpc to call a server-side function that will handle this with higher privileges
    const { data: newSubscription, error: insertError } = await supabase
      .rpc('admin_create_subscription', {
        name_param: subscription.name,
        description_param: subscription.description,
        price_param: subscription.price
      });
    
    if (insertError) {
      console.error("Error creating subscription tier:", insertError);
      throw insertError;
    }
    
    return newSubscription;
  } catch (error) {
    console.error("Error creating subscription tier:", error);
    return null;
  }
}

// Update an existing subscription tier
export async function updateSubscriptionTier(id: string, subscription: Partial<SubscriptionTier>): Promise<SubscriptionTier | null> {
  try {
    // Use rpc to call a server-side function that will handle this with higher privileges
    const { data: updatedSubscription, error: updateError } = await supabase
      .rpc('admin_update_subscription', {
        id_param: id,
        name_param: subscription.name,
        description_param: subscription.description,
        price_param: subscription.price
      });
    
    if (updateError) {
      console.error("Error updating subscription tier:", updateError);
      throw updateError;
    }
    
    return updatedSubscription;
  } catch (error) {
    console.error("Error updating subscription tier:", error);
    return null;
  }
}
