
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  getChecklists, 
  getAssignedChecklists,
  createChecklist, 
  updateChecklist,

  deleteChecklist,
  assignChecklistToClient
} from "@/lib/checklist-management";
import type { 
  Checklist, 
  ChecklistItem 
} from "@/lib/checklist-management/checklist-query";
import type { 
  AssignedChecklist 
} from "@/lib/checklist-management/assignment-query";
import type { 
  ChecklistInput 
} from "@/lib/checklist-management/checklist-crud";

export function useChecklistManagement() {
  const [templates, setTemplates] = useState<Checklist[]>([]);
  const [assignments, setAssignments] = useState<AssignedChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch checklist templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getChecklists();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching checklist templates:", error);
      toast({
        title: "Error",
        description: "Failed to load checklist templates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch assigned checklists
  const fetchAssignments = useCallback(async () => {
    setIsAssignmentsLoading(true);
    try {
      const data = await getAssignedChecklists();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assigned checklists:", error);
      toast({
        title: "Error",
        description: "Failed to load assigned checklists. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssignmentsLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchTemplates();
    fetchAssignments();
  }, [fetchTemplates, fetchAssignments]);

  // Create a new checklist
  const handleCreateChecklist = async (data: ChecklistInput) => {
    setIsSubmitting(true);
    try {
      const result = await createChecklist(data);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Checklist created successfully.",
        });
        fetchTemplates();
        return { success: true, id: result.id };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error creating checklist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create checklist. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing checklist
  const handleUpdateChecklist = async (id: string, data: ChecklistInput) => {
    setIsSubmitting(true);
    try {
      const result = await updateChecklist(id, data);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Checklist updated successfully.",
        });
        fetchTemplates();
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error updating checklist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update checklist. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a checklist
  const handleDeleteChecklist = async (id: string) => {
    try {
      const result = await deleteChecklist(id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Checklist deleted successfully.",
        });
        fetchTemplates();
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error deleting checklist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete checklist. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  // Assign a checklist to a client
  const handleAssignChecklist = async (checklistId: string, clientId: string) => {
    setIsSubmitting(true);
    try {
      const result = await assignChecklistToClient(checklistId, clientId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Checklist assigned successfully.",
        });
        fetchAssignments();
        return { success: true, id: result.id };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error assigning checklist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign checklist. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter templates by search query
  const filteredTemplates = templates.filter(template => {
    const searchLower = searchQuery.toLowerCase();
    return (
      template.title.toLowerCase().includes(searchLower) ||
      (template.description && template.description.toLowerCase().includes(searchLower))
    );
  });

  // Filter assignments by search query
  const filteredAssignments = assignments.filter(assignment => {
    const searchLower = searchQuery.toLowerCase();
    return (
      assignment.checklist_title.toLowerCase().includes(searchLower) ||
      assignment.client_email.toLowerCase().includes(searchLower) ||
      (assignment.client_company && assignment.client_company.toLowerCase().includes(searchLower))
    );
  });

  return {
    templates: filteredTemplates,
    assignments: filteredAssignments,
    isLoading,
    isAssignmentsLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    fetchTemplates,
    fetchAssignments,
    createChecklist: handleCreateChecklist,
    updateChecklist: handleUpdateChecklist,
    deleteChecklist: handleDeleteChecklist,
    assignChecklist: handleAssignChecklist
  };
}
