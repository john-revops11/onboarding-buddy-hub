
import React, { useRef, useState } from "react";

interface FileDropZoneProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  setUploadError: (error: string | null) => void;
  uploadError: string | null;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  selectedFile,
  setSelectedFile,
  setUploadError,
  uploadError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      }
    }
  };

  return (
    <>
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
    </>
  );
};
