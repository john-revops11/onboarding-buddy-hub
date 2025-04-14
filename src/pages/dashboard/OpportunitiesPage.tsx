
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, TrendingUp, Award, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const OpportunitiesPage = () => {
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
            Discover your highest value opportunities
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Target className="mr-2" size={20} />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your growth opportunities will appear here once data is analyzed
              </p>
            </CardContent>
          </Card>
          
          {/* Quick Wins Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <ArrowUpRight className="mr-2" size={20} />
                Quick Wins
              </CardTitle>
              <CardDescription>
                Short-term opportunities with high impact
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your quick wins will appear here
              </p>
            </CardContent>
          </Card>
          
          {/* Long-term Initiatives Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <TrendingUp className="mr-2" size={20} />
                Long-term Initiatives
              </CardTitle>
              <CardDescription>
                Strategic initiatives for sustainable growth
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your long-term initiatives will appear here
              </p>
            </CardContent>
          </Card>
          
          {/* Performance Highlights Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Award className="mr-2" size={20} />
                Performance Highlights
              </CardTitle>
              <CardDescription>
                Areas where you're excelling
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your performance highlights will appear here
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
