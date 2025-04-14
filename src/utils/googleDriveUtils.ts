
// Real implementation for Google Drive integration
import { toast } from "sonner";

// Types for Google Drive files
export interface DriveFile {
  id: string;
  name: string;
  size: string;
  modifiedTime: string;
  status?: string;
  type?: string;
  webViewLink: string;
  embedLink: string;
}

// Get all files from a client folder
export const getClientFiles = async (clientId: string, folderType: string): Promise<DriveFile[]> => {
  try {
    const response = await fetch(`/api/drive/${clientId}/folders/${folderType}/files`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.files;
  } catch (error) {
    console.error("Error fetching client files:", error);
    toast.error("Failed to load files. Please try again later.");
    return [];
  }
};

// Get the latest file from a client folder
export const getLatestFile = async (clientId: string, folderType: string): Promise<DriveFile | null> => {
  try {
    const response = await fetch(`/api/drive/${clientId}/folders/${folderType}/latest`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch latest file: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.file || null;
  } catch (error) {
    console.error("Error fetching latest file:", error);
    toast.error("Failed to load the latest file. Please try again later.");
    return null;
  }
};

// Upload a file to a client folder
export const uploadFileToClientFolder = async (clientId: string, folderType: string, file: File): Promise<DriveFile | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/drive/${clientId}/folders/${folderType}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }
    
    const data = await response.json();
    toast.success(`File "${file.name}" uploaded successfully`);
    return data.file;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Failed to upload file. Please try again later.");
    return null;
  }
};
