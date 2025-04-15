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
  Check,
  UploadCloud,
  File,
  X,
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
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const DataUploadsPage = () => {
  const { state } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthCheckReport, setHealthCheckReport] = useState<any>(null);
  const isMobile = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        setLoading(true);
        const filesData = await getClientFiles("client123", "data");
        setUploadHistory(filesData);
        
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
      
      const file = files[0];
      
      const uploadedFile = await uploadFileToClientFolder("client123", "data", file);
      
      setUploadProgress(100);
      clearInterval(interval);
      
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

  const handleUploadComplete = (file: any) => {
    console.log("File upload completed:", file);
    // In a real implementation, this would process the uploaded file
  };

  const handleVerificationStatusChange = (fileId: string, status: 'pending' | 'verified' | 'rejected') => {
    console.log(`File ${fileId} status changed to: ${status}`);
    // In a real implementation, this would update the file status
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const today = new Date();
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
  const nextUploadDate = `${nextMonth.toLocaleString('default', { month: 'long' })} 5, ${nextMonth.getFullYear()}`;

  const renderMobileFileCard = (file: any) => (
    <Card key={file.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <File size={16} className="mr-2 text-muted-foreground" />
          <CardTitle className="text-base">{file.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Size</span>
          <span className="text-sm font-medium">{file.size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Uploaded</span>
          <span className="text-sm font-medium">{new Date(file.modifiedTime).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span>
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
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

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
            Manage your data submissions, schedule, and review data health.
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
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
                onUploadComplete={handleUploadComplete}
                onVerificationStatusChange={handleVerificationStatusChange}
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
            </CardFooter>
          </Card>
          
          <DataHealthCheck report={healthCheckReport} />
          
          <UploadSchedule />
          
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Recent Upload History</CardTitle>
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
              ) : isMobile ? (
                <div>
                  {uploadHistory.map(renderMobileFileCard)}
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
                            <motion.div
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ y: 0, scale: 0.98 }}
                            >
                              <Button variant="ghost" size="sm" className="focus:ring-4 focus:ring-accentGreen-600/40">
                                View Details
                              </Button>
                            </motion.div>
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
