
/**
 * Utility functions for Google Drive integration
 * In a production environment, these would make API calls to Google Drive API
 */

interface DriveFolder {
  id: string;
  name: string;
  webViewLink: string;
  folders?: DriveFolder[];
  files?: DriveFile[];
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  embedLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  lastModifyingUser?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  modifiedTime: string;
  size?: string;
  description?: string;
}

/**
 * Creates a client folder structure in Google Drive
 * 
 * @param clientName The name of the client company
 * @param clientId Unique identifier for the client
 * @returns The created folder structure information
 */
export const createClientFolderStructure = async (
  clientName: string,
  clientId: string
): Promise<DriveFolder> => {
  // In a real implementation, this would call the Google Drive API
  console.log(`Creating folder structure for client: ${clientName} (${clientId})`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response
  const folderStructure: DriveFolder = {
    id: `folder-${clientId}`,
    name: clientName,
    webViewLink: `https://drive.google.com/drive/folders/${clientId}`,
    folders: [
      {
        id: `folder-${clientId}-diagnostics`,
        name: "Diagnostic Reviews",
        webViewLink: `https://drive.google.com/drive/folders/${clientId}-diagnostics`,
      },
      {
        id: `folder-${clientId}-insights`,
        name: "Monthly Insights",
        webViewLink: `https://drive.google.com/drive/folders/${clientId}-insights`,
      },
      {
        id: `folder-${clientId}-data`,
        name: "Data Uploads",
        webViewLink: `https://drive.google.com/drive/folders/${clientId}-data`,
      },
      {
        id: `folder-${clientId}-resources`,
        name: "Resources",
        webViewLink: `https://drive.google.com/drive/folders/${clientId}-resources`,
      }
    ]
  };
  
  return folderStructure;
};

/**
 * Retrieves files from a client's Google Drive folder
 * 
 * @param clientId Unique identifier for the client
 * @param folderType Type of folder to retrieve files from
 * @returns List of files in the specified folder
 */
export const getClientFiles = async (
  clientId: string,
  folderType: 'diagnostics' | 'insights' | 'data' | 'resources'
): Promise<DriveFile[]> => {
  // In a real implementation, this would call the Google Drive API
  console.log(`Retrieving ${folderType} files for client: ${clientId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock files based on folder type
  const mockFiles: Record<string, DriveFile[]> = {
    diagnostics: [
      {
        id: `file-diag-1-${clientId}`,
        name: "Initial Business Assessment",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-diag-1`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-diag-1/pub?embedded=true`,
        modifiedTime: "2023-10-15T14:30:00Z",
      },
      {
        id: `file-diag-2-${clientId}`,
        name: "Q4 2023 Performance Analysis",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-diag-2`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-diag-2/pub?embedded=true`,
        modifiedTime: "2023-12-20T10:15:00Z",
      }
    ],
    insights: [
      {
        id: `file-insight-1-${clientId}`,
        name: "2025-04 - Insight - Client123",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-1`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-1/pub?embedded=true`,
        modifiedTime: "2025-04-05T16:45:00Z",
      },
      {
        id: `file-insight-2-${clientId}`,
        name: "2025-03 - Insight - Client123",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-2`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-2/pub?embedded=true`,
        modifiedTime: "2025-03-10T11:30:00Z",
      },
      {
        id: `file-insight-3-${clientId}`,
        name: "2025-02 - Insight - Client123",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-3`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-3/pub?embedded=true`,
        modifiedTime: "2025-02-08T09:15:00Z",
      },
      {
        id: `file-insight-4-${clientId}`,
        name: "2025-01 - Insight - Client123",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-4`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-4/pub?embedded=true`,
        modifiedTime: "2025-01-07T14:20:00Z",
      },
      {
        id: `file-insight-5-${clientId}`,
        name: "Q4 2024 - Quarterly Review - Client123",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-5`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-5/pub?embedded=true`,
        modifiedTime: "2024-12-20T10:30:00Z",
      },
      {
        id: `file-insight-6-${clientId}`,
        name: "2024-11 - Insight - Client123",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-6`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-6/pub?embedded=true`,
        modifiedTime: "2024-11-12T13:45:00Z",
      },
      {
        id: `file-insight-7-${clientId}`,
        name: "Growth Strategy Analysis - Q4 2024",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-insight-7`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-insight-7/pub?embedded=true`,
        modifiedTime: "2024-10-30T15:00:00Z",
      },
    ],
    data: [
      {
        id: `file-data-1-${clientId}`,
        name: "Q1 2024 Sales Data",
        mimeType: "application/vnd.google-apps.spreadsheet",
        webViewLink: `https://docs.google.com/spreadsheets/d/${clientId}-data-1`,
        modifiedTime: "2024-03-10T09:20:00Z",
      }
    ],
    resources: [
      {
        id: `file-resource-1-${clientId}`,
        name: "Onboarding Guide",
        mimeType: "application/pdf",
        webViewLink: `https://drive.google.com/file/d/${clientId}-resource-1`,
        modifiedTime: "2023-09-05T13:45:00Z",
      },
      {
        id: `file-resource-2-${clientId}`,
        name: "Data Integration Best Practices",
        mimeType: "application/vnd.google-apps.document",
        webViewLink: `https://docs.google.com/document/d/${clientId}-resource-2`,
        embedLink: `https://docs.google.com/document/d/e/${clientId}-resource-2/pub?embedded=true`,
        modifiedTime: "2023-11-12T15:10:00Z",
      }
    ]
  };
  
  return mockFiles[folderType] || [];
};

/**
 * Uploads a file to a client's Google Drive folder
 * 
 * @param clientId Unique identifier for the client
 * @param folderType Type of folder to upload to
 * @param file The file to upload
 * @returns Information about the uploaded file
 */
export const uploadFileToClientFolder = async (
  clientId: string,
  folderType: 'diagnostics' | 'insights' | 'data' | 'resources',
  file: File
): Promise<DriveFile> => {
  // In a real implementation, this would call the Google Drive API
  console.log(`Uploading ${file.name} to ${folderType} folder for client: ${clientId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response
  const uploadedFile: DriveFile = {
    id: `file-upload-${Date.now()}-${clientId}`,
    name: file.name,
    mimeType: file.type,
    webViewLink: `https://drive.google.com/file/d/upload-${Date.now()}-${clientId}`,
    modifiedTime: new Date().toISOString(),
    lastModifyingUser: {
      displayName: "Current User",
      emailAddress: "user@example.com"
    }
  };
  
  return uploadedFile;
};

/**
 * Creates a new Google Doc in a client's folder
 * 
 * @param clientId Unique identifier for the client
 * @param folderType Type of folder to create the document in
 * @param name Name of the document
 * @param content Initial content of the document
 * @returns Information about the created document
 */
export const createGoogleDoc = async (
  clientId: string,
  folderType: 'diagnostics' | 'insights' | 'data' | 'resources',
  name: string,
  content: string
): Promise<DriveFile> => {
  // In a real implementation, this would call the Google Drive API
  console.log(`Creating Google Doc "${name}" in ${folderType} folder for client: ${clientId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response
  const createdDoc: DriveFile = {
    id: `doc-${Date.now()}-${clientId}`,
    name: name,
    mimeType: "application/vnd.google-apps.document",
    webViewLink: `https://docs.google.com/document/d/doc-${Date.now()}-${clientId}`,
    embedLink: `https://docs.google.com/document/d/e/doc-${Date.now()}-${clientId}/pub?embedded=true`,
    modifiedTime: new Date().toISOString(),
    lastModifyingUser: {
      displayName: "Current User",
      emailAddress: "user@example.com"
    }
  };
  
  return createdDoc;
};

/**
 * Downloads a file from Google Drive
 * 
 * @param fileId ID of the file to download
 * @returns A blob URL that can be used to download the file
 */
export const downloadFile = async (fileId: string): Promise<string> => {
  // In a real implementation, this would call the Google Drive API
  console.log(`Downloading file with ID: ${fileId}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would return a blob URL
  return `https://example.com/download/${fileId}`;
};

/**
 * Gets the latest file from a folder based on modification date
 * 
 * @param clientId Unique identifier for the client
 * @param folderType Type of folder to get the latest file from
 * @returns The latest file in the folder
 */
export const getLatestFile = async (
  clientId: string,
  folderType: 'diagnostics' | 'insights' | 'data' | 'resources'
): Promise<DriveFile | null> => {
  const files = await getClientFiles(clientId, folderType);
  
  if (files.length === 0) {
    return null;
  }
  
  // Sort by modification date (newest first)
  files.sort((a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime());
  
  return files[0];
};
