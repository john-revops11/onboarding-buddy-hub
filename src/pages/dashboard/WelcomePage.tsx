
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import { DataHealthCheck } from "@/components/dashboard/DataHealthCheck";
import { UploadSchedule } from "@/components/dashboard/UploadSchedule";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const WelcomePage = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const user = state.user;
  
  // Mock service tier data (in a real app, this would come from the API)
  const [serviceTier, setServiceTier] = useState({
    name: "Elite",
    description: "Access to all Elite features of the Revify analytics platform.",
    consultingAddOn: "4 Hours/Month Retainer",
    consultingDescription: "Dedicated monthly consulting hours for strategic support."
  });
  
  // Mock health check report (in a real app, this would come from the API)
  const [healthCheckReport, setHealthCheckReport] = useState({
    id: "latest-report",
    name: "Data Health Check - April 2025",
    webViewLink: "https://docs.google.com/document/d/1abc123",
    modifiedTime: "2025-04-05T12:00:00Z"
  });

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <WelcomeBanner userName={user?.name || "Client"} daysActive={1} />
        
        {/* Onboarding Checklist */}
        <OnboardingChecklist clientName={user?.name || "Client"} />
        
        {/* Service Tier Information */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Service Tier</CardTitle>
                <Badge 
                  variant="outline" 
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                >
                  {serviceTier.name}
                </Badge>
              </div>
              <CardDescription>
                Your Revify platform subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Platform Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {serviceTier.description}
                </p>
                <Button 
                  variant="link" 
                  className="px-0 text-primary flex items-center gap-1 mt-2" 
                  asChild
                >
                  <a href="https://revify.com/features" target="_blank" rel="noopener noreferrer">
                    View Platform Features <ExternalLink size={14} />
                  </a>
                </Button>
              </div>
              
              <div className="pt-2 border-t">
                <h3 className="font-medium">Consulting Add-On</h3>
                <p className="text-sm font-medium text-primary mt-1">
                  {serviceTier.consultingAddOn}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {serviceTier.consultingDescription}
                </p>
                <Button 
                  variant="link" 
                  className="px-0 text-primary flex items-center gap-1 mt-2" 
                  asChild
                >
                  <a href="https://revify.com/consulting" target="_blank" rel="noopener noreferrer">
                    Explore Consulting Options <ExternalLink size={14} />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Data Health Check and Upload Schedule */}
          <div className="space-y-6">
            <DataHealthCheck report={healthCheckReport} />
            <UploadSchedule />
          </div>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Resources and support options to help you get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
        
      </motion.div>
    </DashboardLayout>
  );
};

export default WelcomePage;
