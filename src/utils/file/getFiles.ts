
import { supabase } from "@/integrations/supabase/client";
import { UploadedFile } from "@/types/onboarding";

// Get all uploaded files
export async function getUploadedFiles(): Promise<UploadedFile[]> {
  try {
    const { data, error } = await supabase
      .from("files")
      .select(`
        *,
        clients:client_id (
          email,
          company_name
        )
      `)
      .order("uploaded_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching uploaded files:", error);
      return [];
    }
    
    return data.map((file: any) => {
      // Get the public URL for the file
      const { data: publicURL } = supabase
        .storage
        .from('client-files')
        .getPublicUrl(file.file_path);
      
      return {
        id: file.id,
        name: file.filename,
        size: file.file_size,
        type: file.file_type,
        url: publicURL.publicUrl || file.file_path,
        category: file.category,
        uploadedAt: file.uploaded_at,
        status: file.status,
        userId: file.client_id,
        userEmail: file.clients?.email,
        notes: file.metadata?.notes
      };
    });
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    return [];
  }
}
