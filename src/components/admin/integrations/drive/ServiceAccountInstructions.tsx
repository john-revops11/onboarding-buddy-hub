
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const ServiceAccountInstructions: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">How to set up a Google Drive service account</AlertTitle>
      <AlertDescription className="text-blue-700 space-y-2 mt-2">
        <div>
          <p className="font-semibold">Step 1: Create a Google Cloud Project</p>
          <ol className="list-decimal pl-5 text-xs mt-1">
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>Create a new project or select an existing one</li>
          </ol>
        </div>
        
        <div>
          <p className="font-semibold">Step 2: Enable the Google Drive API</p>
          <ol className="list-decimal pl-5 text-xs mt-1">
            <li>In your project, go to "APIs & Services" &gt; "Library"</li>
            <li>Search for "Google Drive API" and enable it</li>
          </ol>
        </div>
        
        <div>
          <p className="font-semibold">Step 3: Create a service account</p>
          <ol className="list-decimal pl-5 text-xs mt-1">
            <li>Go to "APIs & Services" &gt; "Credentials"</li> 
            <li>Click "Create credentials" &gt; "Service account"</li>
            <li>Fill in the details and click "Create"</li>
            <li>Under "Role", select at least "Drive Admin" or "Content Manager"</li>
            <li>Click "Done"</li>
          </ol>
        </div>
        
        <div>
          <p className="font-semibold">Step 4: Create a key for the service account</p>
          <ol className="list-decimal pl-5 text-xs mt-1">
            <li>Find your service account in the list and click on it</li>
            <li>Go to the "Keys" tab</li>
            <li>Click "Add Key" &gt; "Create new key"</li>
            <li>Select "JSON" and click "Create"</li>
            <li>The key file will be downloaded to your computer</li>
            <li>Upload this JSON file here</li>
          </ol>
        </div>
      </AlertDescription>
    </Alert>
  );
};
