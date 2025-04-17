import { useEffect, useState } from "react";
import { listLatestInsightFiles } from "@/utils/google-drive";

export const useInsights = (folderId: string = "DEFAULT_INSIGHTS_FOLDER_ID") => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true);
        const files = await listLatestInsightFiles(folderId);
        setData(files);
      } catch (e) {
        console.error("Failed to fetch insights:", e);
        setError("Failed to fetch insights.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  return {
    data,
    isLoading,
    error,
  };
};
