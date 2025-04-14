
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/lib/types/client-types";

/**
 * Upload a file for a client
 * @param file The file to upload
 * @param clientId The client ID
 * @param category Optional category for the file
 * @param userId Optional user ID of the uploader
 * @returns Promise with the uploaded file details
 */
export async function uploadClientFile(
  file: File, 
  clientId: string, 
  category?: string,
  userId?: string
): Promise<FileUpload> {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${clientId}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('client-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (storageError) throw storageError;
    
    // Create a record in the files table
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        client_id: clientId,
        filename: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category: category || 'general',
        status: 'pending',
        uploaded_by: userId || null
      })
      .select()
      .single();
    
    if (fileError) throw fileError;
    
    // Get the public URL for the file
    const { data: publicURL } = supabase
      .storage
      .from('client-files')
      .getPublicUrl(filePath);
    
    return {
      id: fileRecord.id,
      clientId: fileRecord.client_id,
      fileName: fileRecord.filename,
      filePath: fileRecord.file_path,
      fileSize: fileRecord.file_size,
      fileType: fileRecord.file_type,
      category: fileRecord.category,
      status: fileRecord.status,
      uploadedBy: fileRecord.uploaded_by,
      uploadedAt: fileRecord.uploaded_at,
      verifiedAt: fileRecord.verified_at,
      metadata: {
        publicUrl: publicURL.publicUrl
      }
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Get files for a client
 * @param clientId The client ID
 * @param category Optional category to filter by
 * @returns Promise with the client's files
 */
export async function getClientFiles(
  clientId: string,
  category?: string
): Promise<FileUpload[]> {
  try {
    let query = supabase
      .from('files')
      .select('*')
      .eq('client_id', clientId);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(record => ({
      id: record.id,
      clientId: record.client_id,
      fileName: record.filename,
      filePath: record.file_path,
      fileSize: record.file_size,
      fileType: record.file_type,
      category: record.category,
      status: record.status,
      uploadedBy: record.uploaded_by,
      uploadedAt: record.uploaded_at,
      verifiedAt: record.verified_at,
      metadata: record.metadata
    }));
  } catch (error: any) {
    console.error('Error getting client files:', error);
    throw error;
  }
}

/**
 * Update file status
 * @param fileId The file ID
 * @param status The new status
 * @returns Promise with the updated file
 */
export async function updateFileStatus(
  fileId: string,
  status: 'pending' | 'verified' | 'rejected'
): Promise<FileUpload> {
  try {
    const { data, error } = await supabase
      .from('files')
      .update({
        status,
        verified_at: status !== 'pending' ? new Date().toISOString() : null
      })
      .eq('id', fileId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      clientId: data.client_id,
      fileName: data.filename,
      filePath: data.file_path,
      fileSize: data.file_size,
      fileType: data.file_type,
      category: data.category,
      status: data.status,
      uploadedBy: data.uploaded_by,
      uploadedAt: data.uploaded_at,
      verifiedAt: data.verified_at,
      metadata: data.metadata
    };
  } catch (error: any) {
    console.error('Error updating file status:', error);
    throw error;
  }
}
