
import { supabase } from "@/integrations/supabase/client";
import { Addon } from "@/lib/types/client-types";

// Fetch available addons
export async function getAddons(): Promise<Addon[]> {
  try {
    const { data, error } = await supabase
      .from('addons')
      .select('id, name, description, price, tags')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching addons:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching addons:", error);
    return [];
  }
}

// Create a new addon
export async function createAddon(addon: Omit<Addon, 'id'>): Promise<Addon | null> {
  try {
    // Use rpc to call a server-side function with higher privileges
    const { data: newAddon, error } = await supabase
      .rpc('admin_create_addon', {
        name_param: addon.name,
        description_param: addon.description,
        price_param: addon.price,
        tags_param: addon.tags || []  // Add default empty array if tags is undefined
      });
    
    if (error) {
      console.error("Error creating addon:", error);
      throw error;
    }
    
    return newAddon;
  } catch (error) {
    console.error("Error creating addon:", error);
    return null;
  }
}

// Update an existing addon
export async function updateAddon(id: string, addon: Partial<Addon>): Promise<Addon | null> {
  try {
    // Use rpc to call a server-side function with higher privileges
    const { data: updatedAddon, error } = await supabase
      .rpc('admin_update_addon', {
        id_param: id,
        name_param: addon.name,
        description_param: addon.description,
        price_param: addon.price,
        tags_param: addon.tags || []  // Add default empty array if tags is undefined
      });
    
    if (error) {
      console.error("Error updating addon:", error);
      throw error;
    }
    
    return updatedAddon;
  } catch (error) {
    console.error("Error updating addon:", error);
    return null;
  }
}

// Delete an addon
export async function deleteAddon(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('admin_delete_addon', {
        id_param: id
      });
    
    if (error) {
      console.error("Error deleting addon:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting addon:", error);
    return false;
  }
}

interface AddonAnalyticsData {
  subscriptionTierData: {
    tierName: string;
    addonCount: number;
    color: string;
  }[];
  addonPopularityData: {
    name: string;
    count: number;
    color: string;
  }[];
}

export async function fetchAddonAnalytics(): Promise<AddonAnalyticsData> {
  try {
    // Fetch addon popularity
    const { data: addonPopularityData, error: addonError } = await supabase
      .rpc('get_addon_popularity');
    
    // Fetch addon distribution by subscription tier
    const { data: subscriptionTierData, error: tierError } = await supabase
      .rpc('get_addon_tier_distribution');
    
    if (addonError || tierError) {
      console.error("Error fetching addon analytics:", addonError || tierError);
      throw addonError || tierError;
    }

    // Add colors to the data (you can customize these)
    const colorPalette = [
      "#3b82f6", "#10b981", "#f59e0b", 
      "#ef4444", "#8b5cf6", "#ec4899", "#4ade80"
    ];

    return {
      subscriptionTierData: subscriptionTierData.map((tier, index) => ({
        ...tier,
        color: colorPalette[index % colorPalette.length]
      })),
      addonPopularityData: addonPopularityData.map((addon, index) => ({
        ...addon,
        color: colorPalette[index % colorPalette.length]
      }))
    };
  } catch (error) {
    console.error("Error in fetchAddonAnalytics:", error);
    // Return mock data or empty data in case of error
    return {
      subscriptionTierData: [],
      addonPopularityData: []
    };
  }
}
