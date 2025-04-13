
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionErrorAlertProps {
  onRetry: () => void;
}

export const ConnectionErrorAlert: React.FC<ConnectionErrorAlertProps> = ({ onRetry }) => {
  return (
    <Alert className="bg-orange-50 border-orange-200">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Connection Issue</AlertTitle>
      <AlertDescription className="space-y-2 text-orange-700">
        <p>
          Unable to connect to the Supabase Edge Function to verify integration status.
          This may be because the Edge Function is not deployed or there's a network issue.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          Retry Connection
        </Button>
      </AlertDescription>
    </Alert>
  );
};
