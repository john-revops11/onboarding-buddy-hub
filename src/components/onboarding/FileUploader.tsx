
import React, { useState } from "react";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, getUserFiles } from "@/utils/fileUtils";
import { UploadedFile } from "@/types/onboarding";
import { useAuth } from "@/contexts/auth-context";

interface FileUploaderProps {
  onUploadComplete?: (file: UploadedFile) => void;
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const { toast } = useToast();
  const { state } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const userId = state.user?.id || "demo-user";
  
  // Load existing files on component mount
  React.useEffect(() => {
    const userFiles = getUserFiles(userId);
    setFiles(userFiles);
  }, [userId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      // Upload the file
      const uploadedFile = await uploadFile(file, userId);
      
      // Update local state
      setFiles(prev => [...prev, uploadedFile]);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-medium">Click to upload or drag and drop</h3>
          <p className="text-sm text-muted-foreground">
            PDF, DOCX, PNG, JPG up to 10MB
          </p>
          {isUploading && (
            <div className="flex items-center mt-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Uploading...</span>
            </div>
          )}
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-md bg-background"
              >
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
