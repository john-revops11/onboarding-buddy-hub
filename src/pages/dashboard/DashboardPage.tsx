
import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  FileUp,
  BarChart3,
  MoveRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FileUploader } from "@/components/onboarding/FileUploader";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useAuth();
  
  // Mock checklist data
  const checklist = [
    {
      id: 1,
      title: "Complete your profile",
      description: "Fill in all required profile information",
      completed: true,
    },
    {
      id: 2,
      title: "Upload company logo",
      description: "Add your company logo for branding",
      completed: true,
    },
    {
      id: 3,
      title: "Provide business details",
      description: "Enter your business information and address",
      completed: false,
    },
    {
      id: 4,
      title: "Upload required documents",
      description: "Submit necessary legal and business documents",
      completed: false,
    },
    {
      id: 5,
      title: "Review terms and conditions",
      description: "Read and accept the terms of service",
      completed: false,
    },
  ];

  // Calculate progress
  const completedItems = checklist.filter((item) => item.completed).length;
  const progress = Math.round((completedItems / checklist.length) * 100);

  const handleCompleteTask = (id: number) => {
    toast({
      title: "Task completed",
      description: "Your progress has been updated",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your onboarding dashboard. Track your progress and complete
          the required steps.
        </p>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Onboarding Progress</span>
              <span className="text-lg">{progress}%</span>
            </CardTitle>
            <CardDescription>
              Complete all the required steps to finish your onboarding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {completedItems} of {checklist.length} tasks completed
              </span>
              <span className="font-medium">
                {checklist.length - completedItems} remaining
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Checklist</CardTitle>
            <CardDescription>
              Follow these steps to complete your onboarding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 border rounded-lg ${
                  item.completed ? "bg-muted/50" : ""
                }`}
              >
                <div
                  className={`mt-0.5 ${
                    item.completed ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
                <Button
                  variant={item.completed ? "ghost" : "default"}
                  disabled={item.completed}
                  onClick={() => handleCompleteTask(item.id)}
                >
                  {item.completed ? "Completed" : "Complete"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" /> Document Upload
            </CardTitle>
            <CardDescription>
              Upload required documents for your onboarding process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader 
              onUploadComplete={(file) => {
                toast({
                  title: "Document uploaded",
                  description: `${file.name} has been uploaded and will be reviewed.`,
                });
              }}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Knowledge Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Access guides, documentation and resources
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/knowledge-hub')}
              >
                Visit Knowledge Hub <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Contact our support team for assistance
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Support request sent",
                    description: "A support representative will contact you shortly.",
                  });
                }}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
