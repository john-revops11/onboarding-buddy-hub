
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSearch, BarChart2 } from "lucide-react";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { motion } from "framer-motion";
import { DataHealthCheck } from "@/components/dashboard/DataHealthCheck";

const DataUploadsPage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Simulate upload completion after 3 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
        }, 500);
      }, 3000);
      
    } catch (error) {
      console.error("Upload error:", error);
    }
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
              <p className="text-muted-foreground text-center py-8">
                Your recent uploads will appear here
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DataUploadsPage;
