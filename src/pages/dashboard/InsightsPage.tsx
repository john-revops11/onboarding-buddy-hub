
import React, { useState } from "react";
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
  Bookmark
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

// Sample data for insights over time
const performanceData = [
  { name: "Jan", value: 53, target: 50 },
  { name: "Feb", value: 65, target: 55 },
  { name: "Mar", value: 75, target: 60 },
  { name: "Apr", value: 81, target: 65 },
  { name: "May", value: 72, target: 70 },
  { name: "Jun", value: 85, target: 75 },
];

// Sample monthly insights documents with more details
const monthlyInsights = [
  {
    id: "1",
    month: "June 2023",
    title: "Q2 Performance Analysis",
    summary: "Key findings from Q2 performance data with strategic recommendations for growth opportunities and market positioning.",
    date: "2023-06-28",
    docId: "1A2B3C4D5E6F",
    type: "quarterly",
    metrics: [
      { name: "Revenue Growth", value: "+15%" },
      { name: "Customer Retention", value: "92%" },
      { name: "Market Share", value: "23%" }
    ],
    embedUrl: "https://docs.google.com/document/d/e/2PACX-sample-embed-url-1/pub?embedded=true"
  },
  {
    id: "2",
    month: "May 2023",
    title: "Market Penetration Strategy",
    summary: "Analysis of current market position and opportunities for growth in emerging sectors. Includes competitive analysis and recommendations.",
    date: "2023-05-15",
    docId: "7G8H9I10J11K",
    type: "strategy",
    metrics: [
      { name: "TAM Growth", value: "+8%" },
      { name: "Competitor Analysis", value: "Complete" },
      { name: "Opportunity Score", value: "78/100" }
    ],
    embedUrl: "https://docs.google.com/document/d/e/2PACX-sample-embed-url-2/pub?embedded=true"
  },
  {
    id: "3",
    month: "April 2023",
    title: "Customer Retention Insights",
    summary: "Deep dive into customer retention metrics and suggested improvements based on churn analysis and customer feedback surveys.",
    date: "2023-04-10",
    docId: "12L13M14N15O",
    type: "analysis",
    metrics: [
      { name: "Churn Rate", value: "4.3%" },
      { name: "NPS Score", value: "62" },
      { name: "Repeat Purchase", value: "76%" }
    ],
    embedUrl: "https://docs.google.com/document/d/e/2PACX-sample-embed-url-3/pub?embedded=true"
  },
  {
    id: "4",
    month: "March 2023",
    title: "Q1 Financial Analysis",
    summary: "Comprehensive review of Q1 financial performance with forecasts for the remainder of the fiscal year.",
    date: "2023-03-18",
    docId: "16P17Q18R19S",
    type: "quarterly",
    metrics: [
      { name: "Revenue", value: "$2.4M" },
      { name: "Profit Margin", value: "18%" },
      { name: "Cost Reduction", value: "9%" }
    ],
    embedUrl: "https://docs.google.com/document/d/e/2PACX-sample-embed-url-4/pub?embedded=true"
  },
];

const InsightsPage = () => {
  const [selectedTab, setSelectedTab] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(monthlyInsights[0]);
  
  // Filter insights based on search and type
  const filteredInsights = monthlyInsights.filter(insight => {
    const matchesSearch = 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.month.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || insight.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Latest Insights</h1>
            <p className="text-muted-foreground">
              Monthly analysis and strategic recommendations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarDays size={16} />
              Archive
            </Button>
            <Button size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule Review
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Card>
          <CardHeader className="pb-3">
            <Tabs defaultValue="recent" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="recent">Recent Insights</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="library">Document Library</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value="recent" className="m-0 p-6 space-y-6">
              {/* Featured Insight with Embedded Document */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Featured Insight</h2>
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
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download size={14} />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
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
                </div>
                
                <div className="border rounded-lg overflow-hidden h-[450px]">
                  <iframe 
                    src={selectedDocument.embedUrl} 
                    width="100%" 
                    height="450px" 
                    title={selectedDocument.title}
                    className="border-0"
                  ></iframe>
                </div>
              </div>
              
              {/* Recent Insights List */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <h2 className="text-xl font-semibold">Recent Insights</h2>
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
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredInsights.map((insight) => (
                    <Card 
                      key={insight.id} 
                      className={`hover:border-primary/40 transition-colors cursor-pointer ${selectedDocument.id === insight.id ? 'border-primary' : ''}`}
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
                        <Button variant="ghost" size="sm" className="ml-auto gap-1">
                          <FileText size={14} />
                          View Document
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {filteredInsights.length === 0 && (
                    <div className="text-center py-8 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">No insights match your search criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="m-0 p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
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
                      <CardTitle className="text-base">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">15.4%</div>
                      <p className="text-sm text-muted-foreground">+2.3% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Customer Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">92%</div>
                      <p className="text-sm text-muted-foreground">+1.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Market Share</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">23%</div>
                      <p className="text-sm text-muted-foreground">+0.8% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="library" className="m-0 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Document Library</h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documents..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {monthlyInsights.map((doc) => (
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
                      <Button variant="ghost" size="sm" className="gap-1">
                        <FileText size={14} />
                        Open
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 ml-auto">
                        <Download size={14} />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
