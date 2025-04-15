
import { supabase } from "@/integrations/supabase/client";
import { UploadedFile, DocumentCategory } from "@/types/onboarding";

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

// Update file status
export async function updateFileStatus(fileId: string, status: 'pending' | 'verified' | 'rejected', notes?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("files")
      .update({
        status,
        verified_at: status === "verified" ? new Date().toISOString() : null,
        metadata: notes ? { notes } : undefined
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

// Add compatibility functions for useChecklist.tsx
export function getUserFiles(userId: string): UploadedFile[] {
  // This function now fetches files from the database using getClientFiles
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  
  React.useEffect(() => {
    async function fetchFiles() {
      const clientFiles = await import("@/lib/client-management/file-upload").then(module => 
        module.getClientFiles(userId)
      );
      setFiles(clientFiles as unknown as UploadedFile[]);
    }
    
    if (userId) {
      fetchFiles();
    }
  }, [userId]);
  
  return files;
}

export function getUserFilesByCategory(userId: string, category: string): UploadedFile[] {
  const allFiles = getUserFiles(userId);
  return allFiles.filter(file => file.category === category);
}

export function checkRequiredDocuments(userId: string, requiredCategories: string[]) {
  const allFiles = getUserFiles(userId);
  
  const uploaded = requiredCategories.filter(category =>
    allFiles.some(file => file.category === category)
  );
  
  const verified = requiredCategories.filter(category =>
    allFiles.some(file => file.category === category && file.status === 'verified')
  );
  
  const rejected = requiredCategories.filter(category =>
    allFiles.some(file => file.category === category && file.status === 'rejected')
  );
  
  const missing = requiredCategories.filter(category =>
    !allFiles.some(file => file.category === category)
  );
  
  return { 
    complete: missing.length === 0, 
    missing,
    uploaded,
    verified,
    rejected
  };
}
