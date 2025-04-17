import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useClientOnboarding } from "@/hooks/use-client-onboarding";
import { Main } from "@/components/ui/main";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { ChecklistSection } from "@/components/dashboard/ChecklistSection";
import { FileUploadSection } from "@/components/dashboard/FileUploadSection";
import { ServiceTierSection } from "@/components/dashboard/ServiceTierSection";
import { QuickActions } from "@/components/dashboard/QuickActions";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const {
    checklistItems,
    loadingSteps,
    uploadedFiles,
    uploading,
    uploadProgress,
    error,
    handleCompleteTask,
    handleFileUpload,
    handleVerificationStatusChange,
  } = useClientOnboarding();

  const handleFileUploadComplete = (file: File) => {
    handleFileUpload([file]);
  };

  const completedCount = checklistItems.filter((item) => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

  const user = state.user;

  return (
    <Main>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ✅ Progress Bar */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">
            Progress: {completedCount} of {checklistItems.length} complete
          </p>
          <Progress value={progress} />
        </div>

        {/* ✅ Checklist + Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChecklistSection
            checklist={checklistItems}
            onCompleteTask={handleCompleteTask}
            areRequiredDocumentsUploaded={(task) =>
              !task.requiredDocuments?.length ||
              task.requiredDocuments.every((cat) =>
                uploadedFiles.some((file) => file.category === cat)
              )
            }
            isLoading={loadingSteps}
          />

          <FileUploadSection
            onFileUploadComplete={handleFileUploadComplete}
            onVerificationStatusChange={handleVerificationStatusChange}
          />
        </div>

        {/* ✅ Service Tier Info */}
        <ServiceTierSection
          tier={user?.platformTier ?? "Standard"}
          consultingAddOn={user?.consultingAddOn}
          tierUrl={user?.tierInfoUrl}
          consultingUrl={user?.consultingOptionsUrl}
        />

        {/* ✅ Quick Access Actions */}
        <QuickActions
          supportUrl={user?.supportUrl ?? "#"}
          meetingUrl={user?.meetingUrl ?? "#"}
          kbUrl={user?.kbUrl ?? "#"}
        />
      </div>
    </Main>
  );
};

export default OnboardingPage;
