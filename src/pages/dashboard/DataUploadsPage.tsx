
import React, { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { uploadFile, getUserFiles, deleteFile } from "@/utils/fileUtils";
import { getLatestFile } from "@/utils/googleDriveUtils";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { UploadedFile } from "@/types/onboarding";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Trash2, UploadCloud, Calendar, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { UploadSchedule } from "@/components/dashboard/UploadSchedule";
import { DataHealthCheck } from "@/components/dashboard/DataHealthCheck";

const DataUploadsPage = () => {
  const { state } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [healthCheckReport, setHealthCheckReport] = useState<any>(null);

  // Load user files and health check report on component mount
  useEffect(() => {
    if (state.user?.id) {
      // Load user files
      const files = getUserFiles(state.user.id);
      setUploadedFiles(files);
      
      // Get the latest health check report
      const fetchHealthCheckReport = async () => {
        try {
          const report = await getLatestFile(state.user.id, 'diagnostics');
          setHealthCheckReport(report);
        } catch (error) {
          console.error("Error fetching health check report:", error);
        }
      };
      
      fetchHealthCheckReport();
    }
  }, [state.user]);

  // Handle file upload process
  const handleUpload = useCallback(async (files: File[]) => {
    if (!state.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    try {
      // Process each file
      for (const file of files) {
        const uploadedFile = await uploadFile(file, state.user.id, 'data');
        setUploadedFiles(prev => [uploadedFile, ...prev]);
      }
      
      // Ensure progress reaches 100%
      setUploadProgress(100);
      
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${files.length} file(s)`,
      });
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file(s)",
        variant: "destructive",
      });
    } finally {
      // Reset upload state after a short delay (to show 100% completion)
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }, 500);
    }
  }, [state.user, toast]);

  // Handle file deletion
  const handleDeleteFile = useCallback((fileId: string) => {
    try {
      // Call the utils function to delete the file
      const isDeleted = deleteFile(fileId);
      
      if (isDeleted) {
        // Update the local state by removing the deleted file
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
        
        toast({
          title: "File deleted",
          description: "The file has been successfully deleted",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the file",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter files based on active tab
  const filteredFiles = uploadedFiles.filter(file => {
    if (activeTab === "all") return true;
    return file.status === activeTab;
  });

  // Get the appropriate badge for each status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Processed ✅</Badge>;
      case "rejected":
        return <Badge variant="destructive">Failed ❌</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Processing</Badge>;
    }
  };

  const getNextUploadDate = () => {
    const today = new Date();
    const nextMonday = new Date();
    nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
    return nextMonday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Data Uploads</h1>
          <p className="text-muted-foreground mt-1">
            Manage your data submissions, schedule, and review data health.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - File Upload and Health Check */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5" /> Upload New Data Files
                </CardTitle>
                <CardDescription>
                  Upload your data files for analysis. Supported formats: CSV, TXT, Excel (.xlsx)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  uploading={uploading}
                  uploadProgress={uploadProgress}
                  onUpload={handleUpload}
                  acceptedFileTypes=".csv,.xlsx,.xls,.txt"
                  helpText="Drag and drop files here or click to browse"
                />
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Next scheduled upload due: <strong>{getNextUploadDate()}</strong></p>
                </div>
              </CardContent>
            </Card>
            
            <DataHealthCheck report={healthCheckReport} />
          </div>
          
          {/* Right column - Upload Schedule */}
          <div>
            <UploadSchedule />
          </div>
        </div>
        
        {/* Upload History Table - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Upload History</CardTitle>
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="pending">Processing</TabsTrigger>
                <TabsTrigger value="verified">Processed</TabsTrigger>
                <TabsTrigger value="rejected">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredFiles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{file.type.split('/').pop()?.toUpperCase()}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{getStatusBadge(file.status)}</TableCell>
                      <TableCell>{new Date(file.uploadedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                              <FileDown className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No files uploaded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataUploadsPage;
