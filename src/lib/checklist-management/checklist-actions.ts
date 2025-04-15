
import { supabase } from "@/integrations/supabase/client";

// Assign a checklist to a client
export async function assignChecklistToClient(
  checklistId: string,
  clientId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .rpc('assign_checklist_to_client', {
        p_checklist_id: checklistId,
        p_client_id: clientId
      });

    if (error) throw error;
    
    return { success: true, id: data };
  } catch (error: any) {
    console.error("Error assigning checklist to client:", error);
    return {
      success: false,
      error: error.message || "Failed to assign checklist"
    };
  }
}

// Update a checklist item's completion status
export async function updateChecklistItemStatus(
  clientChecklistItemId: string,
  completed: boolean,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .rpc('complete_checklist_item', {
        p_client_checklist_item_id: clientChecklistItemId,
        p_completed: completed,
        p_notes: notes
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating checklist item status:", error);
    return {
      success: false,
      error: error.message || "Failed to update item status"
    };
  }
}

// Get clients for assignment dropdown
export async function getClientsForAssignment() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, email, company_name')
      .order('email');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching clients for assignment:", error);
    return [];
  }
}
