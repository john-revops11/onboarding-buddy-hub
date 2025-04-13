
import React, { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadKey, revoke } = useDriveIntegration();
  const { toast } = useToast();

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
      const fileContent = await selectedFile.text();
      
      // Validate the JSON file
      const isValid = await validateServiceAccountJson(fileContent);
      if (!isValid) {
        setIsUploading(false);
        return;
      }
      
      // Convert to base64
      const b64Content = btoa(fileContent);
      
      // Upload to Supabase
      const response = await uploadKey(b64Content);
      
      if (response.error) {
        throw new Error(response.error.message);
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
          </div>
          
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => setShowRevokeConfirm(true)}
            >
              Revoke Integration
            </Button>
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
