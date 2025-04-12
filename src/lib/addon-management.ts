
import { supabase } from "@/integrations/supabase/client";
import { Addon } from "@/lib/types/client-types";

// Fetch available addons
export async function getAddons(): Promise<Addon[]> {
  try {
    const { data, error } = await supabase
      .from('addons')
      .select('id, name, description, price, tags')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching addons:", error);
    return [];
  }
}
