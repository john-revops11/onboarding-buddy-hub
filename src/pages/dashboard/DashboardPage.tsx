
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, FileUp } from "lucide-react";

const DashboardPage = () => {
  // This is a placeholder - in a real app, this would be fetched from an API
  const onboardingProgress = 35;
  const pendingTasks = 4;
  const completedTasks = 2;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onboarding Progress</CardTitle>
              <Clock size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onboardingProgress}%</div>
              <Progress value={onboardingProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {6 - pendingTasks} of 6 tasks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock size={18} className="text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Tasks awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle2 size={18} className="text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Tasks successfully completed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Onboarding Checklist</CardTitle>
              <CardDescription>
                Complete these tasks to set up your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Complete your profile", completed: true },
                  { name: "Upload company logo", completed: true },
                  { name: "Fill out business details", completed: false },
                  { name: "Set up payment information", completed: false },
                  { name: "Review terms and conditions", completed: false },
                  { name: "Schedule onboarding call", completed: false }
                ].map((task, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className={`p-1 rounded-full ${task.completed ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500"}`}>
                      {task.completed ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.completed ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent File Uploads</CardTitle>
            <CardDescription>Files you've recently uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                  <FileUp size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    company_logo.png
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded 2 days ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                  <FileUp size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    business_requirements.pdf
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded 3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
