// utils/google-drive.ts
export async function listLatestInsightFiles(folderId: string): Promise<any[]> {
  // Assuming you're calling a backend or Supabase function that proxies to Google API
  const response = await fetch(`/api/drive/insights?folderId=${folderId}`);
  if (!response.ok) throw new Error("Failed to fetch from Drive API");
  const data = await response.json();
  return data.files;
}
