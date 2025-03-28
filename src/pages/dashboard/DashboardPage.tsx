
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { useToast } from "@/components/ui/use-toast";

// Custom hook for checklist management
import { useChecklist } from "@/hooks/useChecklist";

// Refactored components
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { ChecklistSection } from "@/components/dashboard/ChecklistSection";
import { FileUploadSection } from "@/components/dashboard/FileUploadSection";
import { QuickActions } from "@/components/dashboard/QuickActions";

const DashboardPage = () => {
  const { toast } = useToast();
  const { state } = useAuth();
  const userId = state.user?.id || "demo-user";
  
  const {
    checklist,
    loadUserFiles,
    updateTaskCompletion,
    areRequiredDocumentsUploaded,
    setDocumentStatus,
    getProgress
  } = useChecklist(userId);
  
  // Calculate progress values
  const progress = getProgress();
  const completedItems = checklist.filter((item) => item.completed).length;
  
  // Handle file upload completion
  const handleFileUploadComplete = (file: any) => {
    loadUserFiles(); // Reload files after upload
    
    toast({
      title: "Document uploaded",
      description: `${file.name} has been uploaded and will be reviewed.`,
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
        <ProgressOverview 
          progress={progress}
          completedItems={completedItems}
          totalItems={checklist.length}
        />

        {/* Checklist */}
        <ChecklistSection 
          checklist={checklist}
          onCompleteTask={updateTaskCompletion}
          areRequiredDocumentsUploaded={areRequiredDocumentsUploaded}
        />

        {/* File Upload Section */}
        <FileUploadSection 
          onFileUploadComplete={handleFileUploadComplete}
          onVerificationStatusChange={setDocumentStatus}
        />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
