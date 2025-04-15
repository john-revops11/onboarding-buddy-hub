import { supabase } from "@/integrations/supabase/client";
import { DocumentCategory } from "@/types/onboarding";
import { ClientFile } from "@/lib/types/client-types";

export interface FileUploadResult {
  success: boolean;
  data?: any;
  error?: string;
  fileId?: string;
}

// Upload client file
export async function uploadFile(
  clientId: string,
  file: File,
  category: string
): Promise<FileUploadResult> {
  try {
    // Generate a unique file path
    const timestamp = new Date().getTime();
    const filePath = `${clientId}/${timestamp}_${file.name}`;
    
    // Insert file record first
    const { data: fileRecord, error: fileError } = await supabase
      .from("files")
      .insert({
        client_id: clientId,
        filename: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        category: category,
        status: "pending"
      })
      .select()
      .single();
    
    if (fileError) {
      console.error("Error creating file record:", fileError);
      return {
        success: false,
        error: fileError.message
      };
    }
    
    // Return the file ID in the result so it can be accessed
    return {
      success: true,
      data: fileRecord,
      fileId: fileRecord.id
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during file upload"
    };
  }
}

// Get client files
export async function getClientFiles(clientId: string): Promise<ClientFile[]> {
  try {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("client_id", clientId)
      .order("uploaded_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching client files:", error);
      return [];
    }
    
    return data.map((file: any) => ({
      ...file,
      fileName: file.filename,
      url: file.file_path
    }));
  } catch (error) {
    console.error("Error fetching client files:", error);
    return [];
  }
}

// Update file status
export async function updateFileStatus(
  fileId: string,
  status: "pending" | "verified" | "rejected"
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("files")
      .update({
        status,
        verified_at: status === "verified" ? new Date().toISOString() : null
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
