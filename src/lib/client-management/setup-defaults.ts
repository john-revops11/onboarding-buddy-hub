
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Creates a default subscription plan if none exist
 * This is useful for initial setup and testing
 */
export const createDefaultSubscription = async () => {
  try {
    // Check if any subscriptions exist
    const { data: existingSubscriptions, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error("Error checking subscriptions:", checkError);
      return false;
    }
    
    // If subscriptions already exist, do nothing
    if (existingSubscriptions && existingSubscriptions.length > 0) {
      return true;
    }
    
    // Create default subscription plans
    const { data, error } = await supabase.rpc('admin_create_subscription', {
      name_param: 'Basic Plan',
      description_param: 'Entry-level subscription with essential features',
      price_param: 99.99
    });
    
    if (error) {
      console.error("Error creating default subscription:", error);
      return false;
    }
    
    // Create a second subscription plan for variety
    const { data: pro, error: proError } = await supabase.rpc('admin_create_subscription', {
      name_param: 'Professional Plan',
      description_param: 'Advanced features for growing businesses',
      price_param: 249.99
    });
    
    if (proError) {
      console.error("Error creating pro subscription:", proError);
    }
    
    toast.success("Default subscription plans created");
    return true;
  } catch (error) {
    console.error("Error in createDefaultSubscription:", error);
    return false;
  }
};

/**
 * Initialize default data needed for the application
 */
export const initializeDefaultData = async () => {
  await createDefaultSubscription();
};
