
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, UserPlus, CheckCircle, FileUp, ArrowUpRight, Info, BarChart3, FileCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
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
        <div className="mb-2 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of system statistics and user activities.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <ConsultingTierBox
            tier="Elite"
            description="Administrator access with all platform capabilities"
            benefits={tierBenefits}
            isEditable={true}
            onChange={handleTierChange}
          />

          <div className="col-span-2 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-sm border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-primary-600" />
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
              <CardFooter className="pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">More info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Total registered users across all client organizations</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>

            <Card className="bg-white shadow-sm border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  New Sign-ups
                </CardTitle>
                <UserPlus className="h-4 w-4 text-primary-600" />
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
              <CardFooter className="pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">More info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">New user registrations in the last 30 days</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>

            <Card className="bg-white shadow-sm border-gray-200 transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Onboardings
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-primary-600" />
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
              <CardFooter className="pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">More info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Users who have completed all onboarding steps</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="bg-white shadow-sm border-gray-200 transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Files Uploaded
              </CardTitle>
              <FileUp className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">862</div>
              <p className="text-xs text-muted-foreground">
                Total uploads this month
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300"
                onClick={() => navigate('/admin/files')}
              >
                View All Files
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 bg-white shadow-sm border-gray-200 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest activities across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-3 border-b hover:bg-gray-50 px-2 rounded-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">New client onboarded</p>
                      <p className="text-sm text-muted-foreground">Acme Inc.</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b hover:bg-gray-50 px-2 rounded-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Subscription updated</p>
                      <p className="text-sm text-muted-foreground">TechSolutions LLC</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b hover:bg-gray-50 px-2 rounded-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <FileUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">File uploaded</p>
                      <p className="text-sm text-muted-foreground">Global Partners Co.</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Account activated</p>
                      <p className="text-sm text-muted-foreground">NextGen Innovations</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-center">
              <Button variant="link" className="text-primary-600 hover:text-primary-800">View all activities</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
