
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, PieChart, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";

const InsightsPage = () => {
  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Insights</h1>
          <p className="text-muted-foreground mt-2">
            View your latest data insights and analytics
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <BarChart2 className="mr-2" size={20} />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your insights will appear here once data is processed
              </p>
            </CardContent>
          </Card>
          
          {/* Key Metrics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Activity className="mr-2" size={20} />
                Key Metrics
              </CardTitle>
              <CardDescription>
                Most important performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your key metrics will appear here
              </p>
            </CardContent>
          </Card>
          
          {/* Trend Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <TrendingUp className="mr-2" size={20} />
                Trend Analysis
              </CardTitle>
              <CardDescription>
                Performance trends over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your trend analysis will appear here
              </p>
            </CardContent>
          </Card>
          
          {/* Analytics Overview */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <PieChart className="mr-2" size={20} />
                Data Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of your data by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your data distribution chart will appear here
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default InsightsPage;
