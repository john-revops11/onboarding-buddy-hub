
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Users, 
  UserPlus, 
  CheckCircle, 
  FileUp, 
  ArrowUpRight, 
  BarChart2, 
  FileText, 
  Settings,
  UserCheck
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { motion } from "framer-motion";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";
import { BarChart } from "@/components/ui/charts/BarChart";
import { LineChart } from "@/components/ui/charts/LineChart";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newSignups: 0,
    completedOnboardings: 0,
    activeClients: 0,
    filesUploaded: 0,
    onboardingCompletionRate: 0
  });
  const [activeUserData, setActiveUserData] = useState([]);
  const [clientGrowthData, setClientGrowthData] = useState([]);
  const [filesUploadedData, setFilesUploadedData] = useState([]);
  const [onboardingData, setOnboardingData] = useState([]);
  
  const tierBenefits = [
    "Priority access to support",
    "Custom reporting dashboards", 
    "24/7 emergency response",
    "Quarterly strategy sessions",
    "Custom training sessions"
  ];

  const handleTierChange = (newTier: string) => {
    console.log(`Tier changed to: ${newTier}`);
  };

  // Fetch real data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, status, role, created_at');
        
        if (usersError) throw usersError;
        
        // Calculate stats from the fetched data
        const totalUsers = usersData?.length || 0;
        
        // Count new signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newSignups = usersData?.filter(user => 
          new Date(user.created_at) > thirtyDaysAgo
        ).length || 0;
        
        // Fetch onboarding data
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, status, onboarding_completed, created_at');
        
        if (clientsError) throw clientsError;
        
        const activeClients = clientsData?.filter(client => 
          client.status === 'active'
        ).length || 0;
        
        const completedOnboardings = clientsData?.filter(client => 
          client.onboarding_completed === true
        ).length || 0;
        
        const onboardingCompletionRate = clientsData?.length 
          ? Math.round((completedOnboardings / clientsData.length) * 100) 
          : 0;
        
        // Fetch files data
        const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('id, uploaded_at');
        
        if (filesError) throw filesError;
        
        const filesUploaded = filesData?.length || 0;
        
        // Update stats state
        setStats({
          totalUsers,
          newSignups,
          completedOnboardings,
          activeClients,
          filesUploaded,
          onboardingCompletionRate
        });
        
        // Create chart data from the real data
        prepareChartData(usersData, clientsData, filesData);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Prepare chart data from fetched data
  const prepareChartData = (usersData, clientsData, filesData) => {
    // Prepare client growth data (last 5 months)
    const clientGrowth = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    for (let i = 4; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[month.getMonth()];
      
      const clientsInMonth = clientsData?.filter(client => {
        const clientDate = new Date(client.created_at);
        return clientDate.getMonth() === month.getMonth() && 
               clientDate.getFullYear() === month.getFullYear();
      }).length || 0;
      
      clientGrowth.push({ name: monthName, value: clientsInMonth });
    }
    setClientGrowthData(clientGrowth);
    
    // Prepare files uploaded data (last 4 weeks)
    const filesUploaded = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      
      const filesInWeek = filesData?.filter(file => {
        const fileDate = new Date(file.uploaded_at);
        return fileDate >= weekStart && fileDate < weekEnd;
      }).length || 0;
      
      filesUploaded.push({ name: `Week ${4-i}`, value: filesInWeek });
    }
    setFilesUploadedData(filesUploaded);
    
    // Prepare user activity data (last 7 days)
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const userActivity = weekdays.map(day => ({ name: day, value: 0 }));
    setActiveUserData(userActivity);
    
    // Prepare onboarding data (last 5 months)
    const onboardingStats = [];
    for (let i = 4; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[month.getMonth()];
      
      const clientsStarted = clientsData?.filter(client => {
        const clientDate = new Date(client.created_at);
        return clientDate.getMonth() === month.getMonth() && 
               clientDate.getFullYear() === month.getFullYear();
      }).length || 0;
      
      const clientsCompleted = clientsData?.filter(client => {
        const clientDate = new Date(client.created_at);
        return clientDate.getMonth() === month.getMonth() && 
               clientDate.getFullYear() === month.getFullYear() &&
               client.onboarding_completed === true;
      }).length || 0;
      
      onboardingStats.push({ 
        name: monthName, 
        started: clientsStarted, 
        completed: clientsCompleted 
      });
    }
    setOnboardingData(onboardingStats);
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of system statistics and user activities.
          </p>
        </div>

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
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    {stats.totalUsers > 0 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="text-green-500 flex items-center">
                          <ArrowUpRight className="h-3 w-3" />
                          {Math.round((stats.newSignups / stats.totalUsers) * 100)}%
                        </span>
                        from last month
                      </p>
                    )}
                  </>
                )}
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.newSignups}</div>
                    {stats.newSignups > 0 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="text-green-500 flex items-center">
                          <ArrowUpRight className="h-3 w-3" />
                          New users
                        </span>
                        from last week
                      </p>
                    )}
                  </>
                )}
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.completedOnboardings}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="text-green-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        {stats.onboardingCompletionRate}%
                      </span>
                      completion rate
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Active Clients</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeClients}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active client accounts
                  </p>
                  <div className="h-[200px] mt-4">
                    {clientGrowthData.length > 0 ? (
                      <BarChart 
                        data={clientGrowthData}
                        categories={["value"]}
                        index="name"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No client data available
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Files Uploaded</CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.filesUploaded}</div>
                  <p className="text-xs text-muted-foreground">
                    Total uploads this month
                  </p>
                  <div className="h-[200px] mt-4">
                    {filesUploadedData.length > 0 ? (
                      <LineChart 
                        data={filesUploadedData}
                        categories={["value"]}
                        index="name"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No file upload data available
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Daily active users
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                activeUserData.length > 0 ? (
                  <LineChart 
                    data={activeUserData}
                    categories={["value"]}
                    index="name"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No user activity data available
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>
                New and completed onboardings
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                onboardingData.length > 0 ? (
                  <BarChart 
                    data={onboardingData}
                    categories={["started", "completed"]}
                    index="name"
                    colors={["#9b87f5", "#6E59A5"]}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No onboarding data available
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system events and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity to display</p>
                    <p className="text-sm mt-1">Activity will appear here as users interact with the system</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-center">
                <Button variant="outline" size="sm" className="text-xs">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

// Activity Item component for the Recent Activity section
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

const ActivityItem = ({ icon, title, description, timestamp }: ActivityItemProps) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{timestamp}</div>
    </div>
  );
};

export default AdminDashboard;
