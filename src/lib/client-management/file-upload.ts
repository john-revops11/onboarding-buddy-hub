import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/lib/types/client-types";

// Upload a file
export async function uploadFile(
  clientId: string, 
  file: File, 
  category: string
): Promise<FileUpload | null> {
  try {
    // Create a unique file path
    const filePath = `${clientId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload the file to storage
    const { data, error } = await supabase.storage
      .from('client-files')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('client-files')
      .getPublicUrl(data.path);
    
    // Create a record in the files table
    const { data: fileRecord, error: recordError } = await supabase
      .from('files')
      .insert({
        client_id: clientId,
        filename: file.name,
        file_path: data.path,
        file_size: file.size,
        file_type: file.type,
        category: category,
        status: 'pending',
        uploaded_by: clientId,
      })
      .select()
      .single();
    
    if (recordError) throw recordError;
    
    return {
      id: fileRecord.id,
      clientId: fileRecord.client_id,
      fileName: fileRecord.filename,
      fileType: fileRecord.file_type,
      fileSize: fileRecord.file_size,
      category: fileRecord.category,
      status: fileRecord.status,
      uploadedAt: fileRecord.uploaded_at,
      verifiedAt: fileRecord.verified_at,
      url: publicUrl
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

// Get files for a client
export async function getClientFiles(clientId: string): Promise<FileUpload[]> {
  try {
    const { data, error } = await supabase
      .from('files')
      .select(`
        id, filename, file_type, file_size, category, status, 
        uploaded_at, verified_at, client_id,
        clients (email, company_name)
      `)
      .eq('client_id', clientId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(file => {
      // Get the public URL
      const filePath = file.file_path || '';
      const { data: { publicUrl } } = supabase.storage
        .from('client-files')
        .getPublicUrl(filePath);
      
      return {
        id: file.id,
        clientId: file.client_id,
        fileName: file.filename,
        fileType: file.file_type,
        fileSize: file.file_size,
        category: file.category,
        status: file.status,
        uploadedAt: file.uploaded_at,
        verifiedAt: file.verified_at,
        url: publicUrl
      };
    });
  } catch (error) {
    console.error("Error fetching client files:", error);
    return [];
  }
}

// Update file status
export async function updateFileStatus(
  fileId: string, 
  status: 'pending' | 'verified' | 'rejected'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('files')
      .update({
        status,
        verified_at: status === 'verified' ? new Date().toISOString() : null
      })
      .eq('id', fileId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating file status:", error);
    return false;
  }
}
