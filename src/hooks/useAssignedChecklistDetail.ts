
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { getAssignedChecklistProgress, updateChecklistItemStatus } from "@/lib/checklist-management";
import type { ChecklistProgress, ChecklistItemProgress } from "@/lib/checklist-management/assignment-query";

export function useAssignedChecklistDetail(id: string) {
  const [checklistData, setChecklistData] = useState<ChecklistProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const fetchChecklistData = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await getAssignedChecklistProgress(id);
      setChecklistData(data);
    } catch (error) {
      console.error("Error fetching assigned checklist data:", error);
      toast({
        title: "Error",
        description: "Failed to load checklist data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChecklistData();
  }, [fetchChecklistData]);

  const toggleItemCompletion = async (itemId: string, completed: boolean, notes?: string) => {
    setProcessingItemId(itemId);
    try {
      const result = await updateChecklistItemStatus(itemId, completed, notes);
      
      if (result.success) {
        // Update local state
        if (checklistData) {
          const updatedItems = checklistData.items.map(item => 
            item.id === itemId 
              ? { 
                  ...item, 
                  completed, 
                  completed_at: completed ? new Date().toISOString() : null,
                  notes: notes || item.notes
                } 
              : item
          );
          
          // Calculate new progress
          const totalItems = updatedItems.length;
          const completedItems = updatedItems.filter(item => item.completed).length;
          const progress = Math.round((completedItems / totalItems) * 100);
          
          // Check if all required items are completed
          const allRequiredCompleted = !updatedItems
            .filter(item => item.required)
            .some(item => !item.completed);
          
          setChecklistData({
            ...checklistData,
            items: updatedItems,
            completed_items: completedItems,
            progress,
            completed: allRequiredCompleted,
            completed_at: allRequiredCompleted ? new Date().toISOString() : null
          });
        }
        
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error updating item completion:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update item status. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setProcessingItemId(null);
    }
  };

  return {
    checklistData,
    isLoading,
    processingItemId,
    fetchChecklistData,
    toggleItemCompletion
  };
}
