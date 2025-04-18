
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  assignTemplateToClient,
  getClientOnboardingSteps,
  updateClientProgress,
} from "@/lib/client-management/onboarding-templates";
import {
  uploadFile,
  getClientFiles,
  updateFileStatus,
} from "@/lib/client-management/file-upload";
import { getClientProgress } from "@/lib/client-management";
import { ChecklistItem, DocumentCategory } from "@/types/onboarding";
import { FileUpload, OnboardingProgressRecord } from "@/lib/types/client-types";

export function useClientOnboarding() {
  const { toast } = useToast();
  const { state } = useAuth();
  const clientId = state.user?.id;

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setError("Client ID not found.");
      return;
    }

    assignTemplateToClient(clientId).then(async (assigned) => {
      if (!assigned) {
        toast({
          title: "Notice",
          description: "No onboarding template found.",
        });
      }
      await loadClientSteps();
    });

    loadClientFiles();
  }, [clientId]);

  const loadClientSteps = async () => {
    if (!clientId) return;

    try {
      setLoadingSteps(true);
      const steps = await getClientOnboardingSteps(clientId);

      const checklist: ChecklistItem[] = steps.map((step) => ({
        id: step.step_id || `step-${Math.random().toString(36).substring(2, 9)}`,
        title: step.title || "Untitled Step",
        description: step.description || "",
        order: step.order_index,
        completed: false,
        requiredDocuments: step.required_document_categories as DocumentCategory[] || [],
        isAddonStep: step.is_addon_step || false,
        addonId: step.addon_id,
        addonName: step.addon_name,
      }));

      const progress: OnboardingProgressRecord[] = await getClientProgress(clientId);

      const updatedChecklist = checklist.map((item) => {
        const stepProgress = progress.find((p) => p.stepOrder === item.order);
        return {
          ...item,
          completed: stepProgress?.completed || false,
        };
      });

      setChecklistItems(updatedChecklist);
    } catch (error) {
      setError("Failed to load checklist.");
    } finally {
      setLoadingSteps(false);
    }
  };

  const loadClientFiles = async () => {
    if (!clientId) return;

    try {
      const files = await getClientFiles(clientId);
      setUploadedFiles(files as FileUpload[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your uploaded files.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (id: string, isCompleted = true) => {
    if (!clientId) return;

    const task = checklistItems.find((item) => item.id === id);
    if (!task) return;

    const updated = checklistItems.map((item) =>
      item.id === id ? { ...item, completed: isCompleted } : item
    );
    setChecklistItems(updated);

    const success = await updateClientProgress(clientId, task.order, isCompleted);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
      setChecklistItems(checklistItems); // revert
    }
  };

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (!clientId) return;

    setUploading(true);
    setUploadProgress(0);
    const defaultCategory = "initial_data";

    try {
      const result = await uploadFile(clientId, files[0], defaultCategory);
      if (result.success) {
        setUploadProgress(100);
        toast({
          title: "File uploaded",
          description: `${files[0].name} uploaded successfully.`,
        });
        await loadClientFiles();
      } else {
        throw new Error(result.error || "Upload failed.");
      }
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [clientId]);

  const handleVerificationStatusChange = async (fileId: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      const success = await updateFileStatus(fileId, status);
      if (success) {
        toast({
          title: `File ${status}`,
          description: `File status updated.`,
        });
        await loadClientFiles();
      } else {
        throw new Error("Failed to update file status");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update file status.",
        variant: "destructive",
      });
    }
  };

  return {
    checklistItems,
    loadingSteps,
    uploadedFiles,
    uploading,
    uploadProgress,
    error,
    handleCompleteTask,
    handleFileUpload,
    handleVerificationStatusChange,
  };
}
