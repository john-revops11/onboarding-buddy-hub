
import { supabase } from "@/integrations/supabase/client";

// Update file status
export async function updateFileStatus(fileId: string, status: 'pending' | 'verified' | 'rejected', notes?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("files")
      .update({
        status,
        verified_at: status === "verified" ? new Date().toISOString() : null,
        metadata: notes ? { notes } : undefined
      })
      .eq("id", fileId);
    
    if (error) {
      console.error("Error updating file status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating file status:", error);
    return false;
  }
}
