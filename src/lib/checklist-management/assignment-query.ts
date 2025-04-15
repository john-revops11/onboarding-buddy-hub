
import { supabase } from "@/integrations/supabase/client";

export interface AssignedChecklist {
  id: string;
  checklist_id: string;
  client_id: string;
  client_email: string;
  client_company: string | null;
  assigned_at: string;
  completed: boolean;
  completed_at: string | null;
  checklist_title: string;
  progress: number;
}

export interface ChecklistItemProgress {
  id: string;
  item_id: string;
  title: string;
  description: string | null;
  order: number;
  required: boolean;
  document_categories: string[];
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

export interface ChecklistProgress {
  id: string;
  checklist_id: string;
  client_id: string;
  assigned_at: string;
  completed: boolean;
  completed_at: string | null;
  checklist_title: string;
  total_items: number;
  completed_items: number;
  progress: number;
  items: ChecklistItemProgress[];
}

// Get all assigned checklists with progress info
export async function getAssignedChecklists(): Promise<AssignedChecklist[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_all_client_checklists');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching assigned checklists:", error);
    return [];
  }
}

// Get detailed progress for a specific assigned checklist
export async function getAssignedChecklistProgress(id: string): Promise<ChecklistProgress | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_client_checklist_progress', { client_checklist_id: id });

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const progress = data[0];
    return {
      id: progress.id,
      checklist_id: progress.checklist_id,
      client_id: progress.client_id,
      assigned_at: progress.assigned_at,
      completed: progress.completed,
      completed_at: progress.completed_at,
      checklist_title: progress.checklist_title,
      total_items: progress.total_items,
      completed_items: progress.completed_items,
      progress: progress.progress,
      items: progress.items || []
    };
  } catch (error) {
    console.error("Error fetching assigned checklist progress:", error);
    return null;
  }
}
