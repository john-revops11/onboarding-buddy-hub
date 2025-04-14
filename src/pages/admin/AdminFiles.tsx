
import React, { useState, useEffect } from "react";
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
import { Search, FileDown, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { FileUpload } from "@/lib/types/client-types";
import { uploadClientFile, getClientFiles, updateFileStatus } from "@/lib/client-management";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AdminFiles = () => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileUpload[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load all files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        // Fetch files from Supabase directly to get all clients' files
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .order('uploaded_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedFiles = data.map(file => ({
          id: file.id,
          clientId: file.client_id,
          fileName: file.filename,
          filePath: file.file_path,
          fileSize: file.file_size,
          fileType: file.file_type,
          category: file.category || 'general',
          status: file.status,
          uploadedBy: file.uploaded_by,
          uploadedAt: file.uploaded_at,
          verifiedAt: file.verified_at,
          metadata: file.metadata || {}
        }));
        
        setFiles(formattedFiles);
        setFilteredFiles(formattedFiles);
      } catch (error) {
        console.error("Error loading files:", error);
        toast.error("Failed to load files. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFiles();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadFiles, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFiles(files);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = files.filter((file) => 
        file.fileName.toLowerCase().includes(searchTermLower) || 
        file.clientId.toLowerCase().includes(searchTermLower) ||
        (file.category && file.category.toLowerCase().includes(searchTermLower))
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  const handleDeleteFile = async (fileId: string) => {
    try {
      // Get file details
      const fileToDelete = files.find(f => f.id === fileId);
      if (!fileToDelete) {
        toast.error("File not found");
        return;
      }
      
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('client-files')
        .remove([fileToDelete.filePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);
      
      if (dbError) throw dbError;
      
      // Update state
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  const handleUpdateFileStatus = async (fileId: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      const updatedFile = await updateFileStatus(fileId, status);
      
      setFiles(prev => prev.map(file => 
        file.id === fileId ? updatedFile : file
      ));
      
      toast.success(`File marked as ${status}`);
    } catch (error) {
      console.error(`Error updating file status to ${status}:`, error);
      toast.error(`Failed to update file status. Please try again.`);
    }
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-green-100 text-green-800";
    if (type.includes("pdf")) return "bg-red-100 text-red-800";
    if (type.includes("word") || type.includes("doc")) return "bg-blue-100 text-blue-800";
    if (type.includes("excel") || type.includes("spreadsheet")) return "bg-emerald-100 text-emerald-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage.from('client-files').getPublicUrl(filePath);
    return data.publicUrl;
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">File Management</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all uploaded files from users.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Input 
              placeholder="Search files or clients..." 
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
              {files.length} files uploaded by clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex justify-center">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Loading files...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.fileName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getFileTypeColor(file.fileType)}>
                          {file.fileType.split('/').pop()?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                      <TableCell>{file.clientId.slice(0, 8)}...</TableCell>
                      <TableCell>{getStatusBadge(file.status)}</TableCell>
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
                            <a href={getFileUrl(file.filePath)} target="_blank" rel="noopener noreferrer">
                              <FileDown className="h-4 w-4" />
                            </a>
                          </Button>
                          
                          {file.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleUpdateFileStatus(file.id, 'verified')}
                                title="Verify File"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleUpdateFileStatus(file.id, 'rejected')}
                                title="Reject File"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {(file.status === 'verified' || file.status === 'rejected') && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                              onClick={() => handleUpdateFileStatus(file.id, 'pending')}
                              title="Mark as Pending"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-500"
                            title="Delete File"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      {searchTerm ? 
                        "No files found matching your search." : 
                        "No files have been uploaded yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminFiles;
