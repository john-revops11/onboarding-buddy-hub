
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
    // Generate a unique file path with client ID as the folder
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
    
    // Now upload the actual file to storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('client-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (storageError) {
      console.error("Error uploading file to storage:", storageError);
      
      // Clean up the file record if storage upload fails
      await supabase
        .from("files")
        .delete()
        .eq("id", fileRecord.id);
      
      return {
        success: false,
        error: storageError.message
      };
    }
    
    // Update the file record with the storage URL
    const { data: publicURL } = supabase
      .storage
      .from('client-files')
      .getPublicUrl(filePath);
    
    const { error: updateError } = await supabase
      .from("files")
      .update({ 
        file_path: filePath,
        metadata: { storage_path: filePath, public_url: publicURL.publicUrl }
      })
      .eq("id", fileRecord.id);
    
    if (updateError) {
      console.error("Error updating file record with storage URL:", updateError);
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
    
    return data.map((file: any) => {
      // Get the public URL for the file
      const { data: publicURL } = supabase
        .storage
        .from('client-files')
        .getPublicUrl(file.file_path);
      
      return {
        ...file,
        fileName: file.filename,
        url: publicURL.publicUrl || file.file_path
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
