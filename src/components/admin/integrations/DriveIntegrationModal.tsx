
import React, { useState, useRef, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDriveIntegration } from "@/hooks/useDriveIntegration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info } from "lucide-react"; 

interface DriveIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DriveIntegrationModal({ 
  open, 
  onOpenChange,
  onSuccess
}: DriveIntegrationModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [secretConfigStatus, setSecretConfigStatus] = useState<{ 
    configured: boolean; 
    message: string;
    serviceAccount?: string;
    isNetworkError?: boolean;
  } | null>(null);
  const [isCheckingSecret, setIsCheckingSecret] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadKey, revoke, checkSecretConfiguration } = useDriveIntegration();
  const { toast } = useToast();

  // Check secret configuration when modal opens
  useEffect(() => {
    if (open) {
      checkSecretConfig();
    }
  }, [open]);

  const checkSecretConfig = async () => {
    setIsCheckingSecret(true);
    try {
      const status = await checkSecretConfiguration();
      setSecretConfigStatus(status);
    } catch (error) {
      console.error("Error checking secret configuration:", error);
      setSecretConfigStatus({
        configured: false,
        message: `Error checking configuration: ${error.message}`,
        isNetworkError: error.message?.includes('Failed to fetch') || error.message?.includes('network')
      });
    } finally {
      setIsCheckingSecret(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/json") {
        setSelectedFile(file);
      } else {
        setUploadError("Invalid file type. Please upload a JSON file.");
        toast({
          title: "Invalid file type",
          description: "Please upload a JSON file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/json") {
        setSelectedFile(file);
      } else {
        setUploadError("Invalid file type. Please upload a JSON file.");
        toast({
          title: "Invalid file type",
          description: "Please upload a JSON file.",
          variant: "destructive",
        });
      }
    }
  };

  const validateServiceAccountJson = async (jsonContent: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonContent);
      // Check if it's a service account key
      if (parsed.type !== "service_account") {
        setUploadError("Invalid service account key. The JSON file must be a Google service account key with type 'service_account'.");
        toast({
          title: "Invalid service account key",
          description: "The JSON file must be a Google service account key with type 'service_account'.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check for required fields
      if (!parsed.client_email || !parsed.private_key) {
        setUploadError("Invalid service account key. The service account key is missing required fields.");
        toast({
          title: "Invalid service account key",
          description: "The service account key is missing required fields.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("JSON parsing error:", error);
      setUploadError(`Invalid JSON: ${error.message}`);
      toast({
        title: "Invalid JSON",
        description: "The file contains invalid JSON.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      console.log("Reading file content...");
      const fileContent = await selectedFile.text();
      
      console.log("Validating service account JSON...");
      // Validate the JSON file
      const isValid = await validateServiceAccountJson(fileContent);
      if (!isValid) {
        setIsUploading(false);
        return;
      }
      
      console.log("Converting to base64...");
      // Convert to base64
      const b64Content = btoa(fileContent);
      
      console.log("Uploading to Supabase...");
      // Upload to Supabase
      const response = await uploadKey(b64Content);
      
      console.log("Upload response:", response);
      
      if (response.error) {
        // Check if it's a network error
        if (response.error.isNetworkError) {
          throw new Error("Network error: Unable to connect to the server. Please check your internet connection and try again.");
        }
        throw new Error(response.error.message || "Unknown error occurred");
      }

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unknown error occurred");
      }
      
      toast({
        title: "Integration successful",
        description: "Google Drive service account has been set up successfully.",
        variant: "success",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(`Upload failed: ${error.message}`);
      toast({
        title: "Upload failed",
        description: `There was an error uploading the service account key: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRevoke = async () => {
    try {
      const response = await revoke();
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast({
        title: "Integration revoked",
        description: "Google Drive integration has been successfully revoked.",
        variant: "success",
      });
      
      onSuccess();
      setShowRevokeConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Revoke error:", error);
      toast({
        title: "Revoke failed",
        description: "There was an error revoking the integration.",
        variant: "destructive",
      });
    }
  };

  const handleRetryCheck = () => {
    checkSecretConfig();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Google Drive Integration</DialogTitle>
            <DialogDescription>
              Upload your Google Service Account JSON credentials or revoke the existing integration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isCheckingSecret ? (
              <div className="flex items-center justify-center p-4">
                <Icons.spinner className="h-6 w-6 animate-spin mr-2" />
                <span>Checking configuration...</span>
              </div>
            ) : secretConfigStatus?.configured ? (
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
            ) : secretConfigStatus?.isNetworkError ? (
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
                    onClick={handleRetryCheck}
                    className="mt-2"
                  >
                    Retry Check
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {secretConfigStatus && !secretConfigStatus.configured && (
                  <Alert className="bg-yellow-50 border-yellow-200 mb-4">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Configuration Status</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      {secretConfigStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium">
                        Drag and drop your service account JSON file here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse
                      </p>
                    </div>
                  )}
                </div>
              
                {uploadError && (
                  <div className="text-sm text-red-500 mt-2">
                    {uploadError}
                  </div>
                )}
                
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
              </>
            )}
          </div>
          
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => setShowRevokeConfirm(true)}
            >
              Revoke Integration
            </Button>
            {!secretConfigStatus?.configured && !secretConfigStatus?.isNetworkError && (
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showRevokeConfirm} onOpenChange={setShowRevokeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will revoke the Google Drive integration. All connected functionality will stop working until a new service account key is uploaded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} className="bg-red-600 hover:bg-red-700">
              Yes, revoke integration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
