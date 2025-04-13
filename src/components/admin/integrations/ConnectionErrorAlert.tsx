
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionErrorAlertProps {
  onRetry: () => void;
  error?: string;
}

export const ConnectionErrorAlert: React.FC<ConnectionErrorAlertProps> = ({ onRetry, error }) => {
  return (
    <Alert className="bg-orange-50 border-orange-200">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Connection Issue</AlertTitle>
      <AlertDescription className="space-y-2 text-orange-700">
        <p>
          {error || "Unable to connect to the Supabase Edge Function to verify integration status. This may be due to one of these reasons:"}
        </p>
        
        {!error && (
          <ul className="list-disc pl-5 text-sm mt-2">
            <li>The Edge Function is still deploying (first deployment can take up to 1-2 minutes)</li>
            <li>There's a temporary network connectivity issue</li>
            <li>The Edge Function encountered an internal error</li>
          </ul>
        )}
        
        <div className="flex gap-3 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Retry Connection
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
