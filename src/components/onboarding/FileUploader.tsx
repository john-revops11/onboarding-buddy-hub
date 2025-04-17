import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onUploadComplete: (file: File) => void;
  uploadProgress?: number;
  uploading?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  acceptedFileTypes?: string;
  helpText?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  uploadProgress,
  uploading,
  onUpload,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  helpText,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [internalUploading, setInternalUploading] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);

  const isUploading = uploading ?? internalUploading;
  const progress = uploadProgress ?? internalProgress;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    if (onUpload) {
      await onUpload(files);
    } else {
      setInternalUploading(true);
      const interval = setInterval(() => {
        setInternalProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 400);

      try {
        onUploadComplete(files[0]);
        setTimeout(() => {
          clearInterval(interval);
          setInternalUploading(false);
          setInternalProgress(0);
          setFiles([]);
        }, 1000);
      } catch (error) {
        clearInterval(interval);
        setInternalUploading(false);
        setInternalProgress(0);
      }
    }
  };

  return (
    <div className="space-y-4">
      {isUploading ? (
        <>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-center">{Math.round(progress)}% complete</p>
        </>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50"
          onClick={() => document.getElementById("client-file-upload")?.click()}
        >
          <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          {files.length ? (
            <>
              <p className="font-medium mb-1">{files.length} file(s) selected</p>
              <ul className="text-sm text-muted-foreground mb-3">
                {files.map((file, idx) => (
                  <li key={idx}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-medium mb-1">Drag and drop or click to browse</p>
              {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
            </>
          )}
          <input
            id="client-file-upload"
            type="file"
            multiple
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <Button className="mt-3" onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
