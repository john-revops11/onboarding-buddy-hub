
import React, { useState } from "react";
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
} from "lucide-react";

// Sample diagnostic reviews data
const diagnosticReviews = [
  {
    id: "dr1",
    title: "Initial Business Assessment",
    date: "2023-10-15",
    type: "Initial Assessment",
    summary: "Comprehensive review of business operations, market position, and growth opportunities.",
    driveUrl: "https://docs.google.com/document/d/example1",
    embedUrl: "https://docs.google.com/document/d/e/example1/pub?embedded=true",
    insights: [
      "Customer acquisition cost is 15% above industry average",
      "Product-market fit validation shows strong alignment",
      "Competitor analysis reveals 3 key differentiation opportunities"
    ]
  },
  {
    id: "dr2",
    title: "Q4 2023 Performance Analysis",
    date: "2023-12-20",
    type: "Quarterly Review",
    summary: "Analysis of Q4 performance metrics, achievement of KPIs, and recommendations for Q1 2024.",
    driveUrl: "https://docs.google.com/document/d/example2",
    embedUrl: "https://docs.google.com/document/d/e/example2/pub?embedded=true",
    insights: [
      "Revenue growth of 22% year-over-year",
      "Customer retention improved by 8%",
      "Product usage metrics indicate expansion opportunity"
    ]
  },
  {
    id: "dr3",
    title: "Annual Strategy Workshop Results",
    date: "2024-01-25",
    type: "Strategy",
    summary: "Outcomes from annual strategy workshop, including long-term goals, resource allocation, and action plans.",
    driveUrl: "https://docs.google.com/document/d/example3",
    embedUrl: "https://docs.google.com/document/d/e/example3/pub?embedded=true",
    insights: [
      "Three strategic growth pillars identified",
      "Market expansion plan for Q2-Q3 2024",
      "Product roadmap alignment with customer feedback"
    ]
  },
  {
    id: "dr4",
    title: "Technical Architecture Review",
    date: "2024-02-10",
    type: "Technical",
    summary: "Analysis of current technical infrastructure, scalability considerations, and recommended improvements.",
    driveUrl: "https://docs.google.com/document/d/example4",
    embedUrl: "https://docs.google.com/document/d/e/example4/pub?embedded=true",
    insights: [
      "Current architecture can support 3x user growth",
      "Three critical security enhancements recommended",
      "Data pipeline efficiency improvement opportunities"
    ]
  },
  {
    id: "dr5",
    title: "Market Opportunity Analysis",
    date: "2024-03-05",
    type: "Market Analysis",
    summary: "Deep dive into market trends, emerging opportunities, and competitive landscape analysis.",
    driveUrl: "https://docs.google.com/document/d/example5",
    embedUrl: "https://docs.google.com/document/d/e/example5/pub?embedded=true",
    insights: [
      "Two emerging market segments identified",
      "Competitor consolidation creating strategic opening",
      "Pricing strategy adjustment recommendations"
    ]
  },
];

const DiagnosticReviewsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReview, setSelectedReview] = useState(diagnosticReviews[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Filter the reviews based on search and type
  const filteredReviews = diagnosticReviews.filter(review => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || review.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

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
                          selectedReview.id === review.id
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

                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Key Insights:</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {selectedReview.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
                
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DiagnosticReviewsPage;
