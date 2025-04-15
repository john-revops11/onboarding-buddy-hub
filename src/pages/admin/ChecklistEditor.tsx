
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckSquare, Plus, Trash, ArrowLeft, GripVertical, Loader2 } from "lucide-react";
import { useChecklistManagement } from "@/hooks/useChecklistManagement";
import { getChecklistWithItems } from "@/lib/checklist-management/checklist-query";
import type { ChecklistItem } from "@/lib/checklist-management/checklist-query";

const ChecklistEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const duplicateFromId = searchParams.get('duplicate');
  const isEditing = !!id;
  const isDuplicating = !!duplicateFromId;

  // State for checklist data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing || isDuplicating);

  const { createChecklist, updateChecklist, isSubmitting } = useChecklistManagement();

  // Load existing checklist data for editing or duplicating
  useEffect(() => {
    const loadChecklistData = async () => {
      setIsLoading(true);
      try {
        const sourceId = isEditing ? id : duplicateFromId;
        if (sourceId) {
          const checklistData = await getChecklistWithItems(sourceId);
          if (checklistData) {
            setTitle(isEditing ? checklistData.title : `Copy of ${checklistData.title}`);
            setDescription(checklistData.description || "");
            setItems(checklistData.items.map(item => ({
              id: isEditing ? item.id : `temp-${Date.now()}-${Math.random()}`,
              text: item.title,
              description: item.description || "",
              required: item.required,
              order: item.order,
              document_categories: item.document_categories || []
            })));
          }
        }
      } catch (error) {
        console.error("Error loading checklist data:", error);
        toast({
          title: "Error",
          description: "Failed to load checklist data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditing || isDuplicating) {
      loadChecklistData();
    }
  }, [id, duplicateFromId, isEditing, isDuplicating, toast]);

  // Add a new checklist item
  const addChecklistItem = () => {
    const newOrder = items.length > 0 
      ? Math.max(...items.map(item => item.order)) + 1 
      : 0;
      
    setItems([
      ...items,
      {
        id: `temp-${Date.now()}-${Math.random()}`,
        text: "",
        description: "",
        required: false,
        order: newOrder,
        document_categories: []
      },
    ]);
  };

  // Remove a checklist item
  const removeChecklistItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update a checklist item
  const updateChecklistItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Handle save
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Checklist title is required",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one checklist item is required",
        variant: "destructive"
      });
      return;
    }

    // Check if all items have titles
    const invalidItems = items.filter(item => !item.text.trim());
    if (invalidItems.length > 0) {
      toast({
        title: "Validation Error",
        description: "All checklist items must have a title",
        variant: "destructive"
      });
      return;
    }

    // Prepare input data
    const checklistData = {
      title,
      description: description || undefined,
      items: items.map((item, index) => ({
        title: item.text,
        description: item.description || undefined,
        order: item.order !== undefined ? item.order : index,
        required: item.required,
        document_categories: item.document_categories || []
      }))
    };

    // Create or update the checklist
    const result = isEditing
      ? await updateChecklist(id!, checklistData)
      : await createChecklist(checklistData);

    if (result.success) {
      navigate("/admin/checklists");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/checklists")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Checklist" : "Create New Checklist"}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Details</CardTitle>
            <CardDescription>
              Define the basic information for this checklist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none"
              >
                Checklist Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter checklist title"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter checklist description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Items</CardTitle>
            <CardDescription>
              Add items that need to be completed in this checklist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items added yet. Click the button below to add your first
                item.
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 space-y-3 relative"
                >
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChecklistItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="cursor-move">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="font-medium">Item {index + 1}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Item Title
                    </label>
                    <Input
                      value={item.text}
                      onChange={(e) =>
                        updateChecklistItem(item.id, "text", e.target.value)
                      }
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Description
                    </label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateChecklistItem(
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter task description"
                      className="h-20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${item.id}`}
                      checked={item.required}
                      onChange={(e) =>
                        updateChecklistItem(
                          item.id,
                          "required",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`required-${item.id}`}
                      className="text-sm font-medium"
                    >
                      Required item
                    </label>
                  </div>
                </div>
              ))
            )}

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={addChecklistItem}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Checklist Item
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/checklists")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Checklist" : "Save Checklist"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChecklistEditor;
