
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getClientFiles } from "@/utils/googleDriveUtils";

// Interface for diagnostic reviews
interface DiagnosticReview {
  id: string;
  title: string;
  date: string;
  type: string;
  summary: string;
  driveUrl: string;
  embedUrl: string;
  insights: string[];
}

const DiagnosticReviewsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [diagnosticReviews, setDiagnosticReviews] = useState<DiagnosticReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<DiagnosticReview | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDiagnosticReviews = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would use the authenticated user's client ID
        const clientId = "current-client";
        const files = await getClientFiles(clientId, "diagnostic");
        
        // Transform the files into diagnostic reviews
        const reviews: DiagnosticReview[] = files.map(file => {
          // Extract title from filename or use the filename as is
          const title = file.name.replace(/\.\w+$/, '').replace(/-/g, ' ');
          
          // Extract type from metadata or determine from filename pattern
          const fileType = determineFileType(file.name);
          
          return {
            id: file.id,
            title: title,
            date: file.modifiedTime,
            type: fileType,
            summary: `This is a ${fileType} document from ${new Date(file.modifiedTime).toLocaleDateString()}.`,
            driveUrl: file.webViewLink,
            embedUrl: file.embedLink,
            insights: [] // In a real app, these would come from metadata or document analysis
          };
        });
        
        setDiagnosticReviews(reviews);
        
        // Select the first review by default if available
        if (reviews.length > 0 && !selectedReview) {
          setSelectedReview(reviews[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching diagnostic reviews:", err);
        setError("Failed to load diagnostic reviews. Please try again later.");
        toast.error("Could not load diagnostic reviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiagnosticReviews();
  }, []);
  
  // Helper function to determine the type of document based on filename
  const determineFileType = (filename: string): string => {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('initial') || lowerFilename.includes('assessment')) {
      return 'Initial Assessment';
    } else if (lowerFilename.includes('q1') || lowerFilename.includes('q2') || 
               lowerFilename.includes('q3') || lowerFilename.includes('q4') ||
               lowerFilename.includes('quarter')) {
      return 'Quarterly Review';
    } else if (lowerFilename.includes('strategy')) {
      return 'Strategy';
    } else if (lowerFilename.includes('tech') || lowerFilename.includes('technical')) {
      return 'Technical';
    } else if (lowerFilename.includes('market')) {
      return 'Market Analysis';
    } else {
      return 'General Review';
    }
  };
  
  // Filter the reviews based on search and type
  const filteredReviews = diagnosticReviews.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || review.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Loading state component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p>Loading diagnostic reviews...</p>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-destructive">
      <p className="mb-2">{error}</p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diagnostic Reviews</h1>
            <p className="text-muted-foreground">
              Comprehensive assessments and strategic analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule Review
            </Button>
            <Button size="sm" className="gap-2">
              <Clock size={16} />
              View History
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar with documents list */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Document Library</CardTitle>
                  <CardDescription>
                    Browse all diagnostic reviews and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="flex items-center space-x-2 mb-4">
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
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Initial Assessment">Initial</SelectItem>
                        <SelectItem value="Quarterly Review">Quarterly</SelectItem>
                        <SelectItem value="Strategy">Strategy</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Market Analysis">Market</SelectItem>
                        <SelectItem value="General Review">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                      <TabsTrigger value="saved">Saved</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
                
                <div className="px-6 pb-6 pt-2">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <div
                          key={review.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedReview?.id === review.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedReview(review)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <div>
                                <h4 className="font-medium text-sm">{review.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {review.type.split(" ")[0]}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        <p>No documents found matching your criteria</p>
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchQuery("");
                            setTypeFilter("all");
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Document viewer area */}
            <div className="lg:col-span-2 space-y-6">
              {selectedReview ? (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedReview.title}</CardTitle>
                        <CardDescription>
                          {new Date(selectedReview.date).toLocaleDateString()} · {selectedReview.type}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download size={14} />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1" asChild>
                          <a href={selectedReview.driveUrl} target="_blank" rel="noreferrer">
                            <ExternalLink size={14} />
                            Open in Drive
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-muted-foreground mb-4">
                      {selectedReview.summary}
                    </p>

                    {selectedReview.insights && selectedReview.insights.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Key Insights:</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {selectedReview.insights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="border rounded-lg overflow-hidden h-[600px]">
                      <iframe
                        src={selectedReview.embedUrl}
                        width="100%"
                        height="600"
                        title={selectedReview.title}
                        className="border-0"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {diagnosticReviews.length > 0 
                        ? "Select a document to view" 
                        : "No diagnostic reviews available yet"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DiagnosticReviewsPage;
