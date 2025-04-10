
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  Clock, 
  BarChart2, 
  Target, 
  ArrowRight, 
  Download,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DiagnosticReviewsPage = () => {
  const [activeTab, setActiveTab] = useState("strategy");
  
  // Sample diagnostic reviews
  const diagnosticReviews = [
    {
      id: "1",
      title: "Q2 2023 Strategic Diagnostic",
      date: "2023-06-15",
      status: "completed",
      documentUrl: "#",
      recommendations: 5,
      kpis: 8
    },
    {
      id: "2",
      title: "Annual Business Review",
      date: "2023-01-10",
      status: "completed",
      documentUrl: "#",
      recommendations: 12,
      kpis: 15
    },
    {
      id: "3",
      title: "Market Positioning Analysis",
      date: "2022-09-22",
      status: "completed",
      documentUrl: "#",
      recommendations: 7,
      kpis: 6
    }
  ];
  
  // Sample KPIs
  const kpis = [
    { name: "Revenue Growth", target: "15%", current: "12%", status: "warning" },
    { name: "Customer Acquisition", target: "500", current: "485", status: "warning" },
    { name: "Retention Rate", target: "85%", current: "88%", status: "success" },
    { name: "Average Order Value", target: "$150", current: "$165", status: "success" },
    { name: "Market Share", target: "12%", current: "11%", status: "warning" }
  ];
  
  // Sample strategic recommendations
  const strategicRecommendations = [
    { 
      id: "1", 
      title: "Expand Digital Marketing Channels", 
      impact: "high", 
      complexity: "medium",
      timeframe: "Q3 2023"
    },
    { 
      id: "2", 
      title: "Implement Customer Loyalty Program", 
      impact: "high", 
      complexity: "high",
      timeframe: "Q4 2023"
    },
    { 
      id: "3", 
      title: "Optimize Supply Chain Operations", 
      impact: "medium", 
      complexity: "high",
      timeframe: "Q2-Q3 2023"
    },
    { 
      id: "4", 
      title: "Refine Pricing Strategy", 
      impact: "high", 
      complexity: "low",
      timeframe: "Q3 2023"
    }
  ];
  
  // Impact color mapping
  const getImpactColor = (impact: string) => {
    switch(impact) {
      case "high": return "bg-green-100 text-green-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Complexity color mapping
  const getComplexityColor = (complexity: string) => {
    switch(complexity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diagnostic Reviews</h1>
            <p className="text-muted-foreground">
              Strategic assessments and performance analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule Review
            </Button>
            <Button size="sm" className="gap-2">
              <FileText size={16} />
              Request Report
            </Button>
          </div>
        </div>

        {/* Latest Diagnostic Review */}
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>Latest Diagnostic Review</CardTitle>
                <CardDescription>Q2 2023 Strategic Diagnostic</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 self-start">
                Completed June 15, 2023
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                <Target className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-lg">5</h3>
                <p className="text-sm text-muted-foreground text-center">Strategic Recommendations</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                <BarChart2 className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-lg">8</h3>
                <p className="text-sm text-muted-foreground text-center">Key Performance Indicators</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-lg">Q3 2023</h3>
                <p className="text-sm text-muted-foreground text-center">Next Review Date</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Review includes SWOT analysis, market positioning, and growth strategy
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink size={14} />
                View Document
              </Button>
              <Button size="sm" className="gap-2">
                <Download size={14} />
                Download PDF
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Strategic Insights Tabs */}
        <Tabs defaultValue="strategy" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="strategy">Strategic Recommendations</TabsTrigger>
            <TabsTrigger value="kpis">Key Performance Indicators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategy" className="space-y-4">
            {strategicRecommendations.map((recommendation) => (
              <Card key={recommendation.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(recommendation.impact)}`}>
                      Impact: {recommendation.impact}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(recommendation.complexity)}`}>
                      Complexity: {recommendation.complexity}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Timeframe: {recommendation.timeframe}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="kpis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Current vs target KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {kpis.map((kpi, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{kpi.name}</h3>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>Target: {kpi.target}</span>
                          <span>•</span>
                          <span>Current: {kpi.current}</span>
                        </div>
                      </div>
                      <Badge variant={kpi.status === "success" ? "default" : "outline"} 
                        className={kpi.status === "success" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>
                        {kpi.status === "success" ? "On Track" : "Needs Attention"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Previous Reviews */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Previous Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {diagnosticReviews.slice(1).map((review) => (
              <Card key={review.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{review.recommendations} recommendations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart2 className="h-4 w-4" />
                      <span>{review.kpis} KPIs</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <FileText size={14} />
                    View Report
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" className="gap-2">
              View All Reviews
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DiagnosticReviewsPage;
