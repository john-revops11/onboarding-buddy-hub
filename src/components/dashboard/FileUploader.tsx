
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  uploading: boolean;
  uploadProgress: number;
  onUpload: (files: File[]) => void;
  acceptedFileTypes?: string;
  helpText?: string;
}

export const FileUploader = ({
  uploading,
  uploadProgress,
  onUpload,
  acceptedFileTypes = "",
  helpText = "Drag and drop files here or click to browse",
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  }, [onUpload]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  }, [onUpload]);
  
  const handleButtonClick = () => {
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };
  
  return (
    <div>
      {uploading ? (
        <div className="space-y-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-center">{uploadProgress}% complete</p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium mb-1">{helpText}</p>
          <Button size="sm" onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}>
            Select Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptedFileTypes}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};
