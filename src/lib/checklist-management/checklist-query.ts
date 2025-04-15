
import { supabase } from "@/integrations/supabase/client";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string | null;
  order: number;
  required: boolean;
  document_categories: string[];
}

export interface Checklist {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  created_by: string | null;
  items: ChecklistItem[];
}

// Fetch all checklist templates
export async function getChecklists(): Promise<Checklist[]> {
  try {
    const { data, error } = await supabase
      .from('checklists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch items for each checklist
    const checklistsWithItems = await Promise.all(
      (data || []).map(async (checklist) => {
        const { data: items, error: itemsError } = await supabase
          .from('checklist_items')
          .select('*')
          .eq('checklist_id', checklist.id)
          .order('order', { ascending: true });

        if (itemsError) {
          console.error("Error fetching checklist items:", itemsError);
          return {
            ...checklist,
            items: []
          };
        }

        return {
          ...checklist,
          items: items || []
        };
      })
    );

    return checklistsWithItems;
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return [];
  }
}

// Get a single checklist with items using the database function
export async function getChecklistWithItems(id: string): Promise<Checklist | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_checklist_with_items', { checklist_id: id });

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const checklist = data[0];
    return {
      id: checklist.id,
      title: checklist.title,
      description: checklist.description,
      created_at: checklist.created_at,
      created_by: checklist.created_by,
      items: checklist.items || []
    };
  } catch (error) {
    console.error("Error fetching checklist with items:", error);
    return null;
  }
}
