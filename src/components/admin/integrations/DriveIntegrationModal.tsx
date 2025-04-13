
import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useDriveIntegration } from "@/hooks/useDriveIntegration";

// Import new component files
import { ConfigurationStatus } from "./drive/ConfigurationStatus";
import { FileDropZone } from "./drive/FileDropZone";
import { ServiceAccountInstructions } from "./drive/ServiceAccountInstructions";
import { RevokeConfirmDialog } from "./drive/RevokeConfirmDialog";

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
            <ConfigurationStatus 
              isCheckingSecret={isCheckingSecret}
              secretConfigStatus={secretConfigStatus}
              onRetryCheck={checkSecretConfig}
            />

            {!secretConfigStatus?.configured && !secretConfigStatus?.isNetworkError && (
              <>
                <FileDropZone 
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  uploadError={uploadError}
                  setUploadError={setUploadError}
                />
                
                <ServiceAccountInstructions />
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
      
      <RevokeConfirmDialog 
        open={showRevokeConfirm} 
        onOpenChange={setShowRevokeConfirm}
        onRevoke={handleRevoke} 
      />
    </>
  );
}
