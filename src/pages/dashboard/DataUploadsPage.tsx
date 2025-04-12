
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileUp,
  Calendar,
  ArrowUpRight,
  Check,
  UploadCloud,
  File,
  X,
  BarChart,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getClientFiles, getLatestFile, uploadFileToClientFolder } from "@/utils/googleDriveUtils";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { DataHealthCheck } from "@/components/dashboard/DataHealthCheck";
import { UploadSchedule } from "@/components/dashboard/UploadSchedule";

const DataUploadsPage = () => {
  const { state } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthCheckReport, setHealthCheckReport] = useState<any>(null);

  useEffect(() => {
    // Fetch upload history
    const fetchUploadHistory = async () => {
      try {
        setLoading(true);
        const filesData = await getClientFiles("client123", "data");
        setUploadHistory(filesData);
        
        // Fetch latest health check report
        const latestReport = await getLatestFile("client123", "resources");
        setHealthCheckReport(latestReport);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch upload history");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadHistory();
  }, []);

  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      // In a real app, we would upload all files
      // For demonstration, we'll upload just the first file
      const file = files[0];
      
      // Upload file to Google Drive
      const uploadedFile = await uploadFileToClientFolder("client123", "data", file);
      
      // Simulate completion
      setUploadProgress(100);
      clearInterval(interval);
      
      // Add the new file to history
      setUploadHistory(prev => [
        {
          id: uploadedFile.id,
          name: file.name,
          size: formatFileSize(file.size),
          modifiedTime: new Date().toISOString(),
          status: "processed"
        },
        ...prev
      ]);
      
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Determine the next upload due date
  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  const nextUploadDate = `${nextMonth.toLocaleString('default', { month: 'long' })} 5, ${nextMonth.getFullYear()}`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Uploads</h1>
          <p className="text-muted-foreground mt-2">
            Manage your data submissions, schedule, and review data health.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload New Data Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UploadCloud className="mr-2" size={20} />
                Upload New Data Files
              </CardTitle>
              <CardDescription>
                Upload your latest data files for analysis
              </CardDescription>
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
            <CardFooter className="flex justify-between border-t bg-muted/50 py-3">
              <div className="flex items-center text-sm">
                <Calendar size={14} className="mr-1" />
                <span>Next upload due: <strong>{nextUploadDate}</strong></span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <a href="https://drive.google.com/drive/folders/client-specific-folder" target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight size={12} className="mr-1" />
                  Go to Google Drive
                </a>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Data Health Check Section */}
          <DataHealthCheck report={healthCheckReport} />
          
          {/* Upload Schedule Panel */}
          <UploadSchedule />
          
          {/* Upload History Table */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Upload History</CardTitle>
              <CardDescription>
                Your recent data submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : uploadHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upload history found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadHistory.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <File size={16} className="mr-2 text-muted-foreground" />
                              <span>{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>
                            {new Date(file.modifiedTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {file.status === "processed" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check size={12} className="mr-1" />
                                Processed
                              </span>
                            ) : file.status === "processing" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <span className="animate-pulse mr-1">⋯</span>
                                Processing
                              </span>
                            ) : file.status === "failed" ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <X size={12} className="mr-1" />
                                Failed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <UploadCloud size={12} className="mr-1" />
                                Uploaded
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
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
      </div>
    </DashboardLayout>
  );
};

export default DataUploadsPage;
