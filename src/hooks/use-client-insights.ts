
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Insight } from "./use-insights";

export const useClientInsights = () => {
  return useQuery({
    queryKey: ["client-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .order("modifiedTime", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Export this to fix the missing useInsights import in OpportunitiesPage
export { useInsights } from "./use-insights";
