
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Icons } from "@/components/icons";

interface ConfigStatusProps {
  isCheckingSecret: boolean;
  secretConfigStatus: {
    configured: boolean;
    message: string;
    serviceAccount?: string;
    isNetworkError?: boolean;
  } | null;
  onRetryCheck: () => void;
}

export const ConfigurationStatus: React.FC<ConfigStatusProps> = ({
  isCheckingSecret,
  secretConfigStatus,
  onRetryCheck,
}) => {
  if (isCheckingSecret) {
    return (
      <div className="flex items-center justify-center p-4">
        <Icons.spinner className="h-6 w-6 animate-spin mr-2" />
        <span>Checking configuration...</span>
      </div>
    );
  }

  if (secretConfigStatus?.configured) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Service account key is already configured</AlertTitle>
        <AlertDescription className="text-green-700">
          The Google Drive integration is already set up with service account: 
          <code className="ml-1 p-1 bg-green-100 text-xs rounded font-mono">
            {secretConfigStatus.serviceAccount}
          </code>
        </AlertDescription>
      </Alert>
    );
  }

  if (secretConfigStatus?.isNetworkError) {
    return (
      <Alert className="bg-orange-50 border-orange-200">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">Network Connection Issue</AlertTitle>
        <AlertDescription className="space-y-2 text-orange-700">
          <p>
            Unable to connect to the Supabase Edge Function to verify the integration status.
            This is likely due to a network issue or because the Edge Function is not deployed.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetryCheck}
            className="mt-2"
          >
            Retry Check
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (secretConfigStatus && !secretConfigStatus.configured) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200 mb-4">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Configuration Status</AlertTitle>
        <AlertDescription className="text-yellow-700">
          {secretConfigStatus.message}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
