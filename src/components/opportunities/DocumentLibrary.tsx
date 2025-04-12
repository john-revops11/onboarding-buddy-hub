
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Search, 
  Filter 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  url: string;
}

interface DocumentLibraryProps {
  documents: Document[];
  isLoading: boolean;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ 
  documents, 
  isLoading 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || doc.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Document Library</h2>
        <p className="text-neutral-600 mb-6">
          Access diagnostic reports, presentations, and strategic analyses related to your 
          identified opportunities.
        </p>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search documents..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All document types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="diagnostic">Diagnostic</SelectItem>
            <SelectItem value="report">Report</SelectItem>
            <SelectItem value="presentation">Presentation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDocuments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.url)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="font-medium mb-2">No documents match your criteria</p>
          <p className="text-muted-foreground">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};
