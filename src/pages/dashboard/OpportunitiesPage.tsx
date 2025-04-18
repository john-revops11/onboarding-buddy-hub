import React, { useState } from "react";
import { useInsights } from "@/hooks/use-client-insights";
import { useClientOpportunities } from "@/hooks/use-client-opportunities";
import { Main } from "@/components/ui/main";
import { InsightPreview } from "@/components/insights/InsightPreview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Alert,
  AlertCircle,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [documentFilter, setDocumentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: insights = [], isLoading: isLoadingInsights } = useInsights();
  const { data: opportunities = [], isLoading: isLoadingOpportunities } = useClientOpportunities();
  
  const formatCurrency = (value: number) => {
    if (value >= 1) {
      return `$${value.toFixed(2)}M`;
    } else {
      return `$${(value * 1000).toFixed(0)}K`;
    }
  };

  const currentInsight = insights.find(insight => insight.is_current) || insights[0];
  const previousInsights = currentInsight 
    ? insights.filter(insight => insight.id !== currentInsight.id)
    : [];

  const totalOpportunityValue = opportunities.reduce(
    (sum, opp) => sum + Number(opp.total_annual_opportunity),
    0
  );

  const totalTargetValue = opportunities.reduce(
    (sum, opp) => sum + Number(opp.target_opportunity),
    0
  );

  return (
    <Main>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Opportunities & Actions
          </h1>
          <p className="text-muted-foreground">
            Review key strategic opportunities identified by Revify and access
            related diagnostic reports and presentations.
          </p>
        </div>

        <div className="grid gap-5">
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Consulting Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-primary/20 rounded-lg p-4 flex items-center justify-between bg-white">
                <div>
                  <p className="font-medium">Elite Consulting Tier</p>
                  <p className="text-sm text-muted-foreground">
                    Premium access to all Revify services and features
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Benefits
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Top Opportunities</CardTitle>
              <CardDescription>
                Review key strategic opportunities identified by Revify and
                access related diagnostic reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="opportunities"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="opportunities">
                    Opportunities Summary
                  </TabsTrigger>
                  <TabsTrigger value="documents">Document Library</TabsTrigger>
                </TabsList>

                <TabsContent value="opportunities">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Key Strategic Opportunities Summary
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        A structured overview of the most impactful areas for
                        improvement, targets, and potential value, as defined
                        during major Revify reviews. This table is updated
                        periodically by your Revify team following strategic
                        sessions.
                      </p>
                    </div>

                    {isLoadingOpportunities ? (
                      <p>Loading opportunities...</p>
                    ) : opportunities.length > 0 ? (
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
                                        <Info
                                          size={14}
                                          className="ml-1 text-muted-foreground cursor-help"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Estimated total size of the prize if
                                        fully realized
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
                                        <Info
                                          size={14}
                                          className="ml-1 text-muted-foreground cursor-help"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Estimated value tied to achieving the
                                        defined Target Level
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
                                <TableCell className="font-medium">
                                  {opportunity.area}
                                </TableCell>
                                <TableCell>{opportunity.description}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    Number(opportunity.total_annual_opportunity)
                                  )}
                                </TableCell>
                                <TableCell>
                                  {opportunity.current_level}
                                </TableCell>
                                <TableCell>{opportunity.target_level}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    Number(opportunity.target_opportunity)
                                  )}
                                </TableCell>
                                <TableCell>
                                  {opportunity.tracking_dashboard}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell
                                colSpan={2}
                                className="font-bold text-right"
                              >
                                Total
                              </TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(totalOpportunityValue)}
                              </TableCell>
                              <TableCell colSpan={2}></TableCell>
                              <TableCell className="text-right font-bold">
                                {formatCurrency(totalTargetValue)}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">
                          Key strategic opportunities and targets will be
                          populated here by your Revify team following
                          diagnostic reviews.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Diagnostic Reports & Presentations
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access all strategic assessments, performance reviews,
                        workshop outputs, and other key documents prepared by
                        Revify.
                      </p>
                    </div>

                    {isLoadingInsights ? (
                      <p>Loading insights...</p>
                    ) : currentInsight ? (
                      <InsightPreview insight={currentInsight} />
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No insights available.</AlertTitle>
                        <AlertDescription>
                          Please check back later.
                        </AlertDescription>
                      </Alert>
                    )}

                    {previousInsights.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                          Previous Insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {previousInsights.map((insight) => (
                            <Card key={insight.id}>
                              <CardHeader>
                                <CardTitle className="text-base">
                                  {insight.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={insight.download_url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Download
                                  </a>
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Client Presentations Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Client Presentations</CardTitle>
              <CardDescription>
                Access your strategic recommendations and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock presentation data - replace with actual data source */}
                {[
                  {
                    id: 1,
                    title: "Q1 2025 Strategy Review",
                    date: "2025-03-15",
                    link: "https://example.com/presentation1",
                  },
                  {
                    id: 2,
                    title: "Implementation Roadmap",
                    date: "2025-03-01",
                    link: "https://example.com/presentation2",
                  },
                ].map((presentation) => (
                  <div
                    key={presentation.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-primary/10 rounded">
                        <FileText size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{presentation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {presentation.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={presentation.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
    </Main>
  );
}
