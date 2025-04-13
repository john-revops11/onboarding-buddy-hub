import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDriveIntegration() {
  const { toast } = useToast();
  
  const invoke = async (action: string, payload: any = {}) => {
    try {
      console.log(`Invoking Drive function ${action} with payload:`, payload);
      
      const response = await supabase.functions.invoke("drive-admin", { 
        body: { action, payload },
        // Add a timeout for requests
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      console.log(`Response from ${action}:`, response);
      
      if (response.error) {
        console.error(`Error in ${action} response:`, response.error);
        throw new Error(response.error.message || `Error in ${action} operation`);
      }
      
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

  const checkSecretConfiguration = async () => {
    try {
      console.log("Checking secret configuration status");
      const response = await supabase.functions.invoke("drive-admin", {
        body: { action: 'checkSecretConfiguration' },
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      console.log("Secret configuration check response:", response);
      
      if (response.error) {
        throw new Error(response.error.message || "Error checking secret configuration");
      }
      
      return response.data || { configured: false, message: "Unknown status" };
    } catch (error) {
      console.error("Error checking secret configuration:", error);
      toast({
        title: "Configuration Check Failed",
        description: "Unable to verify the Drive service account configuration.",
        variant: "destructive",
      });
      return { configured: false, message: error.message };
    }
  };

  const triggerSharedDriveCreation = async () => {
    try {
      console.log("Triggering shared drive creation");
      const response = await supabase.functions.invoke("create-shared-drive", {
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      console.log("Shared drive creation response:", response);
      
      if (response.error) {
        throw new Error(response.error.message || "Error creating shared drive");
      }
      
      return response;
    } catch (error) {
      console.error("Error triggering shared drive creation:", error);
      toast({
        title: "Error",
        description: "Failed to create shared drives. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    ping: () => invoke("ping"),
    usage: () => invoke("usage"),
    audit: () => invoke("audit", { limit: 20 }),
    uploadKey: (b64: string) => invoke("setSecret", { secret: b64 }),
    revoke: () => invoke("revoke"),
    checkServiceAccountPermission: (driveId: string) => 
      invoke("checkServiceAccountPermission", { driveId }),
    fixPermission: (driveId: string) => 
      invoke("fixPermission", { driveId }),
    backfillPermissions: () => invoke("backfillPermissions"),
    triggerSharedDriveCreation,
    checkSecretConfiguration
  };
}
