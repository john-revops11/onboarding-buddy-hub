
import { useState, useEffect } from "react";
import { ChecklistItem, DocumentCategory } from "@/types/onboarding";
import { 
  getUserFiles, 
  getUserFilesByCategory, 
  checkRequiredDocuments 
} from "@/utils/fileUtils";
import {
  getClientOnboardingSteps
} from "@/lib/template-management";
import { supabase } from "@/integrations/supabase/client";

export const useChecklist = (userId: string) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [documentStatus, setDocumentStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize checklist from database or localStorage
  useEffect(() => {
    loadChecklist();
    // Load user files
    loadUserFiles();
  }, [userId]);
  
  const loadChecklist = async () => {
    setIsLoading(true);
    
    try {
      // Try to get checklist from the database first
      let checklistData: ChecklistItem[] = [];
      
      // Check if we have a valid UUID for a client
      if (userId && userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // Get client onboarding steps from the database
        const steps = await getClientOnboardingSteps(userId);
        
        if (steps && steps.length > 0) {
          // Convert database steps to checklist items
          checklistData = steps.map((step: any, index: number) => ({
            id: step.step_id,
            title: step.title,
            description: step.description || "",
            completed: false, // We'll update this from the progress table
            order: step.order_index,
            requiredDocuments: step.required_document_categories || [],
            isAddonStep: step.is_addon_step,
            addonId: step.addon_id,
            addonName: step.addon_name
          }));
          
          // Get completed steps from onboarding_progress
          if (checklistData.length > 0) {
            const { data: progressData, error } = await supabase
              .from('onboarding_progress')
              .select('*')
              .eq('client_id', userId)
              .order('step_order', { ascending: true });
            
            if (!error && progressData) {
              // Update completion status for each step
              checklistData = checklistData.map((item, index) => ({
                ...item,
                completed: progressData[index]?.completed || false
              }));
            }
          }
        }
      }
      
      // If no data from database, fall back to localStorage
      if (checklistData.length === 0) {
        const savedChecklist = localStorage.getItem(`user_checklist_${userId}`);
        
        if (savedChecklist) {
          checklistData = JSON.parse(savedChecklist);
        } else {
          // Initial checklist if none exists
          checklistData = [
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
          
          localStorage.setItem(`user_checklist_${userId}`, JSON.stringify(checklistData));
        }
      }
      
      setChecklist(checklistData);
    } catch (error) {
      console.error("Error loading checklist:", error);
      
      // Fall back to localStorage in case of error
      const savedChecklist = localStorage.getItem(`user_checklist_${userId}`);
      
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if document upload task should be completed based on file uploads
  useEffect(() => {
    if (userFiles.length > 0) {
      const requiredDocsStatus = checkRequiredDocuments(
        userId, 
        ["id_verification", "address_proof", "business_certificate"]
      );
      setDocumentStatus(requiredDocsStatus);
      
      // Auto-complete the document upload task if all required documents are uploaded and verified
      if (requiredDocsStatus?.complete) {
        // Find tasks that require document uploads
        checklist.forEach(task => {
          if (task.requiredDocuments && task.requiredDocuments.length > 0 && !task.completed) {
            if (areRequiredDocumentsUploaded(task)) {
              updateTaskCompletion(task.id, true);
            }
          }
        });
      }
    }
  }, [userFiles, checklist]);
  
  // Load user files from storage
  const loadUserFiles = () => {
    const files = getUserFiles(userId);
    setUserFiles(files);
  };

  // Calculate progress
  const getProgress = () => {
    const completedItems = checklist.filter((item) => item.completed).length;
    return checklist.length > 0 ? Math.round((completedItems / checklist.length) * 100) : 0;
  };

  // Update task completion status
  const updateTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    const updatedChecklist = checklist.map(item => {
      if (item.id === taskId) {
        return { ...item, completed: isCompleted };
      }
      return item;
    });
    
    setChecklist(updatedChecklist);
    
    // Try to update in the database if we have a valid client ID
    if (userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      try {
        // Get the step name from the task
        const task = checklist.find(item => item.id === taskId);
        if (task) {
          // Update the onboarding_progress table
          const { error } = await supabase
            .from('onboarding_progress')
            .update({
              completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null
            })
            .eq('client_id', userId)
            .eq('step_order', task.order);
          
          if (error) {
            console.error("Error updating task completion in database:", error);
          }
        }
      } catch (error) {
        console.error("Error updating task completion:", error);
      }
    }
    
    // Fall back to localStorage
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

  return {
    checklist,
    userFiles,
    documentStatus,
    isLoading,
    loadUserFiles,
    setDocumentStatus,
    updateTaskCompletion,
    areRequiredDocumentsUploaded,
    getProgress,
  };
};
