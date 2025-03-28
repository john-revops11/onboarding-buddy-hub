
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Search, FileDown, Trash2 } from "lucide-react";
import { getUploadedFiles, deleteFile } from "@/utils/fileUtils";
import { UploadedFile } from "@/types/onboarding";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const AdminFiles = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load all files on component mount
  useEffect(() => {
    const loadFiles = () => {
      const allFiles = getUploadedFiles();
      setFiles(allFiles);
      setFilteredFiles(allFiles);
    };
    
    loadFiles();
    
    // Refresh data every 5 seconds (for demo purposes)
    const interval = setInterval(loadFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter((file) => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        file.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  const handleDeleteFile = (fileId: string) => {
    const success = deleteFile(fileId);
    if (success) {
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the file.",
        variant: "destructive",
      });
    }
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-green-100 text-green-800";
    if (type.includes("pdf")) return "bg-red-100 text-red-800";
    if (type.includes("word") || type.includes("doc")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
        <p className="text-muted-foreground">
          View and manage all uploaded files from users.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Input 
              placeholder="Search files or users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              {files.length} files uploaded by {new Set(files.map(f => f.userId)).size} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getFileTypeColor(file.type)}>
                          {file.type.split('/').pop()?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{file.userId}</TableCell>
                      <TableCell>
                        {new Date(file.uploadedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No files found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminFiles;
