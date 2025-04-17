// src/hooks/use-analytics-dashboards.ts
import { useEffect, useState } from "react";
import { getDashboardsByTier } from "@/lib/dashboard-management";

export const useAnalyticsDashboards = (tier: string, clientId: string) => {
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const result = await getDashboardsByTier(tier, clientId);
        setDashboards(result);
      } catch (err) {
        setError("Failed to load dashboards.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, [tier, clientId]);

  return { dashboards, error, loading };
};
