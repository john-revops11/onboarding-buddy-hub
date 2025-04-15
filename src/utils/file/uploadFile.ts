
import { supabase } from "@/integrations/supabase/client";
import { UploadedFile, DocumentCategory } from "@/types/onboarding";

// Upload file
export async function uploadFile(clientId: string, file: File, category: DocumentCategory): Promise<UploadedFile | null> {
  try {
    const result = await import("@/lib/client-management/file-upload").then(module => 
      module.uploadFile(clientId, file, category)
    );
    
    if (!result.success) {
      throw new Error(result.error || "Failed to upload file");
    }
    
    // Get the file details
    const { data: fileData, error } = await supabase
      .from("files")
      .select(`
        *,
        clients:client_id (
          email
        )
      `)
      .eq("id", result.fileId)
      .single();
    
    if (error) {
      console.error("Error fetching uploaded file:", error);
      return null;
    }
    
    // Get the public URL for the file
    const { data: publicURL } = supabase
      .storage
      .from('client-files')
      .getPublicUrl(fileData.file_path);
    
    return {
      id: fileData.id,
      name: fileData.filename,
      size: fileData.file_size,
      type: fileData.file_type,
      url: publicURL.publicUrl || fileData.file_path,
      category: fileData.category,
      uploadedAt: fileData.uploaded_at,
      status: fileData.status,
      userId: fileData.client_id,
      userEmail: fileData.clients?.email
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
