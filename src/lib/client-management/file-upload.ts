
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/lib/types/client-types";

// Upload a file to the storage bucket
export async function uploadFile(clientId: string, file: File, category: string): Promise<FileUpload | null> {
  try {
    // Create a unique file path
    const filePath = `${clientId}/${Date.now()}_${file.name}`;
    
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('client-documents')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('client-documents')
      .getPublicUrl(filePath);
    
    // Insert file metadata into database
    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .insert({
        client_id: clientId,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        file_path: filePath,
        category: category,
        status: 'pending'
      })
      .select('id')
      .single();
    
    if (fileError) throw fileError;
    
    // Return the file details
    return {
      id: fileData.id,
      clientId: clientId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category: category,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      url: publicUrl
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

// Get files for a specific client
export async function getClientFiles(clientId: string): Promise<FileUpload[]> {
  try {
    const { data, error } = await supabase
      .from('files')
      .select(`
        id, filename, file_type, file_size, category, status, uploaded_at, verified_at, file_path
      `)
      .eq('client_id', clientId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(file => {
      const fileObj = file as any;
      // Get public URL for each file
      const { data: { publicUrl } } = supabase.storage
        .from('client-documents')
        .getPublicUrl(fileObj.file_path || '');
        
      return {
        id: fileObj.id,
        clientId: clientId,
        fileName: fileObj.filename,
        fileType: fileObj.file_type,
        fileSize: fileObj.file_size,
        category: fileObj.category,
        status: fileObj.status,
        uploadedAt: fileObj.uploaded_at,
        verifiedAt: fileObj.verified_at,
        url: publicUrl
      };
    });
  } catch (error) {
    console.error("Error fetching client files:", error);
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
