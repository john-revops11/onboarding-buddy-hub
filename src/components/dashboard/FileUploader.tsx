
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DOCUMENT_CATEGORIES, DocumentCategory } from "@/types/onboarding";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FileUploaderProps {
  onUploadComplete: (file: any) => void;
  onVerificationStatusChange: (fileId: string, status: 'pending' | 'verified' | 'rejected') => void;
}

export const FileUploader = ({
  onUploadComplete,
  onVerificationStatusChange,
}: FileUploaderProps) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("general");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as DocumentCategory);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      setUploading(true);
      
      // Simulate progress for UX
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      try {
        // Call the onUploadComplete prop
        onUploadComplete({
          name: files[0].name,
          size: files[0].size,
          type: files[0].type,
          category: selectedCategory
        });
        
        // Reset after successful upload
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
    }
  };

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="space-y-2">
        <Label htmlFor="document-category">Document Category</Label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger id="document-category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DOCUMENT_CATEGORIES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File upload area */}
      {uploading ? (
        <div className="space-y-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-center">{uploadProgress}% complete</p>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            files.length > 0 ? "border-primary bg-primary/5" : "hover:bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
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
            <p className="font-medium mb-1">Drag and drop files here or click to browse</p>
          )}
          
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
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
