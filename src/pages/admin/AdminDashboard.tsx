
import React, { useState } from "react";
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

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  
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
                <div className="text-2xl font-bold">247</div>
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
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    24%
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
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    84%
                  </span>
                  completion rate
                </p>
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
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">
                Currently active client accounts
              </p>
              <div className="h-[200px] mt-4">
                <BarChart 
                  data={[
                    { name: "Jan", value: 98 },
                    { name: "Feb", value: 104 },
                    { name: "Mar", value: 112 },
                    { name: "Apr", value: 119 },
                    { name: "May", value: 124 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Files Uploaded</CardTitle>
              <FileUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">879</div>
              <p className="text-xs text-muted-foreground">
                Total uploads this month
              </p>
              <div className="h-[200px] mt-4">
                <LineChart 
                  data={[
                    { name: "Week 1", value: 143 },
                    { name: "Week 2", value: 278 },
                    { name: "Week 3", value: 624 },
                    { name: "Week 4", value: 879 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                />
              </div>
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
              <LineChart 
                data={[
                  { name: "Mon", value: 82 },
                  { name: "Tue", value: 94 },
                  { name: "Wed", value: 111 },
                  { name: "Thu", value: 103 },
                  { name: "Fri", value: 87 },
                  { name: "Sat", value: 45 },
                  { name: "Sun", value: 32 },
                ]} 
                xAxisKey="name"
                yAxisKey="value"
              />
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
              <BarChart 
                data={[
                  { name: "Jan", started: 28, completed: 21 },
                  { name: "Feb", started: 32, completed: 24 },
                  { name: "Mar", started: 26, completed: 19 },
                  { name: "Apr", started: 34, completed: 28 },
                  { name: "May", started: 38, completed: 32 },
                ]}
                xAxisKey="name"
                yAxisKey={["started", "completed"]}
                colors={["#9b87f5", "#6E59A5"]}
              />
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
                  <div className="space-y-4">
                    <ActivityItem 
                      icon={<Users className="h-4 w-4" />}
                      title="New user registered"
                      description="Jane Cooper (jane@example.com)"
                      timestamp="10 minutes ago"
                    />
                    <ActivityItem 
                      icon={<FileText className="h-4 w-4" />}
                      title="New document uploaded"
                      description="Q2 Financial Report.pdf"
                      timestamp="35 minutes ago"
                    />
                    <ActivityItem 
                      icon={<UserCheck className="h-4 w-4" />}
                      title="Onboarding completed"
                      description="Acme Corporation"
                      timestamp="2 hours ago"
                    />
                    <ActivityItem 
                      icon={<Settings className="h-4 w-4" />}
                      title="System settings updated"
                      description="Email notification preferences"
                      timestamp="Yesterday"
                    />
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
