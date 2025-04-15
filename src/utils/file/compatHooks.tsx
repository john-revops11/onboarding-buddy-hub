
import React, { useState, useEffect } from 'react';
import { UploadedFile } from "@/types/onboarding";
import { checkRequiredDocuments } from './fileStatus';

// Add compatibility functions for useChecklist.tsx
export function getUserFiles(userId: string): UploadedFile[] {
  // This function now fetches files from the database using getClientFiles
  const [files, setFiles] = useState<UploadedFile[]>([]);
  
  useEffect(() => {
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

export function checkRequiredDocumentsForUser(userId: string, requiredCategories: string[]) {
  const allFiles = getUserFiles(userId);
  return checkRequiredDocuments(allFiles, requiredCategories);
}
