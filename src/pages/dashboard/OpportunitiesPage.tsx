
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Target, 
  TrendingUp, 
  Award, 
  ArrowUpRight, 
  FileText, 
  Download, 
  ExternalLink,
  Search,
  ChevronDown,
  Info,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getClientFiles, getLatestFile } from "@/utils/googleDriveUtils";
import { toast } from "sonner";

// Interface for opportunity data
interface Opportunity {
  id: string;
  area: string;
  description: string;
  annualOpportunity: number;
  targetLevel: string;
  targetOpportunity: number;
  trackingDashboard: string;
}

// Interface for diagnostic documents
interface DiagnosticDocument {
  id: string;
  name: string;
  modifiedTime: string;
  size: string;
  webViewLink: string;
  embedLink: string;
  type?: string;
}

// Format currency in millions
const formatCurrency = (value: number) => {
  if (value >= 1) {
    return `$${value.toFixed(1)}M`;
  } else {
    return `$${(value * 1000).toFixed(0)}K`;
  }
};

const OpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [documents, setDocuments] = useState<DiagnosticDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DiagnosticDocument | null>(null);
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [opportunitiesError, setOpportunitiesError] = useState<string | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoadingOpportunities(true);
      try {
        // In a real implementation, this would fetch from a real API
        const response = await fetch('/api/opportunities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        
        const data = await response.json();
        setOpportunities(data.opportunities || []);
        setOpportunitiesError(null);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setOpportunitiesError("Could not load opportunities data. Please try again later.");
        toast.error("Failed to load opportunities data");
      } finally {
        setIsLoadingOpportunities(false);
      }
    };

    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        // Assuming clientId is available, in a real app this would come from auth
        const clientId = "current-client";
        const docs = await getClientFiles(clientId, "diagnostic");
        setDocuments(docs);
        setDocumentsError(null);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setDocumentsError("Could not load diagnostic documents. Please try again later.");
        toast.error("Failed to load diagnostic documents");
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchOpportunities();
    fetchDocuments();
  }, []);

  const handleOpenDocument = (doc: DiagnosticDocument) => {
    setSelectedDoc(doc);
    setIsViewingDocument(true);
  };

  const handleCloseDocument = () => {
    setIsViewingDocument(false);
  };

  // Filter and sort documents
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime();
    } else { // name
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Top Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Review key strategic opportunities identified by Revify and access related diagnostic reports and presentations.
          </p>
        </div>
        
        <Tabs defaultValue="opportunities" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="opportunities">Opportunities Summary</TabsTrigger>
            <TabsTrigger value="documents">Document Library</TabsTrigger>
          </TabsList>
          
          {/* Opportunities Summary Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <Target className="mr-2" size={20} />
                  Key Strategic Opportunities Summary
                </CardTitle>
                <CardDescription>
                  A structured overview of the most impactful areas for improvement, targets, and potential value, as defined during major Revify reviews. This table is updated periodically by your Revify team following strategic sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOpportunities ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : opportunitiesError ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>{opportunitiesError}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : opportunities.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Opportunity Area</TableHead>
                          <TableHead>Opportunity Description</TableHead>
                          <TableHead className="text-right">
                            Total Annual Opportunity
                            <Info className="ml-1 inline h-4 w-4 text-muted-foreground" />
                          </TableHead>
                          <TableHead>Target Level</TableHead>
                          <TableHead className="text-right">
                            Annual Target Opportunity
                            <Info className="ml-1 inline h-4 w-4 text-muted-foreground" />
                          </TableHead>
                          <TableHead>Tracking Dashboard</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {opportunities.map((opp) => (
                          <TableRow key={opp.id}>
                            <TableCell className="font-medium">{opp.area}</TableCell>
                            <TableCell className="max-w-md">{opp.description}</TableCell>
                            <TableCell className="text-right">{formatCurrency(opp.annualOpportunity)}</TableCell>
                            <TableCell>{opp.targetLevel}</TableCell>
                            <TableCell className="text-right">{formatCurrency(opp.targetOpportunity)}</TableCell>
                            <TableCell>{opp.trackingDashboard}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>Key strategic opportunities and targets will be populated here by your Revify team following diagnostic reviews.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Document Library Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <FileText className="mr-2" size={20} />
                  Diagnostic Reports & Presentations
                </CardTitle>
                <CardDescription>
                  Access all strategic assessments, performance reviews, workshop outputs, and other key documents prepared by Revify.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDocuments ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : documentsError ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>{documentsError}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : !isViewingDocument ? (
                  <>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search documents..."
                          className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="relative w-full md:w-44">
                        <select
                          className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="name">Name</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {documents.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <p>No diagnostic documents available yet.</p>
                      </div>
                    ) : sortedDocuments.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <p>No documents match your search criteria.</p>
                        <Button
                          variant="link"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedDocuments.map((doc) => (
                          <div key={doc.id} className="border rounded-lg p-4">
                            <div className="flex items-start mb-2">
                              <FileText className="h-8 w-8 mr-2 text-muted-foreground" />
                              <div>
                                <h3 className="font-medium truncate">{doc.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(doc.modifiedTime).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handleOpenDocument(doc)}
                              >
                                Open
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(doc.webViewLink, '_blank')}
                              >
                                <ExternalLink className="mr-1 h-4 w-4" />
                                Drive
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.open(doc.webViewLink + '&export=download', '_blank')}
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{selectedDoc?.name}</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedDoc?.webViewLink, '_blank')}
                        >
                          <ExternalLink className="mr-1 h-4 w-4" />
                          Open in Drive
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedDoc?.webViewLink + '&export=download', '_blank')}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleCloseDocument}
                        >
                          Back to List
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="bg-muted/20 rounded-lg p-4 h-[500px] flex items-center justify-center">
                      {selectedDoc?.embedLink ? (
                        <iframe 
                          src={selectedDoc.embedLink} 
                          className="w-full h-full border-0"
                          title={selectedDoc.name}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <p>Unable to display the document preview.</p>
                          <p>You can try opening it directly in Google Drive or downloading it.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
