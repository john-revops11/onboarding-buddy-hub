import React, { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FileUploader } from "@/components/onboarding/FileUploader";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { getUserFiles, getUserFilesByCategory, checkRequiredDocuments } from "@/utils/fileUtils";
import { ChecklistItem, DocumentCategory } from "@/types/onboarding";

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useAuth();
  const userId = state.user?.id || "demo-user";
  
  // State for checklist items and uploaded files
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [documentStatus, setDocumentStatus] = useState<any>(null);
  
  // Initialize checklist from localStorage or create new one
  useEffect(() => {
    const savedChecklist = localStorage.getItem(`user_checklist_${userId}`);
    
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      // Initial checklist if none exists
      const initialChecklist: ChecklistItem[] = [
        {
          id: "1",
          title: "Complete your profile",
          description: "Fill in all required profile information",
          completed: false,
          order: 1,
          requiredDocuments: [],
        },
        {
          id: "2",
          title: "Upload company logo",
          description: "Add your company logo for branding",
          completed: false,
          order: 2,
          requiredDocuments: ["company_logo" as DocumentCategory],
        },
        {
          id: "3",
          title: "Provide business details",
          description: "Enter your business information and address",
          completed: false,
          order: 3,
          requiredDocuments: [],
        },
        {
          id: "4",
          title: "Upload required documents",
          description: "Submit necessary legal and business documents",
          completed: false,
          order: 4,
          requiredDocuments: ["id_verification", "address_proof", "business_certificate"] as DocumentCategory[],
        },
        {
          id: "5",
          title: "Review terms and conditions",
          description: "Read and accept the terms of service",
          completed: false,
          order: 5,
          requiredDocuments: [],
        },
      ];
      
      setChecklist(initialChecklist);
      localStorage.setItem(`user_checklist_${userId}`, JSON.stringify(initialChecklist));
    }
    
    // Load user files
    loadUserFiles();
  }, [userId]);
  
  // Check if document upload task should be completed based on file uploads
  useEffect(() => {
    if (userFiles.length > 0) {
      const requiredDocsStatus = checkRequiredDocuments(
        userId, 
        ["id_verification", "address_proof", "business_certificate"]
      );
      setDocumentStatus(requiredDocsStatus);
      
      // Auto-complete the document upload task if all required documents are uploaded and verified
      if (requiredDocsStatus.complete) {
        updateTaskCompletion("4", true);
      }
    }
  }, [userFiles]);
  
  // Load user files from storage
  const loadUserFiles = () => {
    const files = getUserFiles(userId);
    setUserFiles(files);
  };

  // Calculate progress
  const completedItems = checklist.filter((item) => item.completed).length;
  const progress = checklist.length > 0 ? Math.round((completedItems / checklist.length) * 100) : 0;

  // Update task completion status
  const updateTaskCompletion = (taskId: string, isCompleted: boolean) => {
    const updatedChecklist = checklist.map(item => {
      if (item.id === taskId) {
        return { ...item, completed: isCompleted };
      }
      return item;
    });
    
    setChecklist(updatedChecklist);
    localStorage.setItem(`user_checklist_${userId}`, JSON.stringify(updatedChecklist));
  };

  // Check if the required documents for a task are uploaded
  const areRequiredDocumentsUploaded = (task: ChecklistItem): boolean => {
    if (!task.requiredDocuments || task.requiredDocuments.length === 0) {
      return true; // No documents required for this task
    }
    
    // For each required document category, check if it's uploaded
    for (const category of task.requiredDocuments) {
      const filesInCategory = getUserFilesByCategory(userId, category);
      if (filesInCategory.length === 0) {
        return false; // Missing at least one required document
      }
    }
    
    return true;
  };

  // Handle completing a task
  const handleCompleteTask = (id: string) => {
    const task = checklist.find(item => item.id === id);
    
    if (!task) return;
    
    if (!areRequiredDocumentsUploaded(task)) {
      toast({
        title: "Missing required documents",
        description: "Please upload all required documents before completing this task.",
        variant: "destructive",
      });
      return;
    }
    
    updateTaskCompletion(id, true);
    
    toast({
      title: "Task completed",
      description: "Your progress has been updated",
    });
  };
  
  // Handle file upload completion
  const handleFileUploadComplete = (file: any) => {
    loadUserFiles(); // Reload files after upload
    
    toast({
      title: "Document uploaded",
      description: `${file.name} has been uploaded and will be reviewed.`,
    });
  };
  
  // Get task button status
  const getTaskButton = (task: ChecklistItem) => {
    if (task.completed) {
      return (
        <Button variant="ghost" disabled className="flex gap-2 items-center">
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </Button>
      );
    }
    
    if (task.requiredDocuments && task.requiredDocuments.length > 0) {
      const hasRequiredDocs = areRequiredDocumentsUploaded(task);
      
      return (
        <Button
          variant={hasRequiredDocs ? "default" : "outline"}
          onClick={() => handleCompleteTask(task.id)}
          className={hasRequiredDocs ? "bg-[#68b046] hover:bg-[#72c90a]" : ""}
          disabled={!hasRequiredDocs}
        >
          {!hasRequiredDocs && <AlertCircle className="h-4 w-4 mr-2" />}
          {hasRequiredDocs ? "Complete" : "Upload Required Files"}
        </Button>
      );
    }
    
    return (
      <Button
        variant="default"
        onClick={() => handleCompleteTask(task.id)}
        className="bg-[#68b046] hover:bg-[#72c90a]"
      >
        Complete
      </Button>
    );
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
            <Progress value={progress} className="h-2 bg-green-base/20" />
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
                    item.completed ? "text-[#68b046]" : "text-muted-foreground"
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
                  {item.requiredDocuments && item.requiredDocuments.length > 0 && !item.completed && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Required documents must be uploaded first
                    </div>
                  )}
                </div>
                {getTaskButton(item)}
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
              onUploadComplete={handleFileUploadComplete}
              onVerificationStatusChange={setDocumentStatus}
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
                className="w-full border-[#68b046] text-[#68b046] hover:bg-[#68b046]/10"
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
                className="w-full bg-[#68b046]/20 hover:bg-[#68b046]/30 text-[#68b046]"
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
