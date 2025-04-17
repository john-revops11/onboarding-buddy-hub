import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { uploadFile, getClientFiles } from "@/lib/client-management/file-upload";
import { FileUpload } from "@/lib/types/client-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { UploadIcon } from "@/components/ui/UploadIcon";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface FileUploaderProps {
  onUploadComplete?: (file: FileUpload) => void;
  onVerificationStatusChange?: (fileId: string, status: 'pending' | 'verified' | 'rejected') => void;
  acceptedFileTypes?: string;
  helpText?: string;
}

export function FileUploaderAdmin({
  onUploadComplete,
  onVerificationStatusChange,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  helpText = "Upload your documents here. We accept PDF, Word, and image files."
}: FileUploaderProps) {
  const { state } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clientId = state.user?.id || '';

  const categoryOptions = [
    { value: 'general', label: 'General Document' },
    { value: 'id_verification', label: 'ID Verification' },
    { value: 'address_proof', label: 'Address Proof' },
    { value: 'business_certificate', label: 'Business Certificate' },
    { value: 'tax_document', label: 'Tax Document' },
    { value: 'contract_agreement', label: 'Contract Agreement' }
  ];

  React.useEffect(() => {
    if (clientId) {
      fetchUserFiles();
    }
  }, [clientId]);

  const fetchUserFiles = async () => {
    try {
      if (!clientId) return;

      const userFiles = await getClientFiles(clientId);
      setFiles(userFiles as unknown as FileUpload[]);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        await handleFileUpload(droppedFiles[0]);
      }
    },
    [selectedCategory, clientId]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        await handleFileUpload(selectedFiles[0]);
      }
    },
    [selectedCategory, clientId]
  );

  const handleFileUpload = async (file: File) => {
    if (!clientId) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUploadProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      const result = await uploadFile(clientId, file, selectedCategory);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast({
          title: "Success",
          description: "File uploaded successfully!",
        });

        await fetchUserFiles();

        if (onUploadComplete) {
          const fileId = result.fileId || result.data?.id || '';
          onUploadComplete({
            id: fileId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            category: selectedCategory,
            status: 'pending',
            uploadedAt: new Date().toISOString(),
            url: URL.createObjectURL(file),
            clientId: clientId,
          } as FileUpload);
        }
      } else {
        throw new Error(result.error || "Failed to upload file");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStatusChange = async (fileId: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    if (onVerificationStatusChange) {
      onVerificationStatusChange(fileId, newStatus);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Document Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={loading}
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <UploadIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Drag and drop your files here</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {helpText}
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Select File
              </>
            )}
          </Button>
        </div>
        
        {loading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2 w-full" />
            <p className="text-xs text-center mt-1 text-muted-foreground">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>
          <div className="space-y-3">
            {files.map(file => (
              <Card key={file.id} className="overflow-hidden">
                <div className="flex items-center p-3">
                  <div className="bg-primary/10 p-2 rounded mr-3">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.fileName}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="truncate">
                        {(file.fileSize / 1024).toFixed(1)} KB • 
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      file.status === 'verified'
                        ? 'default'
                        : file.status === 'rejected'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="ml-2 capitalize"
                  >
                    {file.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {file.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                    {file.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {file.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
