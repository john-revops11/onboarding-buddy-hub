import React, { useState, useEffect } from "react";
import { Main } from "@/components/ui/main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Edit, CheckCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUploadedFiles, updateFileStatus } from "@/utils/file";

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  category?: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  userId: string;
  userEmail?: string;
  notes?: string;
}

const AdminFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchQuery, files]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const files = await getUploadedFiles();
      setFiles(files);
      setFilteredFiles(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (fileId: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    try {
      await updateFileStatus(fileId, newStatus);
      setFiles(files.map(file =>
        file.id === fileId ? { ...file, status: newStatus } : file
      ));
      setFilteredFiles(filteredFiles.map(file =>
        file.id === fileId ? { ...file, status: newStatus } : file
      ));
      toast({
        title: "Success",
        description: "File status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating file status:", error);
      toast({
        title: "Error",
        description: "Failed to update file status",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  const handleEdit = (file: File) => {
    setSelectedFile(file);
    setNotes(file.notes || "");
    setStatus(file.status);
    setOpen(true);
  };

  return (
    <Main>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Uploaded Files</h1>
        </div>
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Filename</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No files found.</TableCell>
                </TableRow>
              ) : (
                filteredFiles.map(file => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>{file.category || 'N/A'}</TableCell>
                    <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{file.userEmail}</TableCell>
                    <TableCell>
                      {file.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                      {file.status === 'verified' && <Badge className="bg-green-500 text-white">Verified</Badge>}
                      {file.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(file)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit File Details</DialogTitle>
            <DialogDescription>
              Make changes to the file details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Status
              </Label>
              <Select defaultValue={status} onValueChange={(value) => setStatus(value as 'pending' | 'verified' | 'rejected')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea id="notes" className="col-span-3" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => selectedFile && handleStatusChange(selectedFile.id, status)}>Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Main>
  );
};

export default AdminFiles;
