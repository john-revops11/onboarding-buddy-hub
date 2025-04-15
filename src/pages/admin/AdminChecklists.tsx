
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChecklistManagement } from "@/hooks/useChecklistManagement";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminChecklists = () => {
  const navigate = useNavigate();
  
  const {
    templates,
    assignments,
    isLoading,
    isAssignmentsLoading,
    searchQuery,
    setSearchQuery,
    fetchTemplates,
    fetchAssignments,
    deleteChecklist
  } = useChecklistManagement();

  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Handle click events
  const handleCreateChecklist = () => navigate("/admin/checklists/create");
  
  const handleEditChecklist = (id: string) => {
    navigate(`/admin/checklists/edit/${id}`);
  };
  
  const handleDuplicateChecklist = (id: string) => {
    navigate(`/admin/checklists/create?duplicate=${id}`);
  };
  
  const handleAssignChecklist = (id: string) => {
    navigate(`/admin/checklists/assign/${id}`);
  };
  
  const handleViewAssignment = (id: string) => {
    navigate(`/admin/checklists/view-assignment/${id}`);
  };
  
  const handleEditAssignment = (id: string) => {
    navigate(`/admin/checklists/edit-assignment/${id}`);
  };
  
  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    
    const result = await deleteChecklist(templateToDelete);
    setTemplateToDelete(null);
    
    if (result.success) {
      // Deletion success handled inside the hook (toast & fetch)
      fetchTemplates();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Checklist Management
        </h1>
        <p className="text-muted-foreground">
          Create, edit, and assign checklists to users.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Onboarding Checklists</h2>
          </div>
          <Button onClick={handleCreateChecklist}>
            <Plus className="h-4 w-4 mr-2" />
            Create Checklist
          </Button>
        </div>

        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Checklist Templates</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Checklists</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Templates</CardTitle>
                <CardDescription>
                  Manage your checklist templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 
                      "No templates found matching your search." : 
                      "No checklist templates available. Create one to get started."}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {templates.map(template => (
                      <div 
                        key={template.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{template.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.items?.length || 0} items - {template.description || "No description"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditChecklist(template.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDuplicateChecklist(template.id)}
                          >
                            Duplicate
                          </Button>
                          <AlertDialog open={templateToDelete === template.id} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setTemplateToDelete(template.id)}
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Checklist Template</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this checklist template? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button 
                            size="sm"
                            onClick={() => handleAssignChecklist(template.id)}
                          >
                            Assign
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search assignments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Assigned Checklists</CardTitle>
                <CardDescription>
                  View checklists assigned to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAssignmentsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 
                      "No assignments found matching your search." : 
                      "No checklists have been assigned yet."}
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="py-3 px-4 text-left">User</th>
                          <th className="py-3 px-4 text-left">Checklist</th>
                          <th className="py-3 px-4 text-left">Progress</th>
                          <th className="py-3 px-4 text-left">Assigned Date</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map(assignment => (
                          <tr key={assignment.id} className="border-t">
                            <td className="py-3 px-4">
                              {assignment.client_company || assignment.client_email}
                            </td>
                            <td className="py-3 px-4">{assignment.checklist_title}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`${
                                      assignment.progress === 100 
                                        ? "bg-green-500" 
                                        : "bg-primary"
                                    } h-full rounded-full`}
                                    style={{ width: `${assignment.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{assignment.progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(assignment.assigned_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewAssignment(assignment.id)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditAssignment(assignment.id)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminChecklists;
