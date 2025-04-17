import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onUploadComplete: (file: File) => void;
  onVerificationStatusChange?: (fileId: string, status: 'pending' | 'verified' | 'rejected') => void;
  uploading?: boolean;
  uploadProgress?: number;
  onUpload?: (files: File[]) => Promise<void>;
  acceptedFileTypes?: string;
  helpText?: string;
}

export const FileUploader = ({
  onUploadComplete,
  uploading: externalUploading,
  uploadProgress: externalProgress,
  onUpload,
  acceptedFileTypes,
  helpText,
}: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const isUploading = externalUploading ?? uploading;
  const progress = externalProgress ?? uploadProgress;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    if (onUpload) {
      await onUpload(files);
      return;
    }

    setUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 300);

    try {
      onUploadComplete(files[0]); // Only upload first file
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setFiles([]);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {isUploading ? (
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-center">{progress}% complete</p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            files.length > 0 ? "border-primary bg-primary/5" : "hover:bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          {files.length > 0 ? (
            <div>
              <p className="font-medium mb-1">{files.length} file(s) selected</p>
              <ul className="text-sm text-muted-foreground mb-3">
                {files.map((file, index) => (
                  <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="font-medium mb-1">Drag and drop files here or click to browse</p>
              {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
            </>
          )}

          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />

          {files.length > 0 && (
            <Button 
              className="mt-2" 
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
