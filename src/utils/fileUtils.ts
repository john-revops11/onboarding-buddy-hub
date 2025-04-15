
import { UploadedFile, DocumentCategory } from "@/types/onboarding";

// Mock data storage
const FILES_STORAGE_KEY = "user_files";

// Upload a file to storage (simulated)
export const uploadFile = async (
  file: File,
  userId: string,
  category: DocumentCategory = "general"
): Promise<UploadedFile> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate a unique ID
      const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create a URL (in a real app, this would be the storage URL)
      const url = URL.createObjectURL(file);
      
      // Create file record
      const newFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        category,
        uploadedAt: new Date().toISOString(),
        status: "pending",
      };
      
      // Get existing files
      const files = getUserFiles(userId);
      
      // Add new file
      const updatedFiles = [...files, newFile];
      
      // Save to storage
      localStorage.setItem(
        `${FILES_STORAGE_KEY}_${userId}`,
        JSON.stringify(updatedFiles)
      );
      
      resolve(newFile);
    }, 1000);
  });
};

// Get all user files
export const getUserFiles = (userId: string): UploadedFile[] => {
  const filesJson = localStorage.getItem(`${FILES_STORAGE_KEY}_${userId}`);
  return filesJson ? JSON.parse(filesJson) : [];
};

// Get user files by category
export const getUserFilesByCategory = (
  userId: string,
  category: DocumentCategory
): UploadedFile[] => {
  const files = getUserFiles(userId);
  return files.filter((file) => file.category === category);
};

// Delete a file
export const deleteFile = (fileId: string): boolean => {
  try {
    // Get all user data from localStorage
    const allKeys = Object.keys(localStorage);
    const fileStorageKeys = allKeys.filter((key) =>
      key.startsWith(FILES_STORAGE_KEY)
    );
    
    let fileDeleted = false;
    
    // Check each user's files
    fileStorageKeys.forEach((key) => {
      const filesJson = localStorage.getItem(key);
      if (filesJson) {
        const files: UploadedFile[] = JSON.parse(filesJson);
        const fileIndex = files.findIndex((file) => file.id === fileId);
        
        if (fileIndex !== -1) {
          // If URL is an object URL, revoke it
          if (files[fileIndex].url.startsWith("blob:")) {
            URL.revokeObjectURL(files[fileIndex].url);
          }
          
          // Remove the file
          files.splice(fileIndex, 1);
          
          // Update storage
          localStorage.setItem(key, JSON.stringify(files));
          fileDeleted = true;
        }
      }
    });
    
    return fileDeleted;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Verify a file (simulated admin action)
export const verifyFile = (
  fileId: string,
  status: "verified" | "rejected" = "verified"
): boolean => {
  try {
    // Get all user data from localStorage
    const allKeys = Object.keys(localStorage);
    const fileStorageKeys = allKeys.filter((key) =>
      key.startsWith(FILES_STORAGE_KEY)
    );
    
    let fileUpdated = false;
    
    // Check each user's files
    fileStorageKeys.forEach((key) => {
      const filesJson = localStorage.getItem(key);
      if (filesJson) {
        const files: UploadedFile[] = JSON.parse(filesJson);
        const fileIndex = files.findIndex((file) => file.id === fileId);
        
        if (fileIndex !== -1) {
          // Update the file status
          files[fileIndex] = {
            ...files[fileIndex],
            status,
          };
          
          // Update storage
          localStorage.setItem(key, JSON.stringify(files));
          fileUpdated = true;
        }
      }
    });
    
    return fileUpdated;
  } catch (error) {
    console.error("Error updating file status:", error);
    return false;
  }
};

// Check if required documents are uploaded and verified
export const checkRequiredDocuments = (
  userId: string,
  requiredCategories: DocumentCategory[]
) => {
  const files = getUserFiles(userId);
  
  // Track categories
  const uploaded: DocumentCategory[] = [];
  const verified: DocumentCategory[] = [];
  const rejected: DocumentCategory[] = [];
  
  // Check each required category
  requiredCategories.forEach((category) => {
    const categoryFiles = files.filter((file) => file.category === category);
    
    if (categoryFiles.length > 0) {
      uploaded.push(category);
      
      // Check if any file in this category is verified or rejected
      const verifiedFile = categoryFiles.find((file) => file.status === "verified");
      const rejectedFile = categoryFiles.find((file) => file.status === "rejected");
      
      if (verifiedFile) {
        verified.push(category);
      }
      
      if (rejectedFile) {
        rejected.push(category);
      }
    }
  });
  
  // Check if all required categories are verified
  const complete = verified.length === requiredCategories.length;
  
  return {
    uploaded,
    verified,
    rejected,
    complete,
  };
};

// Get all files from all users (for admin)
export const getAllFiles = (): { userId: string; files: UploadedFile[] }[] => {
  try {
    // Get all user data from localStorage
    const allKeys = Object.keys(localStorage);
    const fileStorageKeys = allKeys.filter((key) =>
      key.startsWith(FILES_STORAGE_KEY)
    );
    
    return fileStorageKeys.map((key) => {
      const userId = key.replace(`${FILES_STORAGE_KEY}_`, "");
      const filesJson = localStorage.getItem(key);
      const files: UploadedFile[] = filesJson ? JSON.parse(filesJson) : [];
      
      return { userId, files };
    });
  } catch (error) {
    console.error("Error getting all files:", error);
    return [];
  }
};
