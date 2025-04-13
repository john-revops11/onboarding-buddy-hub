
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDriveIntegration() {
  const { toast } = useToast();
  
  const invoke = async (action: string, payload: any = {}) => {
    try {
      console.log(`Invoking Drive function ${action} with payload:`, payload);
      
      let attempts = 0;
      const maxAttempts = 3;
      let response;
      
      while (attempts < maxAttempts) {
        try {
          response = await supabase.functions.invoke("drive-admin", { 
            body: { action, payload },
            headers: {
              'Cache-Control': 'no-cache',
            }
          });
          
          if (response.error) {
            console.error(`Error in ${action} response:`, response.error);
            throw new Error(response.error.message || `Error in ${action} operation`);
          }
          
          console.log(`Response from ${action}:`, response);
          break;
        } catch (error) {
          attempts++;
          console.error(`Attempt ${attempts} failed:`, error);
          
          if (attempts >= maxAttempts) {
            throw error;
          }
          
          // Exponential backoff with jitter
          const delay = Math.min(1000 * Math.pow(2, attempts) + Math.random() * 1000, 10000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      return response;
    } catch (error) {
      console.error(`Error invoking Drive function ${action}:`, error);
      
      const errorMessage = error.message || `Failed to execute ${action} operation. Please try again.`;
      const isProbablyNetworkError = errorMessage.includes('Failed to fetch') || 
                                    errorMessage.includes('Failed to send a request') ||
                                    errorMessage.includes('network') ||
                                    errorMessage.includes('Network');
      
      if (!errorMessage.includes('silent')) {
        toast({
          title: "Error",
          description: isProbablyNetworkError 
            ? "Network error: Unable to connect to the server. Please check your connection and try again."
            : `Failed to execute ${action} operation: ${errorMessage}`,
          variant: "destructive",
        });
      }
      
      return {
        data: null,
        error: {
          message: errorMessage,
          isNetworkError: isProbablyNetworkError,
        }
      };
    }
  };

  const checkSecretConfiguration = async () => {
    try {
      console.log("Checking secret configuration status");
      
      // In development/demo environments, provide mock data for testing
      if (window.location.hostname.includes('localhost') || 
          window.location.hostname.includes('lovableproject.com')) {
        
        try {
          const response = await supabase.functions.invoke("drive-admin", {
            body: { action: 'checkSecretConfiguration' },
            headers: {
              'Cache-Control': 'no-cache',
            }
          });
          
          console.log("Secret configuration check response:", response);
          
          if (response.error) {
            console.warn("Using mock data due to edge function error:", response.error);
            return { 
              configured: true, 
              message: "Mock configuration for development",
              serviceAccount: "mock-service-account@example.com",
              isDevelopment: true
            };
          }
          
          // Add isDevelopment flag to actual response as well
          return { 
            ...response.data, 
            isDevelopment: true 
          } || { 
            configured: false, 
            message: "Unknown status", 
            isDevelopment: true 
          };
        } catch (error) {
          console.warn("Using mock data due to edge function error:", error);
          return { 
            configured: true, 
            message: "Mock configuration for development",
            serviceAccount: "mock-service-account@example.com",
            isDevelopment: true
          };
        }
      }
      
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
      
      const errorMessage = error.message || "Unable to verify the Drive service account configuration.";
      const isProbablyNetworkError = errorMessage.includes('Failed to fetch') || 
                                    errorMessage.includes('Failed to send a request') ||
                                    errorMessage.includes('network') ||
                                    errorMessage.includes('Network');
      
      toast({
        title: "Configuration Check Failed",
        description: isProbablyNetworkError 
          ? "Network error: Unable to verify the Google Drive service account configuration. Please check your connection."
          : "Unable to verify the Drive service account configuration.",
        variant: "destructive",
      });
      
      return { 
        configured: false, 
        message: isProbablyNetworkError 
          ? "Network error: Unable to connect to the server" 
          : errorMessage,
        isNetworkError: isProbablyNetworkError
      };
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
      
      toast({
        title: "Success",
        description: response.data?.results && response.data.results.length > 0
          ? `Created ${response.data.results.filter(r => r.success).length} shared drives successfully.`
          : "Shared drive creation process completed.",
        variant: "success",
      });
      
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
    audit: (limit = 20) => invoke("audit", { limit }),
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
