
// Simple mock implementation for client file operations without Google Drive integration

export const getClientFiles = async (clientId: string, folderType: string) => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // Generate several months of documents
  const files = [];
  
  // Current month document
  files.push({
    id: "file-current",
    name: `${currentYear}-${String(currentMonth).padStart(2, '0')}-insight.pdf`,
    size: "1.4 MB",
    modifiedTime: currentDate.toISOString(),
    status: "processed",
    type: folderType === "insights" ? "monthly" : folderType,
    webViewLink: "#",
    embedLink: "#"
  });
  
  // Previous months (generate up to 12 previous months)
  for (let i = 1; i <= 12; i++) {
    let month = currentMonth - i;
    let year = currentYear;
    
    // Handle previous year crossover
    if (month <= 0) {
      month += 12;
      year -= 1;
    }
    
    files.push({
      id: `file-${year}-${month}`,
      name: `${year}-${String(month).padStart(2, '0')}-insight.pdf`,
      size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      modifiedTime: new Date(year, month - 1, 15).toISOString(),
      status: "processed",
      type: i % 3 === 0 ? "quarterly" : "monthly",
      webViewLink: "#",
      embedLink: "#"
    });
  }
  
  return files;
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
    webViewLink: "#",
    embedLink: "#"
  };
};
