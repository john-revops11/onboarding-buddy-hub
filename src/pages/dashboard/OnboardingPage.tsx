import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import { Main } from "@/components/ui/main";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { ChecklistSection } from "@/components/dashboard/ChecklistSection";
import { FileUploadSection } from "@/components/dashboard/FileUploadSection";
import { ServiceTierSection } from "@/components/dashboard/ServiceTierSection";
import { QuickActions } from "@/components/dashboard/QuickActions";

import {
  assignTemplateToClient,
  getClientOnboardingSteps,
  updateClientProgress,
} from "@/lib/client-management/onboarding-templates";

import {
  getClientProgress,
  getClientFiles,
  updateFileStatus,
  uploadFile,
} from "@/lib/client-management/file-upload";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = useAuth();
  const clientId = state.user?.id;

  const [checklistItems, setChecklistItems] = useState([]);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load onboarding steps
  useEffect(() => {
    if (clientId) {
      loadClientSteps();
      loadClientFiles();
    } else {
      setError("Client ID not found. Please log in again.");
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      assignTemplate();
    }
  }, [clientId]);

  const assignTemplate = async () => {
    try {
      const assigned = await assignTemplateToClient(clientId);
      if (assigned) {
        toast({
          title: "Template assigned",
          description: "Onboarding template assigned to your account.",
        });
        loadClientSteps();
      } else {
        toast({
          title: "Notice",
          description: "No onboarding template is available for your subscription.",
        });
      }
    } catch (err) {
      console.error("Error assigning template:", err);
      setError("Failed to assign onboarding template. Please contact support.");
    }
  };

  const loadClientSteps = async () => {
    try {
      setLoadingSteps(true);
      const steps = await getClientOnboardingSteps(clientId);
      const progress = await getClientProgress(clientId);

      const checklist = steps.map((step) => ({
        id: step.step_id || `step-${Math.random().toString(36).slice(2, 9)}`,
        title: step.title || "Untitled Step",
        description: step.description || "",
        order: step.order_index,
        completed: progress?.find((p) => p.stepOrder === step.order_index)?.completed || false,
        requiredDocuments: step.required_document_categories || [],
      }));

      setChecklistItems(checklist);
    } catch (err) {
      console.error("Failed to load onboarding steps:", err);
      setError("Could not load onboarding steps. Please contact support.");
    } finally {
      setLoadingSteps(false);
    }
  };

  const loadClientFiles = async () => {
    try {
      const files = await getClientFiles(clientId);
      setUploadedFiles(files);
    } catch (err) {
      console.error("Failed to load files:", err);
      toast({
        title: "Error",
        description: "Failed to load uploaded files.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (id: string, isCompleted = true) => {
    const task = checklistItems.find((item) => item.id === id);
    if (!task) return;

    const updatedChecklist = checklistItems.map((item) =>
      item.id === id ? { ...item, completed: isCompleted } : item
    );

    setChecklistItems(updatedChecklist);

    try {
      const success = await updateClientProgress(clientId, task.order, isCompleted);
      if (!success) throw new Error("Update failed");

    } catch (err) {
      toast({
        title: "Update failed",
        description: "Could not update task completion status.",
        variant: "destructive",
      });
      setChecklistItems(checklistItems); // rollback
    }
  };

  const handleFileUpload = useCallback(
    async (files, category) => {
      if (!clientId || !files?.length) return;

      setUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      try {
        const result = await uploadFile(clientId, files[0], category);
        if (result.success) {
          setUploadProgress(100);
          toast({ title: "Upload successful", description: files[0].name });
          await loadClientFiles();
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (err) {
        toast({
          title: "Upload failed",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    [clientId, toast]
  );

  const areRequiredDocumentsUploaded = (task) => {
    if (!task.requiredDocuments.length) return true;
    return task.requiredDocuments.every((cat) =>
      uploadedFiles.some((file) => file.category === cat)
    );
  };

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

        <div className="mb-6">
          <p className="text-sm font-medium mb-2">
            Progress: {checklistItems.filter((i) => i.completed).length} of {checklistItems.length} complete
          </p>
          <Progress value={(checklistItems.filter((i) => i.completed).length / checklistItems.length) * 100} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChecklistSection
            checklist={checklistItems}
            onCompleteTask={handleCompleteTask}
            areRequiredDocumentsUploaded={areRequiredDocumentsUploaded}
            isLoading={loadingSteps}
          />
          <FileUploadSection
            onFileUploadComplete={() => loadClientFiles()}
            onVerificationStatusChange={updateFileStatus}
          />
        </div>

        <ServiceTierSection
          tier={state.user?.platformTier ?? "Standard"}
          consultingAddOn={state.user?.consultingAddOn}
          tierUrl={state.user?.tierInfoUrl}
          consultingUrl={state.user?.consultingOptionsUrl}
        />

        <QuickActions
          supportUrl={state.user?.supportUrl ?? "#"}
          meetingUrl={state.user?.meetingUrl ?? "#"}
          kbUrl={state.user?.kbUrl ?? "#"}
        />
      </div>
    </Main>
  );
};

export default OnboardingPage;
