
import { supabase } from "@/integrations/supabase/client";

// Delete file
export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    // First get the file to retrieve its path
    const { data: file, error: fetchError } = await supabase
      .from("files")
      .select("file_path")
      .eq("id", fileId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching file for deletion:", fetchError);
      return false;
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase
      .storage
      .from('client-files')
      .remove([file.file_path]);
    
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      return false;
    }
    
    // Delete the file record
    const { error: recordError } = await supabase
      .from("files")
      .delete()
      .eq("id", fileId);
    
    if (recordError) {
      console.error("Error deleting file record:", recordError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
