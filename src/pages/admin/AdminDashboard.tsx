
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, UserPlus, CheckCircle, FileUp, ArrowUpRight } from "lucide-react";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";
import { BarChart } from "@/components/ui/charts/BarChart";
import { LineChart } from "@/components/ui/charts/LineChart";

const AdminDashboard = () => {
  const userActivityData = [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 18 },
    { name: "Wed", value: 15 },
    { name: "Thu", value: 22 },
    { name: "Fri", value: 30 },
    { name: "Sat", value: 10 },
    { name: "Sun", value: 5 },
  ];

  const onboardingData = [
    { name: "Week 1", completed: 12, new: 21 },
    { name: "Week 2", completed: 18, new: 15 },
    { name: "Week 3", completed: 24, new: 19 },
    { name: "Week 4", completed: 32, new: 22 },
  ];

  const tierBenefits = [
    "Priority access to support",
    "Custom reporting dashboards",
    "24/7 emergency response",
    "Quarterly strategy sessions",
    "Custom training sessions"
  ];

  const handleTierChange = (newTier: string) => {
    console.log(`Tier changed to: ${newTier}`);
    // In a real app, you would call an API to update the tier
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system statistics and user activities.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          <ConsultingTierBox
            tier="Elite"
            description="Administrator access with all platform capabilities"
            benefits={tierBenefits}
            isEditable={true}
            onChange={handleTierChange}
          />

          <div className="col-span-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">246</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    12%
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  New Sign-ups
                </CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    8%
                  </span>
                  from last week
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Onboardings
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    24%
                  </span>
                  completion rate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reduced space by placing this in the continuous layout flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="md:col-span-1 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Files Uploaded
              </CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">862</div>
              <p className="text-xs text-muted-foreground">
                Total uploads this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Daily active users over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <BarChart
                data={userActivityData}
                categories={["value"]}
                index="name"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
            <CardDescription>
              New and completed onboardings by week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <LineChart
              data={onboardingData}
              categories={["completed", "new"]}
              index="name"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
