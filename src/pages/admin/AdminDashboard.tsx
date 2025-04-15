
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, UserPlus, CheckCircle, FileUp, ArrowUpRight } from "lucide-react";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";

const AdminDashboard = () => {
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
            <Card className="standard-card">
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

            <Card className="standard-card">
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

            <Card className="standard-card">
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

        <Card className="standard-card">
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
            <div className="mt-4">
              <Button variant="outline" size="sm">View All Files</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="standard-card">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">New client onboarded</p>
                  <p className="text-sm text-muted-foreground">Acme Inc.</p>
                </div>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Subscription updated</p>
                  <p className="text-sm text-muted-foreground">TechSolutions LLC</p>
                </div>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">File uploaded</p>
                  <p className="text-sm text-muted-foreground">Global Partners Co.</p>
                </div>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
              <div className="flex items-center justify-between py-2">
                <Button variant="link" className="p-0">View all activities</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
