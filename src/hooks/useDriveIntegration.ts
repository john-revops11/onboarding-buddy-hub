
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDriveIntegration() {
  const { toast } = useToast();
  
  const invoke = async (action: string, payload: any = {}) => {
    try {
      const response = await supabase.functions.invoke("drive-admin", { body: { action, payload } });
      return response;
    } catch (error) {
      console.error(`Error invoking Drive function ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to execute ${action} operation. Please try again.`,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    ping: () => invoke("ping"),
    usage: () => invoke("usage"),           // returns bytes_used
    audit: () => invoke("audit", { limit: 20 }),
    uploadKey: (b64: string) => invoke("setSecret", { secret: b64 }),
    revoke: () => invoke("revoke")
  };
}
