
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const ServiceAccountInstructions: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">How to get a service account key</AlertTitle>
      <AlertDescription className="text-blue-700 text-xs">
        1. Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a><br />
        2. Create or select a project<br />
        3. Go to "APIs & Services" &gt; "Credentials"<br />
        4. Click "Create credentials" &gt; "Service account"<br />
        5. Fill in the details and grant access (at least Drive API access)<br />
        6. Create a key (JSON type) for the service account<br />
        7. Upload the downloaded JSON file here
      </AlertDescription>
    </Alert>
  );
};
