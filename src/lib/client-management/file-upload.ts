
import { supabase } from "@/integrations/supabase/client";
import { ClientFile, FileUpload } from "@/lib/types/client-types";

// Upload a file
export async function uploadFile(
  clientId: string,
  file: File,
  category: string
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filePath = `${clientId}/${timestamp}-${file.name}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('client-files')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Create record in database
    const { data, error: dbError } = await supabase
      .from('client_files')
      .insert({
        client_id: clientId,
        filename: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        category,
        status: 'pending'
      })
      .select()
      .single();
    
    if (dbError) throw dbError;
    
    return { success: true, fileId: data.id };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message };
  }
}

// Get all files for a client
export async function getClientFiles(clientId: string): Promise<ClientFile[]> {
  try {
    const { data, error } = await supabase
      .from('client_files')
      .select(`
        id, filename, file_path, file_type, file_size, category, status, 
        uploaded_at, verified_at, client_id,
        clients (email, company_name)
      `)
      .eq('client_id', clientId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(file => ({
      id: file.id,
      filename: file.filename,
      filePath: file.file_path, // Map file_path to filePath
      fileType: file.file_type,
      fileSize: file.file_size,
      category: file.category,
      status: file.status,
      uploadedAt: file.uploaded_at,
      verifiedAt: file.verified_at,
      clientId: file.client_id,
      clientEmail: file.clients?.[0]?.email,
      clientCompany: file.clients?.[0]?.company_name,
      // Add these properties to make it compatible with FileUpload
      fileName: file.filename,
      url: `${supabase.storage.from('client-files').getPublicUrl(file.file_path).data.publicUrl}`
    }));
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
    const updates: any = { status };
    
    if (status === 'verified') {
      updates.verified_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('client_files')
      .update(updates)
      .eq('id', fileId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating file status:", error);
    return false;
  }
}
