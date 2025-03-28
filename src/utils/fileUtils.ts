
import { UploadedFile } from "@/types/onboarding";

/**
 * Upload file to the server
 * @param file File to upload
 * @param userId User ID who uploaded the file
 * @returns Promise with uploaded file metadata
 */
export const uploadFile = async (file: File, userId: string): Promise<UploadedFile> => {
  // In a real app, you would upload to a server/cloud storage
  // This is a mock implementation
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a mock response
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        userId: userId,
        uploadedAt: new Date().toISOString(),
      };
      
      // Store in localStorage for demo purposes
      const existingFiles = getUploadedFiles();
      localStorage.setItem('uploadedFiles', JSON.stringify([...existingFiles, uploadedFile]));
      
      resolve(uploadedFile);
    }, 1000);
  });
};

/**
 * Get all uploaded files
 * @returns Array of uploaded files
 */
export const getUploadedFiles = (): UploadedFile[] => {
  const filesJson = localStorage.getItem('uploadedFiles');
  return filesJson ? JSON.parse(filesJson) : [];
};

/**
 * Get uploaded files for a specific user
 * @param userId User ID
 * @returns Array of uploaded files for the user
 */
export const getUserFiles = (userId: string): UploadedFile[] => {
  const allFiles = getUploadedFiles();
  return allFiles.filter(file => file.userId === userId);
};

/**
 * Delete a file by ID
 * @param fileId File ID to delete
 * @returns Boolean indicating success
 */
export const deleteFile = (fileId: string): boolean => {
  const allFiles = getUploadedFiles();
  const updatedFiles = allFiles.filter(file => file.id !== fileId);
  
  if (updatedFiles.length < allFiles.length) {
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    return true;
  }
  
  return false;
};
