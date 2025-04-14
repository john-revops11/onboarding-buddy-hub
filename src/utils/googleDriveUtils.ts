
// Simple mock implementation for client file operations without Google Drive integration

export const getClientFiles = async (clientId: string, folderType: string) => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
  // Mock upload delay
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
