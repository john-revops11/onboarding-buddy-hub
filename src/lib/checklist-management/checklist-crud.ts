
import { supabase } from "@/integrations/supabase/client";
import { Checklist, ChecklistItem } from "./checklist-query";

export interface ChecklistInput {
  title: string;
  description?: string;
  items: {
    title: string;
    description?: string;
    order: number;
    required: boolean;
    document_categories?: string[];
  }[];
}

// Create a new checklist template with items
export async function createChecklist(checklistData: ChecklistInput): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // First check if the user is an admin (optional but good practice)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    // Create the checklist
    const { data: checklist, error: checklistError } = await supabase
      .from('checklists')
      .insert({
        title: checklistData.title,
        description: checklistData.description || null,
        created_by: user.id
      })
      .select()
      .single();

    if (checklistError) {
      console.error("Error creating checklist:", checklistError);
      return { success: false, error: checklistError.message };
    }

    // Create the checklist items
    const itemsToInsert = checklistData.items.map((item, index) => ({
      checklist_id: checklist.id,
      title: item.title,
      description: item.description || null,
      order: item.order !== undefined ? item.order : index,
      required: item.required || false,
      document_categories: item.document_categories || []
    }));

    const { error: itemsError } = await supabase
      .from('checklist_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error inserting checklist items:", itemsError);
      // Since we already created the checklist, try to clean up
      await supabase.from('checklists').delete().eq('id', checklist.id);
      return { success: false, error: itemsError.message };
    }

    return { success: true, id: checklist.id };
  } catch (error: any) {
    console.error("Unexpected error creating checklist:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create checklist" 
    };
  }
}

// Update an existing checklist template and its items
export async function updateChecklist(id: string, checklistData: ChecklistInput): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if the user is an admin (optional but good practice)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    // Update checklist
    const { error: checklistError } = await supabase
      .from('checklists')
      .update({
        title: checklistData.title,
        description: checklistData.description || null,
        updated_at: new Date()
      })
      .eq('id', id);

    if (checklistError) {
      console.error("Error updating checklist:", checklistError);
      return { success: false, error: checklistError.message };
    }

    // Delete all existing items
    const { error: deleteError } = await supabase
      .from('checklist_items')
      .delete()
      .eq('checklist_id', id);

    if (deleteError) {
      console.error("Error deleting existing checklist items:", deleteError);
      return { success: false, error: deleteError.message };
    }

    // Create new items
    const itemsToInsert = checklistData.items.map((item, index) => ({
      checklist_id: id,
      title: item.title,
      description: item.description || null,
      order: item.order !== undefined ? item.order : index,
      required: item.required || false,
      document_categories: item.document_categories || []
    }));

    const { error: itemsError } = await supabase
      .from('checklist_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error inserting updated checklist items:", itemsError);
      return { success: false, error: itemsError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error updating checklist:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update checklist" 
    };
  }
}

// Delete a checklist template and its items
export async function deleteChecklist(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First check if the user is an admin (optional but good practice)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required" };
    }

    // Delete checklist (items will be deleted due to CASCADE)
    const { error } = await supabase
      .from('checklists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting checklist:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting checklist:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete checklist" 
    };
  }
}

// Duplicate a checklist
export async function duplicateChecklist(id: string, newTitle?: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Get the source checklist with items
    const sourceChecklist = await getChecklistWithItems(id);
    if (!sourceChecklist) {
      throw new Error("Source checklist not found");
    }

    // Create a new checklist based on the source
    return createChecklist({
      title: newTitle || `Copy of ${sourceChecklist.title}`,
      description: sourceChecklist.description || undefined,
      items: sourceChecklist.items.map(item => ({
        title: item.title,
        description: item.description || undefined,
        order: item.order,
        required: item.required,
        document_categories: item.document_categories
      }))
    });
  } catch (error: any) {
    console.error("Error duplicating checklist:", error);
    return { 
      success: false, 
      error: error.message || "Failed to duplicate checklist" 
    };
  }
}

// Helper function to get checklist with items
async function getChecklistWithItems(id: string): Promise<Checklist | null> {
  try {
    const { data, error } = await supabase
      .from('checklists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    const { data: items, error: itemsError } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('checklist_id', id)
      .order('order', { ascending: true });

    if (itemsError) throw itemsError;

    return {
      ...data,
      items: items || []
    };
  } catch (error) {
    console.error("Error fetching checklist with items:", error);
    return null;
  }
}
