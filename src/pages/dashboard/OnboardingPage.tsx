import { Progress } from "@/components/ui/progress";
import { ServiceTierSection } from "@/components/dashboard/ServiceTierSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Main } from "@/components/ui/main";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ChecklistSection } from "@/components/dashboard/ChecklistSection";
import { FileUploadSection } from "@/components/dashboard/FileUploadSection";
import { 
  assignTemplateToClient, 
  getClientOnboardingSteps, 
  updateClientProgress 
} from "@/lib/client-management/onboarding-templates";
import { getClientProgress } from "@/lib/client-management/client-query";
import { ChecklistItem, DocumentCategory } from "@/types/onboarding";
import { useAuth } from "@/hooks/use-auth";
import { 
  uploadFile, 
  getClientFiles, 
  updateFileStatus 
} from "@/lib/client-management/file-upload";
import { FileUpload, ClientFile } from "@/lib/types/client-types";
import { OnboardingProgressRecord } from "@/lib/types/client-types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const OnboardingPage = () => {
  const navigate = useNavigate();
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
    if (!clientId) return;
    
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
    } catch (error) {
      console.error("Error assigning template:", error);
      setError("Failed to assign onboarding template. Please contact support.");
    }
  };
  
  const loadClientFiles = async () => {
    if (!clientId) return;
    
    try {
      const files = await getClientFiles(clientId);
      setUploadedFiles(files as unknown as FileUpload[]);
    } catch (error) {
      console.error("Error loading client files:", error);
      toast({
        title: "Error",
        description: "Failed to load your uploaded files.",
        variant: "destructive",
      });
    }
  };

  const loadClientSteps = async () => {
    if (!clientId) return;
    
    try {
      setLoadingSteps(true);
      const steps = await getClientOnboardingSteps(clientId);
      console.log("Loaded steps:", steps);
      
      if (!steps || steps.length === 0) {
        setError("No onboarding steps found. Please contact support.");
        setLoadingSteps(false);
        return;
      }
      
      const checklist: ChecklistItem[] = steps.map(step => ({
        id: step.step_id || `step-${Math.random().toString(36).substring(2, 9)}`,
        title: step.title || 'Untitled Step',
        description: step.description || '',
        order: step.order_index,
        completed: false,
        requiredDocuments: step.required_document_categories as DocumentCategory[] || [],
        isAddonStep: step.is_addon_step || false,
        addonId: step.addon_id,
        addonName: step.addon_name
      }));
      
      setChecklistItems(checklist);
      
      const progress: OnboardingProgressRecord[] = await getClientProgress(clientId);
      
      if (progress && progress.length > 0) {
        const updatedChecklist = checklist.map((item) => {
          const stepProgress = progress.find(p => p.stepOrder === item.order);
          if (stepProgress) {
            return {
              ...item,
              completed: stepProgress.completed || false
            };
          }
          return item;
        });
        
        setChecklistItems(updatedChecklist);
      }
    } catch (error) {
      console.error("Error loading client checklist:", error);
      setError("Failed to load your onboarding checklist. Please contact support.");
    } finally {
      setLoadingSteps(false);
    }
  };
  
  const handleCompleteTask = async (id: string, isCompleted: boolean = true) => {
    if (!clientId) return;
    
    try {
      const task = checklistItems.find((item) => item.id === id);
      
      if (!task) {
        console.error(`Task with ID ${id} not found`);
        return;
      }
      
      // Optimistically update the UI
      const updatedChecklist = checklistItems.map((item) =>
        item.id === id ? { ...item, completed: isCompleted } : item
      );
      setChecklistItems(updatedChecklist);
      
      const success = await updateClientProgress(clientId, task.order, isCompleted);
      
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
        
        // Revert the optimistic update
        setChecklistItems(checklistItems);
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
      
      // Revert the optimistic update
      setChecklistItems(checklistItems);
    }
  };
  
  const handleFileUpload = useCallback(async (files: File[], category: string) => {
    if (!clientId) {
      toast({
        title: "Error",
        description: "Client ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }
    
    if (files && files.length > 0) {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);
      
      try {
        const result = await uploadFile(clientId, files[0], category);
        
        if (result.success) {
          setUploadProgress(100);
          toast({
            title: "File uploaded",
            description: `${files[0].name} has been uploaded successfully.`,
          });
          
          await loadClientFiles();
        } else {
          throw new Error(result.error || "Failed to upload file");
        }
      } catch (error: any) {
        console.error("File upload error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to upload file. Please try again.",
          variant: "destructive",
        });
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }
  }, [clientId, toast]);
  
  const handleFileUploadComplete = (file: any) => {
    // This is called by the FileUploader component after a successful upload
    console.log("File upload complete:", file);
    
    // Convert the file data to the format expected by the handleFileUpload function
    const fileObject = new File(
      [new Blob([])], // Empty blob as we don't have the actual file data
      file.name,
      { type: file.type }
    );
    
    handleFileUpload([fileObject], file.category);
  };
  
  const handleVerificationStatusChange = async (fileId: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      const success = await updateFileStatus(fileId, status);
      
      if (success) {
        toast({
          title: `File ${status}`,
          description: `File status updated to ${status}.`,
        });
        
        await loadClientFiles();
      } else {
        throw new Error("Failed to update file status");
      }
    } catch (error: any) {
      console.error("Error updating file status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update file status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const areRequiredDocumentsUploaded = (task: ChecklistItem) => {
    if (!task.requiredDocuments || task.requiredDocuments.length === 0) {
      return true;
    }
    
    return task.requiredDocuments.every(category =>
      uploadedFiles.some(file => file.category === category)
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

    {/* ✅ PROGRESS BAR */}
    <div className="mb-6">
      <p className="text-sm font-medium mb-2">
        Progress: {checklistItems.filter((i) => i.completed).length} of {checklistItems.length} complete
      </p>
      <Progress value={(checklistItems.filter((i) => i.completed).length / checklistItems.length) * 100} />
    </div>

    {/* ✅ CHECKLIST + FILES */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <ChecklistSection
        checklist={checklistItems}
        onCompleteTask={handleCompleteTask}
        areRequiredDocumentsUploaded={areRequiredDocumentsUploaded}
        isLoading={loadingSteps}
      />
      <FileUploadSection
        onFileUploadComplete={handleFileUploadComplete}
        onVerificationStatusChange={handleVerificationStatusChange}
      />
    </div>

    {/* ✅ SERVICE TIER SECTION */}
    <ServiceTierSection
      tier={state.user?.platformTier ?? "Standard"}
      consultingAddOn={state.user?.consultingAddOn}
      tierUrl={state.user?.tierInfoUrl}
      consultingUrl={state.user?.consultingOptionsUrl}
    />

    {/* ✅ QUICK ACTIONS SECTION */}
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
