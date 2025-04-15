
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "@/lib/types/client-types";

// Upload a file for a client
export async function uploadFile(
  clientId: string,
  file: File,
  category: string
): Promise<FileUpload | null> {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${clientId}/${Date.now()}.${fileExt}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('client-documents')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('client-documents')
      .getPublicUrl(filePath);
    
    // Insert file record
    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .insert({
        client_id: clientId,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        category,
        status: 'pending',
        file_path: filePath
      })
      .select()
      .single();
    
    if (fileError) throw fileError;
    
    return {
      id: fileData.id,
      clientId: fileData.client_id,
      fileName: fileData.filename,
      fileType: fileData.file_type,
      fileSize: fileData.file_size,
      category: fileData.category,
      status: fileData.status,
      uploadedAt: fileData.uploaded_at,
      verifiedAt: fileData.verified_at
    };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to upload file",
      variant: "destructive",
    });
    return null;
  }
}

// Get all files for a client
export async function getClientFiles(clientId: string): Promise<FileUpload[]> {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('client_id', clientId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(file => ({
      id: file.id,
      clientId: file.client_id,
      fileName: file.filename,
      fileType: file.file_type,
      fileSize: file.file_size,
      category: file.category,
      status: file.status,
      uploadedAt: file.uploaded_at,
      verifiedAt: file.verified_at
    }));
  } catch (error: any) {
    console.error("Error fetching client files:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to fetch files",
      variant: "destructive",
    });
    return [];
  }
}

// Update file verification status
export async function updateFileStatus(
  fileId: string,
  status: 'pending' | 'verified' | 'rejected'
): Promise<boolean> {
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
  } catch (error: any) {
    console.error("Error updating file status:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to update file status",
      variant: "destructive",
    });
    return false;
  }
}

// Delete a file
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
  } catch (error: any) {
    console.error("Error deleting file:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete file",
      variant: "destructive",
    });
    return false;
  }
}
