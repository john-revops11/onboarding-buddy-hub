
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart2, 
  TrendingUp, 
  Users,
  PieChart,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InsightsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Insights</h1>
            <p className="text-muted-foreground">
              Detailed performance metrics and insights will be available soon.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading performance data...</span>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <CardTitle>Performance Overview</CardTitle>
                </div>
                <CardDescription>Insights will be displayed here soon</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Performance metrics are currently being prepared. 
                  Check back later for comprehensive insights.
                </p>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-base">Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Metrics pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base">Growth</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Metrics pending</p>
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
                  <div className="text-3xl font-bold">-</div>
                  <p className="text-sm text-muted-foreground">Metrics pending</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
