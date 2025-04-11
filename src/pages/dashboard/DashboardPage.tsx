
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { useAuth } from "@/contexts/auth-context";

const DashboardPage = () => {
  const { state } = useAuth();
  const user = state.user;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your progress and recommended actions.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <ProgressOverview />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <QuickActions />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <OnboardingChecklist />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
