// hooks/useInsights.ts
import { useEffect, useState } from "react";
import { listLatestInsightFiles } from "@/utils/google-drive";

export const useInsights = (folderId: string) => {
  const [latestFile, setLatestFile] = useState<any>(null);
  const [historicalFiles, setHistoricalFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await listLatestInsightFiles(folderId);
        if (files.length === 0) {
          setError("No insights available.");
          return;
        }

        setLatestFile(files[0]);
        setHistoricalFiles(files.slice(1));
      } catch (e) {
        setError("Failed to fetch insights.");
        console.error(e);
      }
    };

    fetchFiles();
  }, [folderId]);

  return {
    latestFile,
    historicalFiles,
    error,
  };
};
