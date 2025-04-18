import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  ExternalLink,
  Search,
  Download,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getClientFiles } from "@/utils/googleDriveUtils";

const OpportunitiesPage = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState("opportunities");
  const [diagnosticReviews, setDiagnosticReviews] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [documentFilter, setDocumentFilter] = useState("all");
  
  const opportunities = [
    {
      id: 1,
      area: "Price Realization",
      description: "Price realization below optimum",
      totalAnnualOpportunity: 6.0,
      currentLevel: "30%",
      targetLevel: "70%",
      targetOpportunity: 5.40,
      trackingDashboard: "Executive Dashboard",
    },
    {
      id: 2,
      area: "Discounting",
      description: "Inconsistent discounting on Segment 2",
      totalAnnualOpportunity: 8.0,
      currentLevel: "15%",
      targetLevel: "5%",
      targetOpportunity: 2.40,
      trackingDashboard: "Executive Dashboard (View on Segment 2)",
    },
    {
      id: 3,
      area: "Inventory",
      description: "Excess inventory in region A segment",
      totalAnnualOpportunity: 12.5,
      currentLevel: "43%",
      targetLevel: "$37M",
      targetOpportunity: 5.76,
      trackingDashboard: "Inventory Dashboard",
    },
  ];

  const presentations = [
    {
      id: 1,
      title: "Q1 2025 Strategy Review",
      date: "2025-03-15",
      link: "https://drive.google.com/file/d/1example",
      type: "Strategy"
    },
    {
      id: 2,
      title: "Implementation Roadmap",
      date: "2025-03-01",
      link: "https://drive.google.com/file/d/2example",
      type: "Plan"
    }
  ];

  const formatCurrency = (value) => {
    if (value >= 1) {
      return `$${value.toFixed(2)}M`;
    } else {
      return `$${(value * 1000).toFixed(0)}K`;
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        const clientId = "client123";
        const files = await getClientFiles(clientId, "diagnostics");
        setDiagnosticReviews(files);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    if (activeTab === "documents") {
      loadDocuments();
    }
  }, [activeTab]);

  const filteredDocuments = diagnosticReviews.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = documentFilter === "all" || doc.type === documentFilter;
    
    return matchesSearch && matchesType;
  });

  const handleOpenDocument = (document) => {
    setSelectedDocument(document);
  };

  const handleCloseDocument = () => {
    setSelectedDocument(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <h1 className="text-3xl font-bold tracking-tight">Opportunities & Actions</h1>
        <p className="text-muted-foreground">
          Review key strategic opportunities identified by Revify and access related diagnostic reports and presentations.
        </p>
        
        <div className="grid gap-5">
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Consulting Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-primary/20 rounded-lg p-4 flex items-center justify-between bg-white">
                <div>
                  <p className="font-medium">Elite Consulting Tier</p>
                  <p className="text-sm text-muted-foreground">Premium access to all Revify services and features</p>
                </div>
                <Button variant="outline" size="sm">View Benefits</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Top Opportunities</CardTitle>
              <CardDescription>
                Review key strategic opportunities identified by Revify and access related diagnostic reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="opportunities" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="opportunities">Opportunities Summary</TabsTrigger>
                  <TabsTrigger value="documents">Document Library</TabsTrigger>
                </TabsList>
                
                <TabsContent value="opportunities">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Strategic Opportunities Summary</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        A structured overview of the most impactful areas for improvement, targets, and potential value, 
                        as defined during major Revify reviews. This table is updated periodically by your Revify team 
                        following strategic sessions.
                      </p>
                    </div>
                    
                    {opportunities.length > 0 ? (
                      <div className="border rounded-lg overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Opportunity Area</TableHead>
                              <TableHead>Opportunity Description</TableHead>
                              <TableHead className="text-right">
                                <div className="flex items-center justify-end">
                                  <span>Total Annual Opportunity ($MM)</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info size={14} className="ml-1 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Estimated total size of the prize if fully realized
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableHead>
                              <TableHead>Current Level / Baseline</TableHead>
                              <TableHead>Target Level</TableHead>
                              <TableHead className="text-right">
                                <div className="flex items-center justify-end">
                                  <span>$MM Annual Target Opportunity</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info size={14} className="ml-1 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Estimated value tied to achieving the defined Target Level
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableHead>
                              <TableHead>Tracking Dashboard</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {opportunities.map((opportunity) => (
                              <TableRow key={opportunity.id}>
                                <TableCell className="font-medium">{opportunity.area}</TableCell>
                                <TableCell>{opportunity.description}</TableCell>
                                <TableCell className="text-right">{formatCurrency(opportunity.totalAnnualOpportunity)}</TableCell>
                                <TableCell>{opportunity.currentLevel}</TableCell>
                                <TableCell>{opportunity.targetLevel}</TableCell>
                                <TableCell className="text-right">{formatCurrency(opportunity.targetOpportunity)}</TableCell>
                                <TableCell>{opportunity.trackingDashboard}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={2} className="font-bold text-right">Total</TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.totalAnnualOpportunity, 0))}
                              </TableCell>
                              <TableCell colSpan={2}></TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.targetOpportunity, 0))}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">
                          Key strategic opportunities and targets will be populated here by your Revify team following diagnostic reviews.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Diagnostic Reports & Presentations</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access all strategic assessments, performance reviews, workshop outputs, and other key documents prepared by Revify.
                      </p>
                    </div>
                    
                    {!selectedDocument ? (
                      <>
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
                          <Select value={documentFilter} onValueChange={setDocumentFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="Initial Assessment">Initial</SelectItem>
                              <SelectItem value="Quarterly Review">Quarterly</SelectItem>
                              <SelectItem value="Strategy">Strategy</SelectItem>
                              <SelectItem value="Technical">Technical</SelectItem>
                              <SelectItem value="Market Analysis">Market</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="newest">
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest First</SelectItem>
                              <SelectItem value="oldest">Oldest First</SelectItem>
                              <SelectItem value="name">Name (A-Z)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {isLoadingDocuments ? (
                          <div className="text-center py-8">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                            <p className="text-muted-foreground">Loading documents...</p>
                          </div>
                        ) : filteredDocuments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredDocuments.map((doc) => (
                              <div key={doc.id} className="border rounded-lg p-4 flex flex-col">
                                <div className="flex items-start mb-3">
                                  <div className="mr-3 p-2 bg-primary/10 rounded">
                                    <FileText size={18} className="text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{doc.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(doc.modifiedTime).toLocaleDateString()}
                                    </p>
                                    {doc.type && (
                                      <Badge variant="outline" className="mt-2 text-xs">
                                        {doc.type}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-auto">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={() => handleOpenDocument(doc)}
                                  >
                                    Open
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Download size={14} className="mr-1" />
                                    Download
                                  </Button>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={doc.webViewLink} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink size={14} />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border rounded-lg bg-muted/20">
                            <p className="text-muted-foreground">
                              {searchQuery || documentFilter !== "all" 
                                ? "No documents found matching your criteria." 
                                : "No diagnostic reviews available yet."}
                            </p>
                            {(searchQuery || documentFilter !== "all") && (
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  setSearchQuery("");
                                  setDocumentFilter("all");
                                }}
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">{selectedDocument.name}</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCloseDocument}>
                              Back to Library
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download size={14} className="mr-1" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedDocument.webViewLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={14} className="mr-1" />
                                Open in Drive
                              </a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden h-[600px]">
                          {selectedDocument.embedLink ? (
                            <iframe
                              src={selectedDocument.embedLink}
                              width="100%"
                              height="600"
                              title={selectedDocument.name}
                              className="border-0"
                            ></iframe>
                          ) : (
                            <div className="flex items-center justify-center h-full bg-muted/20">
                              <div className="text-center p-4">
                                <p className="text-muted-foreground mb-2">
                                  Unable to display the document preview.
                                </p>
                                <div className="flex gap-2 justify-center">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={selectedDocument.webViewLink} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink size={14} className="mr-1" />
                                      Open in Drive
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Client Presentations</CardTitle>
              <CardDescription>Access your strategic recommendations and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {presentations.map((presentation) => (
                  <div key={presentation.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-primary/10 rounded">
                        <FileText size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{presentation.title}</p>
                        <p className="text-xs text-muted-foreground">{presentation.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={presentation.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} className="mr-1" />
                        Open
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <a 
                    href="https://drive.google.com/drive/folders/client-specific-folder" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View All in Google Drive
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
