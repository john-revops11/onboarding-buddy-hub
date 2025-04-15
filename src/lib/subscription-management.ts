
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/lib/types/client-types";

// Fetch available subscription tiers
export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, name, description, price, features')
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
    // Use RPC to call a server-side function with higher privileges
    const { data, error } = await supabase
      .rpc('admin_delete_subscription', {
        id_param: id
      });
    
    if (error) {
      console.error("Error deleting subscription tier:", error);
      throw error;
    }
    
    return data || false;
  } catch (error) {
    console.error("Error deleting subscription tier:", error);
    return false;
  }
}

// Create a new subscription tier
export async function createSubscriptionTier(
  subscription: Omit<SubscriptionTier, 'id'> | { name: string; description: string; price: number; features?: string[] }
): Promise<SubscriptionTier | null> {
  try {
    // Ensure price is a number before sending to API
    const subscriptionData = {
      name: subscription.name,
      description: subscription.description,
      price: typeof subscription.price === 'string' ? parseFloat(subscription.price) : subscription.price,
      features: subscription.features || []
    };

    // Use rpc to call a server-side function that will handle this with higher privileges
    const { data: newSubscription, error: insertError } = await supabase
      .rpc('admin_create_subscription_with_features', {
        name_param: subscriptionData.name,
        description_param: subscriptionData.description,
        price_param: subscriptionData.price,
        features_param: subscriptionData.features
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
export async function updateSubscriptionTier(
  id: string, 
  subscription: Partial<SubscriptionTier> | { name?: string; description?: string; price?: number; features?: string[] }
): Promise<SubscriptionTier | null> {
  try {
    console.log("Updating subscription with:", { id, subscription });
    
    // Ensure price is a number before sending to API
    const subscriptionData = {
      name: subscription.name,
      description: subscription.description,
      price: typeof subscription.price === 'string' ? parseFloat(subscription.price as string) : subscription.price,
      features: subscription.features || []
    };
    
    // Use rpc to call a server-side function that will handle this with higher privileges
    const { data: updatedSubscription, error: updateError } = await supabase
      .rpc('admin_update_subscription_with_features', {
        id_param: id,
        name_param: subscriptionData.name,
        description_param: subscriptionData.description,
        price_param: subscriptionData.price,
        features_param: subscriptionData.features
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
