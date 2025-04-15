
// This file is kept for backward compatibility
// It re-exports all the functionality from the new file utility modules
import React from 'react';
import { 
  getUploadedFiles,
  updateFileStatus,
  deleteFile,
  uploadFile,
  checkRequiredDocuments as checkRequiredDocsOriginal,
  getUserFiles,
  getUserFilesByCategory,
  checkRequiredDocumentsForUser
} from './file';

// Re-export everything for backward compatibility
export {
  getUploadedFiles,
  updateFileStatus,
  deleteFile,
  uploadFile
};

// Add compatibility functions for useChecklist.tsx
export { getUserFiles, getUserFilesByCategory };

// Re-export but rename to maintain existing API
export const checkRequiredDocuments = checkRequiredDocumentsForUser;
