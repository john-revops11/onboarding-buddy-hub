import React, { useState, useEffect } from "react";
import { UploadCloud, File, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  uploadFile, 
  getUserFiles, 
  deleteFile,
  checkRequiredDocuments
} from "@/utils/fileUtils";
import { DocumentCategory, DOCUMENT_CATEGORIES, REQUIRED_DOCUMENTS } from "@/types/onboarding";
import { useAuth } from "@/hooks/use-auth";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface FileUploaderProps {
  onUploadComplete?: (file: any) => void;
  onVerificationStatusChange?: (fileId: string, status: 'pending' | 'verified' | 'rejected') => void;
  categories?: DocumentCategory[];
  // Add these props to match the DataUploadsPage interface
  uploading?: boolean;
  uploadProgress?: number;
  onUpload?: (files: File[]) => Promise<void>;
  acceptedFileTypes?: string;
  helpText?: string;
}

export function FileUploader({ 
  onUploadComplete, 
  onVerificationStatusChange,
  categories = Object.keys(DOCUMENT_CATEGORIES) as DocumentCategory[],
  uploading: externalUploading,
  uploadProgress: externalProgress,
  onUpload,
  acceptedFileTypes,
  helpText
}: FileUploaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("general");
  const [internalUploadProgress, setInternalUploadProgress] = useState(0);
  
  const userId = user?.id || "demo-user";
  
  // Use either external or internal state for uploading status
  const uploading = externalUploading !== undefined ? externalUploading : isUploading;
  const uploadProgress = externalProgress !== undefined ? externalProgress : internalUploadProgress;
  
  // Load existing files on component mount
  useEffect(() => {
    loadUserFiles();
  }, [userId]);
  
  // Check document verification status when files change
  useEffect(() => {
    const verificationStatus = checkRequiredDocuments(userId, REQUIRED_DOCUMENTS);
    if (onVerificationStatusChange) {
      onVerificationStatusChange(verificationStatus);
    }
  }, [files, userId, onVerificationStatusChange]);

  const loadUserFiles = () => {
    const userFiles = getUserFiles(userId);
    setFiles(userFiles);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const fileArray = Array.from(e.target.files);
    
    // If external upload handler is provided, use it
    if (onUpload) {
      await onUpload(fileArray);
      return;
    }
    
    const file = fileArray[0];
    setIsUploading(true);
    
    try {
      // Upload the file with category
      const uploadedFile = await uploadFile(userId, file, selectedCategory);
      
      // Update local state
      if (uploadedFile) {
        setFiles(prev => [...prev, uploadedFile]);
      
        // Notify parent component
        if (onUploadComplete) {
          onUploadComplete(uploadedFile);
        }
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded as ${DOCUMENT_CATEGORIES[selectedCategory]} and is pending verification.`,
        });
      } else {
        throw new Error("Failed to upload file");
      }
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

  const handleDeleteFile = (fileId: string) => {
    const success = deleteFile(fileId);
    if (success) {
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast({
        title: "File deleted",
        description: "The file has been successfully removed.",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-[#68b046]" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-[#68b046]">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  // Calculate upload progress
  const verificationStatus = checkRequiredDocuments(userId, REQUIRED_DOCUMENTS);
  const uploadedCount = verificationStatus.uploaded ? verificationStatus.uploaded.length : 0;
  const calculatedProgress = Math.round(
    (uploadedCount / REQUIRED_DOCUMENTS.length) * 100
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Document Type</label>
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as DocumentCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {DOCUMENT_CATEGORIES[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Button 
            disabled={uploading} 
            className="w-full md:w-auto bg-[#68b046] hover:bg-[#72c90a]"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Required Documents Status */}
      {REQUIRED_DOCUMENTS.length > 0 && (
        <div className="border rounded-lg p-4 bg-background">
          <h4 className="font-medium mb-2">Required Documents</h4>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <div className="space-y-2">
            {REQUIRED_DOCUMENTS.map((category) => {
              const isUploaded = !verificationStatus.missing || !verificationStatus.missing.includes(category);
              const isVerified = false; // Define how to check if verified
              const isRejected = false; // Define how to check if rejected
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isVerified ? (
                      <CheckCircle className="h-4 w-4 text-[#68b046]" />
                    ) : (
                      <div className={`h-2 w-2 rounded-full ${
                        isRejected ? 'bg-red-500' : 
                        isUploaded ? 'bg-yellow-400' : 'bg-gray-300'
                      }`} />
                    )}
                    <span>{DOCUMENT_CATEGORIES[category as DocumentCategory]}</span>
                  </div>
                  <div>
                    {isRejected && <Badge variant="destructive">Rejected</Badge>}
                    {isUploaded && !isVerified && !isRejected && 
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>}
                    {isVerified && <Badge className="bg-[#68b046]">Verified</Badge>}
                    {!isUploaded && <Badge variant="outline">Required</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-3 border rounded-md bg-background ${
                  file.status === 'rejected' ? 'border-red-200 bg-red-50' : 
                  file.status === 'verified' ? 'border-green-200 bg-green-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {file.name}
                      {getStatusIcon(file.status)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                      {file.category && (
                        <Badge variant="outline" className="text-xs">
                          {DOCUMENT_CATEGORIES[file.category as DocumentCategory] || file.category}
                        </Badge>
                      )}
                      {getStatusBadge(file.status)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
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
