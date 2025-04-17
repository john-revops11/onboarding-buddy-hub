// hooks/useInsights.ts
import { useEffect, useState } from "react";
import { listLatestInsightFiles } from "@/utils/google-drive";
import { InsightFile } from "@/types/insights";

export const useInsights = (folderId: string) => {
  const [latestFile, setLatestFile] = useState<InsightFile | null>(null);
  const [historicalFiles, setHistoricalFiles] = useState<InsightFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await listLatestInsightFiles(folderId);

        if (!files || files.length === 0) {
          setError("No insights available.");
          setLoading(false);
          return;
        }

        const sorted = files.sort((a: any, b: any) => {
          const dateA = new Date(a.modifiedTime || a.createdTime).getTime();
          const dateB = new Date(b.modifiedTime || b.createdTime).getTime();
          return dateB - dateA;
        });

        const mapped: InsightFile[] = sorted.map((f: any) => ({
          id: f.id,
          name: f.name,
          embedUrl: `https://docs.google.com/document/d/${f.id}/preview`,
          driveUrl: f.webViewLink,
          downloadUrl: f.webContentLink,
          modifiedTime: f.modifiedTime || f.createdTime,
        }));

        setLatestFile(mapped[0]);
        setHistoricalFiles(mapped.slice(1));
      } catch (e) {
        console.error("Failed to fetch insights:", e);
        setError("Failed to fetch insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  return {
    latestFile,
    historicalFiles,
    loading,
    error,
  };
};
