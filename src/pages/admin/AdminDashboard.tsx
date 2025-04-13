
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [testEmail, setTestEmail] = useState('');
  const [testCompanyName, setTestCompanyName] = useState('');
  const [isCreatingDrive, setIsCreatingDrive] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

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
    
    // Set up an interval to refresh the logs every 5 seconds
    const intervalId = setInterval(() => {
      setRefreshCounter(prev => prev + 1);
    }, 5000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [refreshCounter]);

  const createTestDrive = async () => {
    if (!testEmail || !testCompanyName) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and company name",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingDrive(true);
    try {
      // Log what we're about to do
      console.log("Invoking create-google-drive function with:", {
        userEmail: testEmail,
        companyName: testCompanyName
      });
      
      const { data, error } = await supabase.functions.invoke('create-google-drive', {
        body: {
          userEmail: testEmail,
          companyName: testCompanyName
        }
      });

      console.log("Function response:", data, error);
      
      if (error) throw error;

      if (data && data.success) {
        toast({
          title: "Success",
          description: data.message || "Google Drive created successfully",
          variant: "default"
        });

        // Refresh the logs immediately
        setRefreshCounter(prev => prev + 1);
      } else {
        throw new Error(data?.error || 'Failed to create drive');
      }
    } catch (error) {
      console.error("Error creating drive:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create Google Drive",
        variant: "destructive"
      });
    } finally {
      setIsCreatingDrive(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Integration</CardTitle>
        <CardDescription>Create and manage shared Google Drives for clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Drive Creation</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Email</Label>
              <Input 
                id="testEmail" 
                placeholder="user@example.com" 
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="testCompanyName">Company Name</Label>
              <Input 
                id="testCompanyName" 
                placeholder="Acme Inc" 
                value={testCompanyName}
                onChange={(e) => setTestCompanyName(e.target.value)}
              />
            </div>
            <Button 
              onClick={createTestDrive} 
              disabled={isCreatingDrive}
              className="w-full"
            >
              {isCreatingDrive ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : "Create Test Drive"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Drive Creation Logs</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRefreshCounter(prev => prev + 1)}
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system statistics and user activities.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <ConsultingTierBox
            tier="Elite"
            description="Administrator access with all platform capabilities"
            benefits={tierBenefits}
            isEditable={true}
            onChange={handleTierChange}
          />

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
