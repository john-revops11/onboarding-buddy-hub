
import React from "react";
import { ExternalLink, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface InsightDocument {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink: string;
  embedLink: string;
}

interface InsightsListProps {
  insights: InsightDocument[];
  isLoading: boolean;
  error: string | null;
  onViewInsight: (insight: InsightDocument) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InsightsList({
  insights,
  isLoading,
  error,
  onViewInsight,
  currentPage,
  totalPages,
  onPageChange,
}: InsightsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading insights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p>No previous insights available yet.</p>
      </div>
    );
  }

  // Format file name for display
  const formatFileName = (name: string): string => {
    // Remove file extension
    const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
    
    // Try to extract date and format it
    const dateMatch = nameWithoutExt.match(/(\d{4})-(\d{2})/);
    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthName = months[parseInt(month, 10) - 1];
      return `Insight – ${monthName} ${year}`;
    }
    
    return nameWithoutExt;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="w-[220px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insights.map((insight) => (
            <TableRow key={insight.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  {formatFileName(insight.name)}
                </div>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(insight.modifiedTime), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewInsight(insight)}>
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(insight.webViewLink, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(insight.webViewLink + "&export=download", "_blank")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
