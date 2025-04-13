
// This is a mock implementation of the Google Drive utilities
// that were removed, providing placeholder data and functionality

export const getClientFiles = async (clientId: string, folderType: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock files based on folder type
  return [
    {
      id: "file1",
      name: `${folderType}-report-2025-01.pdf`,
      size: "1.2 MB",
      modifiedTime: new Date().toISOString(),
      status: "processed",
      type: folderType === "insights" ? "monthly" : folderType,
      webViewLink: "#",
      embedLink: "#"
    },
    {
      id: "file2",
      name: `${folderType}-report-2024-12.pdf`,
      size: "950 KB",
      modifiedTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "processed",
      type: folderType === "insights" ? "quarterly" : folderType,
      webViewLink: "#",
      embedLink: "#"
    },
  ];
};

export const getLatestFile = async (clientId: string, folderType: string) => {
  const files = await getClientFiles(clientId, folderType);
  return files[0]; // Return the first file as the "latest" one
};

export const uploadFileToClientFolder = async (clientId: string, folderType: string, file: File) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a mock response
  return {
    id: `new-${Date.now()}`,
    name: file.name,
    size: file.size,
    modifiedTime: new Date().toISOString(),
    webViewLink: "#"
  };
};
