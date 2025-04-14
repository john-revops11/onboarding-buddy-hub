
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSearch, BarChart2, Loader2 } from "lucide-react";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { motion } from "framer-motion";
import { DataHealthCheck } from "@/components/dashboard/DataHealthCheck";
import { uploadFileToClientFolder } from "@/utils/googleDriveUtils";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  modifiedTime: string;
  webViewLink: string;
}

const DataUploadsPage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      setIsLoadingUploads(true);
      try {
        // In a real implementation, this would use the authenticated user's client ID
        const clientId = "current-client";
        const response = await fetch(`/api/drive/${clientId}/folders/data/recent`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent uploads');
        }
        
        const data = await response.json();
        setRecentUploads(data.files || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching recent uploads:", err);
        setError("Could not load recent uploads. Please try again later.");
      } finally {
        setIsLoadingUploads(false);
      }
    };

    fetchRecentUploads();
  }, []);

  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const clientId = "current-client"; // In a real app, get from auth context
      const folderType = "data";
      
      // Progress simulation
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);
      
      // Process each file
      const uploadPromises = files.map(async (file) => {
        return await uploadFileToClientFolder(clientId, folderType, file);
      });
      
      const results = await Promise.all(uploadPromises);
      clearInterval(interval);
      setUploadProgress(100);
      
      // Get valid results
      const validUploads = results.filter(Boolean) as UploadedFile[];
      
      if (validUploads.length > 0) {
        setRecentUploads((prev) => [...validUploads, ...prev]);
        toast.success(`${validUploads.length} file(s) uploaded successfully`);
      }
      
      // Handle any failed uploads
      if (validUploads.length < files.length) {
        toast.error(`${files.length - validUploads.length} file(s) failed to upload`);
      }
      
      // Reset upload state after a short delay to show 100%
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | string): string => {
    if (typeof bytes === 'string') {
      return bytes; // Already formatted
    }
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i))) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Data Uploads</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your data files
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Upload className="mr-2" size={20} />
                Upload New Data Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader 
                uploading={uploading}
                uploadProgress={uploadProgress}
                onUpload={handleUpload}
                acceptedFileTypes=".csv,.txt,.xlsx"
                helpText="Drag and drop files here (CSV, TXT, XLSX) or click to browse"
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: CSV, TXT, Excel (.xlsx)
              </p>
            </CardContent>
          </Card>
          
          {/* Data Health Check Card */}
          <DataHealthCheck 
            report={null}
          />
          
          {/* Recent Uploads Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <FileSearch className="mr-2" size={20} />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingUploads ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-2">{error}</p>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : recentUploads.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Your recent uploads will appear here
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUploads.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell>{new Date(file.modifiedTime).toLocaleString()}</TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(file.webViewLink, '_blank')}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(file.webViewLink + '&export=download', '_blank')}
                              >
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DataUploadsPage;
