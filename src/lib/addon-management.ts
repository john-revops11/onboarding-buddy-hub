
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
