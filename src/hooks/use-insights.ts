
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Insight {
  id: string;
  name: string;
  drive_url: string;
  embed_url: string;
  download_url: string;
  is_current: boolean;
  modifiedTime: string;
  created_at: string;
  updated_at: string;
}

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .order("modifiedTime", { ascending: false });

      if (error) throw error;
      return data as Insight[];
    },
  });
}
