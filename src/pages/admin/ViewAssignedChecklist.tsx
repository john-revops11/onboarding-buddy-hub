
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  User,
  FileText,
  CalendarDays,
  Loader2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAssignedChecklistDetail } from "@/hooks/useAssignedChecklistDetail";
import { Textarea } from "@/components/ui/textarea";

const ViewAssignedChecklist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditable = location.pathname.includes("edit-assignment");
  
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  
  const { 
    checklistData, 
    isLoading, 
    processingItemId, 
    toggleItemCompletion 
  } = useAssignedChecklistDetail(id || "");

  // Handle item notes change
  const updateItemNote = (itemId: string, note: string) => {
    setItemNotes({
      ...itemNotes,
      [itemId]: note
    });
  };

  // Toggle completion status of an item
  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    if (!isEditable) return;
    
    const newStatus = !currentStatus;
    const note = itemNotes[itemId];
    await toggleItemCompletion(itemId, newStatus, note);
  };

  // Format date string for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Save changes
  const handleSaveChanges = () => {
    navigate("/admin/checklists");
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

  if (!checklistData) {
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
              Checklist Not Found
            </h1>
          </div>
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                The requested checklist assignment could not be found.
              </div>
            </CardContent>
          </Card>
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
            {isEditable ? "Edit Assigned Checklist" : "View Assigned Checklist"}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{checklistData.checklist_title}</span>
              <Badge variant={checklistData.progress === 100 ? "success" : "default"}>
                {checklistData.progress}% Complete
              </Badge>
            </CardTitle>
            <CardDescription>
              Assignment details and progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Progress</p>
                <p className="text-sm font-medium">
                  {checklistData.completed_items} of {checklistData.total_items} items completed ({checklistData.progress}%)
                </p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    checklistData.progress === 100 
                      ? "bg-green-500" 
                      : "bg-primary"
                  }`}
                  style={{ width: `${checklistData.progress}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div>
              <h3 className="font-semibold mb-3">Checklist Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Required</TableHead>
                    <TableHead className="hidden md:table-cell">Completed On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklistData.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {isEditable ? (
                          <Checkbox 
                            checked={item.completed}
                            disabled={processingItemId === item.id}
                            onCheckedChange={() => handleToggleItem(item.id, item.completed)}
                          />
                        ) : (
                          item.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        <div className="md:hidden text-sm text-muted-foreground mt-1">
                          {item.description}
                        </div>
                        {isEditable && (
                          <div className="mt-2">
                            <Textarea
                              placeholder="Add notes (optional)"
                              className="h-20 text-sm"
                              value={itemNotes[item.id] || item.notes || ""}
                              onChange={(e) => updateItemNote(item.id, e.target.value)}
                            />
                          </div>
                        )}
                        {!isEditable && item.notes && (
                          <div className="mt-2 text-sm italic text-muted-foreground">
                            Note: {item.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{item.description}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.required ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(item.completed_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {isEditable && (
            <CardFooter className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/checklists")}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ViewAssignedChecklist;
