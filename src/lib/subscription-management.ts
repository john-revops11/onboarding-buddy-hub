
import { supabase } from "@/integrations/supabase/client";
import { Subscription, SubscriptionTier } from "@/lib/types/client-types";

// Get all subscription tiers
export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
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

// Alias for backward compatibility
export const getSubscriptions = getSubscriptionTiers;

// Get a single subscription tier by ID
export async function getSubscriptionTier(id: string): Promise<SubscriptionTier | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching subscription tier:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching subscription tier:", error);
    return null;
  }
}

// Create a new subscription tier
export async function createSubscriptionTier(subscription: Omit<SubscriptionTier, 'id'>): Promise<SubscriptionTier | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating subscription tier:", error);
      throw error;
    }
    
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
      .update(subscription)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating subscription tier:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error updating subscription tier:", error);
    return null;
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
