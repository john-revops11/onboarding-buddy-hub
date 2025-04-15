
import { supabase } from "@/integrations/supabase/client";
import { UploadedFile } from "@/types/onboarding";

// Get all uploaded files
export async function getUploadedFiles(): Promise<UploadedFile[]> {
  try {
    const { data, error } = await supabase
      .from('files')
      .select(`
        id,
        filename,
        file_type,
        file_size,
        category,
        status,
        uploaded_at,
        verified_at,
        client_id,
        clients (email, company_name)
      `)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(file => {
      const url = supabase.storage
        .from('client-documents')
        .getPublicUrl(file.file_path).data.publicUrl;
        
      return {
        id: file.id,
        name: file.filename,
        size: file.file_size,
        type: file.file_type,
        url: url,
        category: file.category,
        uploadedAt: file.uploaded_at,
        status: file.status,
        userId: file.client_id,
        userEmail: file.clients?.email || 'Unknown'
      };
    });
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    return [];
  }
}

// Update file status
export async function updateFileStatus(fileId: string, status: 'pending' | 'verified' | 'rejected'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('files')
      .update({
        status,
        verified_at: status !== 'pending' ? new Date().toISOString() : null
      })
      .eq('id', fileId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating file status:", error);
    return false;
  }
}

// Delete file
export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    // First get the file to get its path
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('file_path')
      .eq('id', fileId)
      .single();
    
    if (fileError) throw fileError;
    
    // Delete from storage
    if (file.file_path) {
      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .remove([file.file_path]);
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue anyway to delete from database
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
