import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { LineChart } from "@/components/ui/charts/LineChart";
import { 
  CalendarDays, 
  FileText, 
  ArrowRight, 
  Calendar, 
  Search, 
  Filter,
  Download,
  ExternalLink,
  Bookmark,
  BarChart2,
  TrendingUp,
  Users,
  PieChart,
  Archive,
  Clock,
  BarChart,
  Loader2,
  AlertCircle,
  FileDown,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClientFiles } from "@/utils/googleDriveUtils";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

const performanceData = [
  { name: "Jan", value: 53, target: 50 },
  { name: "Feb", value: 65, target: 55 },
  { name: "Mar", value: 75, target: 60 },
  { name: "Apr", value: 81, target: 65 },
  { name: "May", value: 72, target: 70 },
  { name: "Jun", value: 85, target: 75 },
];

const InsightsPage = () => {
  const { state } = useAuth();
  const clientId = state.user?.id || "demo-client";
  
  const [selectedTab, setSelectedTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [insights, setInsights] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const files = await getClientFiles(clientId, 'insights');
        
        const insightDocuments = files.map(file => {
          let insightDate = new Date(file.modifiedTime);
          let insightMonth = "Unknown";
          let insightType = "monthly";
          
          const dateMatch = file.name.match(/^(\d{4})-(\d{2})/);
          if (dateMatch) {
            const [_, yearStr, monthStr] = dateMatch;
            const year = parseInt(yearStr, 10);
            const month = parseInt(monthStr, 10);
            insightDate = new Date(year, month - 1);
            insightMonth = insightDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          } else {
            insightMonth = insightDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          }
          
          if (file.name.toLowerCase().includes('quarterly') || file.name.toLowerCase().includes('q1') || 
              file.name.toLowerCase().includes('q2') || file.name.toLowerCase().includes('q3') || 
              file.name.toLowerCase().includes('q4')) {
            insightType = "quarterly";
          } else if (file.name.toLowerCase().includes('strategy')) {
            insightType = "strategy";
          } else if (file.name.toLowerCase().includes('analysis')) {
            insightType = "analysis";
          }
          
          return {
            id: file.id,
            month: insightMonth,
            title: file.name,
            summary: `Key findings and strategic recommendations for ${insightMonth}.`,
            date: file.modifiedTime,
            docId: file.id,
            type: insightType,
            metrics: [
              { name: "Performance", value: "+10%" },
              { name: "Growth", value: "15%" },
              { name: "Retention", value: "92%" }
            ],
            embedUrl: file.embedLink || `https://docs.google.com/document/d/e/${file.id}/pub?embedded=true`,
            webViewLink: file.webViewLink
          };
        });
        
        insightDocuments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setInsights(insightDocuments);
        
        if (insightDocuments.length > 0) {
          setSelectedDocument(insightDocuments[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError("Failed to load insights. Please try again later.");
        setIsLoading(false);
        toast.error("Failed to load insights", {
          description: "There was an error retrieving your insights documents."
        });
      }
    };
    
    fetchInsights();
  }, [clientId]);
  
  const filteredInsights = insights.filter(insight => {
    const matchesSearch = 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.month.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || insight.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleDownload = (doc) => {
    window.open(doc.webViewLink, '_blank');
    toast.success("Download started", {
      description: `${doc.title} is being downloaded`
    });
  };

  const handleOpenInDrive = (doc) => {
    window.open(doc.webViewLink, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Latest Insights</h1>
            <p className="text-muted-foreground">
              Your regular performance snapshots and strategic recommendations from Revify. (Updated Monthly)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Archive size={16} />
              Archive
            </Button>
            <Button size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule Review
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recent" value={selectedTab} onValueChange={setSelectedTab}>
          <Card>
            <CardHeader className="pb-3">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="recent">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Insights
                </TabsTrigger>
                <TabsTrigger value="performance">
                  <BarChart className="h-4 w-4 mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="library">
                  <FileText className="h-4 w-4 mr-2" />
                  Document Library
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="p-0">
              <TabsContent value="recent" className="m-0 p-6 space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Loading insights...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <p className="text-muted-foreground mb-4">Please try again or contact support if the problem persists.</p>
                    <Button onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                ) : insights.length === 0 ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="font-medium mb-2">No insights available yet</p>
                    <p className="text-muted-foreground">Your first insight will appear here once it's ready.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Current Monthly Insight
                      </h2>
                      {selectedDocument ? (
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle>{selectedDocument.title}</CardTitle>
                                <CardDescription>
                                  {selectedDocument.month} - {new Date(selectedDocument.date).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">{selectedDocument.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                              {selectedDocument.summary}
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              {selectedDocument.metrics.map((metric, index) => (
                                <div key={index} className="bg-muted/50 p-3 rounded-lg text-center">
                                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                                  <p className="text-lg font-bold">{metric.value}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleDownload(selectedDocument)}
                              >
                                <Download size={14} />
                                Download
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleOpenInDrive(selectedDocument)}
                              >
                                <ExternalLink size={14} />
                                Open in Drive
                              </Button>
                              <Button size="sm" variant="ghost" className="gap-1">
                                <Bookmark size={14} />
                                Save
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="p-6 text-center">
                          <AlertTriangle className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                          <p className="mb-2">Unable to display the latest insight preview.</p>
                          <p className="text-sm text-muted-foreground mb-4">You can try opening it directly in Google Drive or downloading it.</p>
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                              <ExternalLink size={14} className="mr-2" />
                              Open in Google Drive
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                              <Download size={14} className="mr-2" />
                              Download
                            </Button>
                          </div>
                        </Card>
                      )}
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden h-[450px]">
                      {selectedDocument ? (
                        <iframe 
                          src={selectedDocument.embedUrl} 
                          width="100%" 
                          height="450px" 
                          title={selectedDocument.title}
                          className="border-0"
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-muted/10">
                          <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                          <p className="text-lg font-medium mb-2">Unable to display document preview</p>
                          <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                            This could be due to permissions issues or the document may have been deleted.
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                              <ExternalLink size={14} className="mr-1" />
                              Open in Drive
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {!isLoading && !error && insights.length > 0 && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Previous Insights
                      </h2>
                      <div className="flex gap-2">
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search insights..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-[130px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="strategy">Strategy</SelectItem>
                            <SelectItem value="analysis">Analysis</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {filteredInsights.length > 0 ? (
                        filteredInsights.map((insight) => (
                          <Card 
                            key={insight.id} 
                            className={`hover:border-primary/40 transition-colors cursor-pointer ${selectedDocument?.id === insight.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedDocument(insight)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                                  <CardDescription>{insight.month}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{insight.type}</Badge>
                                  <div className="bg-muted px-2 py-1 rounded text-xs">
                                    {new Date(insight.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <p className="text-sm text-muted-foreground">
                                {insight.summary}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(insight);
                                }}
                              >
                                <FileDown size={14} />
                                Download
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenInDrive(insight);
                                }}
                              >
                                <ExternalLink size={14} />
                                Open in Drive
                              </Button>
                              <Button variant="ghost" size="sm" className="ml-auto gap-1">
                                <FileText size={14} />
                                View Document
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-muted/20 rounded-lg">
                          <p className="text-muted-foreground">No insights match your search criteria</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="performance" className="m-0 p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Loading performance data...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-5 w-5 text-primary" />
                          <CardTitle>Performance Overview</CardTitle>
                        </div>
                        <CardDescription>Key metrics over the last 6 months</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <LineChart
                          data={performanceData}
                          categories={["value", "target"]}
                          index="name"
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="grid gap-6 sm:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <CardTitle className="text-base">Revenue Growth</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">15.4%</div>
                          <p className="text-sm text-muted-foreground">+2.3% from last month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <CardTitle className="text-base">Customer Retention</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">92%</div>
                          <p className="text-sm text-muted-foreground">+1.2% from last month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-purple-500" />
                            <CardTitle className="text-base">Market Share</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">23%</div>
                          <p className="text-sm text-muted-foreground">+0.8% from last month</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="library" className="m-0 p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Loading document library...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                    <p className="text-destructive font-medium mb-2">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Document Library</h2>
                      <div className="flex items-center gap-2">
                        <div className="relative w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search documents..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-[130px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="strategy">Strategy</SelectItem>
                            <SelectItem value="analysis">Analysis</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredInsights.length > 0 ? (
                        filteredInsights.map((doc) => (
                          <Card key={doc.id} className="hover:border-primary/40 transition-colors">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{doc.title}</CardTitle>
                                <Badge variant="outline">{doc.type}</Badge>
                              </div>
                              <CardDescription>{doc.month}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {doc.summary}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1"
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <FileText size={14} />
                                Open
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="gap-1 ml-auto"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download size={14} />
                                Download
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 bg-muted/20 rounded-lg">
                          <p className="text-muted-foreground">No documents match your search criteria</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
