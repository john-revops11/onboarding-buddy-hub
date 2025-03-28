
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckSquare, Key, FileUp } from "lucide-react";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor system performance and manage users, checklists, and API keys.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-2">
                3 new users this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Checklists</CardTitle>
              <CheckSquare size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-2">
                2 completed this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Keys</CardTitle>
              <Key size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-2">
                Google, Notion, OpenAI, etc.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">File Uploads</CardTitle>
              <FileUp size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-2">
                7 uploads this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Onboarding Progress</CardTitle>
              <CardDescription>
                Average completion rate across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-sm text-muted-foreground">75%</div>
                  </div>
                  <Progress value={75} className="h-2 mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Jane Smith</div>
                    <div className="text-sm text-muted-foreground">50%</div>
                  </div>
                  <Progress value={50} className="h-2 mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Bob Johnson</div>
                    <div className="text-sm text-muted-foreground">90%</div>
                  </div>
                  <Progress value={90} className="h-2 mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Alice Williams</div>
                    <div className="text-sm text-muted-foreground">30%</div>
                  </div>
                  <Progress value={30} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest system activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">
                      Alice Williams joined the platform
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-1">
                    <CheckSquare size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Checklist modified</p>
                    <p className="text-xs text-muted-foreground">
                      Standard onboarding checklist updated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      5 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-1">
                    <FileUp size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">File uploaded</p>
                    <p className="text-xs text-muted-foreground">
                      Bob Johnson uploaded contract.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Yesterday at 3:45 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Key size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">API key updated</p>
                    <p className="text-xs text-muted-foreground">
                      OpenAI API key was refreshed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Yesterday at 11:30 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
