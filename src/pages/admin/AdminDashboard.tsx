
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Users, UserPlus, CheckCircle, FileUp, ArrowUpRight } from "lucide-react";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";
import { BarChart } from "@/components/ui/charts/BarChart";
import { LineChart } from "@/components/ui/charts/LineChart";

interface GoogleDriveLog {
  id: string;
  user_email: string;
  company_name: string;
  status: string;
  drive_id?: string;
  error_message?: string;
  created_at: string;
}

const GoogleDriveIntegration = () => {
  const [logs, setLogs] = useState<GoogleDriveLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleDriveLogs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('google_drive_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setLogs(data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch Google Drive logs",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleDriveLogs();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Integration</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Drive Creation Logs</h3>
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No logs found</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`
                      p-3 rounded 
                      ${log.status === 'success' ? 'bg-green-50' : 'bg-red-50'}
                    `}
                  >
                    <div>
                      <strong>Email:</strong> {log.user_email}
                    </div>
                    <div>
                      <strong>Company:</strong> {log.company_name}
                    </div>
                    <div>
                      <strong>Status:</strong> {log.status}
                    </div>
                    {log.drive_id && (
                      <div>
                        <strong>Drive ID:</strong> {log.drive_id}
                      </div>
                    )}
                    {log.error_message && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {log.error_message}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  // Mock data for the charts
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

  // Mock data for the tier box
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system statistics and user activities.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Admin consulting tier */}
          <ConsultingTierBox
            tier="Elite"
            description="Administrator access with all platform capabilities"
            benefits={tierBenefits}
            isEditable={true}
            onChange={handleTierChange}
          />

          {/* Stats Cards - 3 columns layout */}
          <div className="col-span-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
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

            <Card>
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

            <Card>
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

        {/* Files card */}
        <Card>
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

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Daily active users over the past week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart
                data={userActivityData}
                categories={["value"]}
                index="name"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>
                New and completed onboardings by week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart
                data={onboardingData}
                categories={["completed", "new"]}
                index="name"
              />
            </CardContent>
          </Card>
        </div>

        <GoogleDriveIntegration />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
