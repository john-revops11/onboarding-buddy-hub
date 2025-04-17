// utils/google-drive.ts
export const listLatestInsightFiles = async (folderId: string) => {
  const response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
    orderBy: 'modifiedTime desc',
    fields: 'files(id, name, modifiedTime, webViewLink, webContentLink)',
    pageSize: 20,
  });

  return response.result.files || [];
};
