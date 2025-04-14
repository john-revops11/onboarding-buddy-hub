
import React, { useState } from "react";
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
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getClientFiles, getLatestFile } from "@/utils/googleDriveUtils";
import { useState as useHookState, useEffect } from "react";

// Sample opportunity data (in a real app this would come from the backend)
const opportunitiesData = [
  {
    id: "opp1",
    area: "Price Realization",
    description: "Implement value-based pricing strategy across product lines to capture additional margin",
    annualOpportunity: 2.4, // in millions
    targetLevel: "Increase by 15%",
    targetOpportunity: 1.2, // in millions
    trackingDashboard: "Pricing Scorecard"
  },
  {
    id: "opp2",
    area: "Inventory Holding Costs",
    description: "Optimize inventory levels based on demand forecasting and improved supplier relationships",
    annualOpportunity: 1.8, // in millions
    targetLevel: "Reduce by 22%",
    targetOpportunity: 0.85, // in millions
    trackingDashboard: "Inventory Analytics"
  },
  {
    id: "opp3",
    area: "Customer Churn",
    description: "Implement proactive retention program focused on high-value accounts",
    annualOpportunity: 3.2, // in millions
    targetLevel: "Achieve <5% Churn",
    targetOpportunity: 1.5, // in millions
    trackingDashboard: "Customer Health"
  }
];

// Format currency in millions
const formatCurrency = (value: number) => {
  if (value >= 1) {
    return `$${value.toFixed(1)}M`;
  } else {
    return `$${(value * 1000).toFixed(0)}K`;
  }
};

interface DiagnosticDocument {
  id: string;
  name: string;
  modifiedTime: string;
  size: string;
  webViewLink: string;
  embedLink: string;
  type?: string;
}

const OpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [documents, setDocuments] = useState<DiagnosticDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DiagnosticDocument | null>(null);
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Assuming clientId is available, in a real app this would come from auth
        const clientId = "current-client";
        const docs = await getClientFiles(clientId, "diagnostic");
        setDocuments(docs);
        setError(null);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Could not load diagnostic documents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleOpenDocument = (doc: DiagnosticDocument) => {
    setSelectedDoc(doc);
    setIsViewingDocument(true);
  };

  const handleCloseDocument = () => {
    setIsViewingDocument(false);
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
                {opportunitiesData.length > 0 ? (
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
                        {opportunitiesData.map((opp) => (
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
                {!isViewingDocument ? (
                  <>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search documents..."
                          className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        />
                      </div>
                      <div className="relative w-full md:w-44">
                        <select
                          className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          defaultValue="newest"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="name">Name</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <p>Loading documents...</p>
                      </div>
                    ) : error ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <p>{error}</p>
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <p>No diagnostic documents available yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((doc) => (
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
                                // In a real app, this would trigger a download
                                onClick={() => window.open(doc.webViewLink, '_blank')}
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
