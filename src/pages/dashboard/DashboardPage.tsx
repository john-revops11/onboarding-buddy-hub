
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import OnboardingChecklist from "@/components/dashboard/OnboardingChecklist";
import { useAuth } from "@/contexts/auth-context";
import { isOnboardingComplete, skipOnboarding } from "@/utils/onboardingUtils";
import { DashboardBanner } from "@/components/dashboard/DashboardBanner";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "@/components/ui/UploadIcon";

const DashboardPage = () => {
  const { state } = useAuth();
  const user = state.user;
  const [completedItems, setCompletedItems] = useState(2);
  const [totalItems, setTotalItems] = useState(6);
  
  // Skip onboarding on load
  useEffect(() => {
    if (!isOnboardingComplete()) {
      skipOnboarding();
    }
  }, []);
  
  // Calculate progress percentage
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DashboardLayout>
        <TopBar />
        <div className="p-6 space-y-6">
          <DashboardBanner 
            userName={user?.name || "User"} 
            userRole={user?.role || "Member"}
          />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">Progress Overview</CardTitle>
                <Badge variant="success" className="ml-2">Active</Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <ProgressOverview 
                  progress={progress} 
                  completedItems={completedItems} 
                  totalItems={totalItems} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <QuickActions />
                <div className="mt-4">
                  <Button className="w-full" variant="outline">
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <AnalyticsOverview />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Onboarding Checklist</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <OnboardingChecklist />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default DashboardPage;
