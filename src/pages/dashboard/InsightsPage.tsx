
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart } from "@/components/ui/charts/LineChart";
import { CalendarDays, FileText, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const InsightsPage = () => {
  // Sample data for the insights chart
  const monthlyData = [
    { name: "Jan", value: 53 },
    { name: "Feb", value: 65 },
    { name: "Mar", value: 75 },
    { name: "Apr", value: 81 },
    { name: "May", value: 72 },
    { name: "Jun", value: 85 },
  ];

  // Sample monthly insights
  const monthlyInsights = [
    {
      id: "1",
      month: "June 2023",
      title: "Q2 Performance Analysis",
      summary: "Key findings from Q2 performance data with strategic recommendations.",
      date: "2023-06-28",
      docId: "1A2B3C4D5E6F"
    },
    {
      id: "2",
      month: "May 2023",
      title: "Market Penetration Strategy",
      summary: "Analysis of current market position and opportunities for growth.",
      date: "2023-05-15",
      docId: "7G8H9I10J11K"
    },
    {
      id: "3",
      month: "April 2023",
      title: "Customer Retention Insights",
      summary: "Deep dive into customer retention metrics and suggested improvements.",
      date: "2023-04-10",
      docId: "12L13M14N15O"
    },
  ];

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

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart
              data={monthlyData}
              categories={["value"]}
              index="name"
            />
          </CardContent>
        </Card>

        {/* Monthly Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Monthly Insight Documents</h2>
          
          {monthlyInsights.map((insight) => (
            <Card key={insight.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{insight.title}</CardTitle>
                    <CardDescription>{insight.month}</CardDescription>
                  </div>
                  <div className="bg-muted px-2 py-1 rounded text-xs">
                    {new Date(insight.date).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  {insight.summary}
                </p>
              </CardContent>
              <div className="px-6 pb-4 pt-0">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <FileText size={16} />
                  Open Document
                </Button>
              </div>
            </Card>
          ))}
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="gap-2">
              View All Insights
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
