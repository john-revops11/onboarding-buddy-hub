
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Copy, ArrowUp, ArrowDown, AlertCircle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import { 
  getOnboardingTemplates, 
  saveOnboardingTemplate,
  deleteOnboardingTemplate 
} from "@/utils/onboardingUtils";

// Step schema
const stepSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Step title is required"),
  description: z.string().min(1, "Step description is required"),
});

// Template schema
const templateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  description: z.string().min(1, "Template description is required"),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export function OnboardingTemplateManager() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any | null>(null);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [stepToEdit, setStepToEdit] = useState<any | null>(null);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      steps: [],
    },
  });
  
  const stepForm = useForm({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load templates from localStorage (or API in real implementation)
  const loadTemplates = () => {
    const loadedTemplates = getOnboardingTemplates();
    setTemplates(loadedTemplates);
  };

  // Open template form for creating a new template
  const handleAddTemplate = () => {
    form.reset({
      name: "",
      description: "",
      steps: [],
    });
    setIsEditing(false);
    setCurrentTemplate(null);
    setShowTemplateDialog(true);
  };

  // Open template form for editing an existing template
  const handleEditTemplate = (template: any) => {
    form.reset({
      id: template.id,
      name: template.name,
      description: template.description,
      steps: template.steps,
    });
    setIsEditing(true);
    setCurrentTemplate(template);
    setShowTemplateDialog(true);
  };

  // Duplicate an existing template
  const handleDuplicateTemplate = (template: any) => {
    const newTemplate = {
      ...template,
      id: undefined,
      name: `${template.name} (Copy)`,
    };
    
    form.reset(newTemplate);
    setIsEditing(false);
    setCurrentTemplate(null);
    setShowTemplateDialog(true);
    
    toast({
      title: "Template duplicated",
      description: "You can now edit the duplicated template.",
    });
  };

  // Open delete confirmation dialog
  const handleConfirmDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteDialog(true);
  };

  // Delete template after confirmation
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      deleteOnboardingTemplate(templateToDelete);
      loadTemplates();
      
      toast({
        title: "Template deleted",
        description: "The template has been deleted successfully.",
      });
      
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };

  // Open step dialog for adding a new step
  const handleAddStep = () => {
    stepForm.reset({
      title: "",
      description: "",
    });
    setStepToEdit(null);
    setStepIndex(null);
    setShowStepDialog(true);
  };

  // Open step dialog for editing an existing step
  const handleEditStep = (step: any, index: number) => {
    stepForm.reset({
      id: step.id,
      title: step.title,
      description: step.description,
    });
    setStepToEdit(step);
    setStepIndex(index);
    setShowStepDialog(true);
  };

  // Delete a step from the template
  const handleDeleteStep = (index: number) => {
    const currentSteps = form.getValues("steps");
    
    if (currentSteps.length <= 1) {
      toast({
        title: "Cannot delete step",
        description: "A template must have at least one step.",
        variant: "destructive",
      });
      return;
    }
    
    const newSteps = [...currentSteps];
    newSteps.splice(index, 1);
    form.setValue("steps", newSteps);
  };

  // Move a step up in the order
  const handleMoveStepUp = (index: number) => {
    if (index === 0) return;
    
    const currentSteps = form.getValues("steps");
    const newSteps = [...currentSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    
    form.setValue("steps", newSteps);
  };

  // Move a step down in the order
  const handleMoveStepDown = (index: number) => {
    const currentSteps = form.getValues("steps");
    
    if (index === currentSteps.length - 1) return;
    
    const newSteps = [...currentSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    
    form.setValue("steps", newSteps);
  };

  // Save a step (add new or update existing)
  const onStepSubmit = (data: any) => {
    const currentSteps = form.getValues("steps") || [];
    
    if (stepIndex !== null) {
      // Update existing step
      const newSteps = [...currentSteps];
      newSteps[stepIndex] = {
        ...data,
        id: stepToEdit?.id || `step-${Date.now()}`,
      };
      form.setValue("steps", newSteps);
    } else {
      // Add new step
      form.setValue("steps", [
        ...currentSteps,
        {
          ...data,
          id: `step-${Date.now()}`,
        },
      ]);
    }
    
    setShowStepDialog(false);
    stepForm.reset();
  };

  // Save the template
  const onTemplateSubmit = (data: TemplateFormValues) => {
    try {
      // Ensure each step has an ID
      const stepsWithIds = data.steps.map(step => ({
        ...step,
        id: step.id || `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      
      const templateToSave = {
        ...data,
        id: data.id || undefined,
        steps: stepsWithIds,
      };
      
      // Save template to localStorage (or API in real implementation)
      saveOnboardingTemplate(templateToSave);
      
      // Reload templates
      loadTemplates();
      
      // Show success message
      toast({
        title: isEditing ? "Template updated" : "Template created",
        description: isEditing 
          ? "The template has been updated successfully." 
          : "The template has been created successfully.",
      });
      
      // Reset form and state
      form.reset();
      setShowTemplateDialog(false);
      setIsEditing(false);
      setCurrentTemplate(null);
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Onboarding Templates</h2>
        <Button onClick={handleAddTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>
      
      {templates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first onboarding template to streamline your client onboarding process.
              </p>
              <Button onClick={handleAddTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{template.steps.length} Steps</Badge>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="steps">
                    <AccordionTrigger>View Steps</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 mt-2">
                        {template.steps.map((step: any, index: number) => (
                          <div 
                            key={step.id} 
                            className="p-3 border rounded-md bg-muted/30"
                          >
                            <div className="font-medium flex items-center justify-between">
                              <span>{index + 1}. {step.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex justify-end gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConfirmDelete(template.id)}
                    className="text-destructive border-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Template Edit/Create Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update your onboarding template details and steps." 
                : "Create a new onboarding template to streamline your client onboarding process."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onTemplateSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Standard Onboarding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Default onboarding process for most clients" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-base">Onboarding Steps</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddStep}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="steps"
                    render={() => (
                      <FormItem>
                        {form.getValues("steps")?.length > 0 ? (
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12 text-center">#</TableHead>
                                  <TableHead>Step</TableHead>
                                  <TableHead className="w-[160px] text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {form.getValues("steps")?.map((step, index) => (
                                  <TableRow key={step.id || index}>
                                    <TableCell className="text-center font-medium">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell>
                                      <div>
                                        <p className="font-medium">{step.title}</p>
                                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                          {step.description}
                                        </p>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleMoveStepUp(index)}
                                          disabled={index === 0}
                                          className="h-8 w-8"
                                        >
                                          <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleMoveStepDown(index)}
                                          disabled={index === form.getValues("steps").length - 1}
                                          className="h-8 w-8"
                                        >
                                          <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditStep(step, index)}
                                          className="h-8 w-8"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteStep(index)}
                                          className="h-8 w-8 text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-md p-4 text-center">
                            <p className="text-muted-foreground mb-2">No steps added yet</p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={handleAddStep}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add First Step
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowTemplateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Step Edit/Create Dialog */}
      <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {stepToEdit ? "Edit Step" : "Add Step"}
            </DialogTitle>
            <DialogDescription>
              {stepToEdit 
                ? "Update the details of this onboarding step." 
                : "Add a new step to the onboarding template."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...stepForm}>
            <form onSubmit={stepForm.handleSubmit(onStepSubmit)} className="space-y-4">
              <FormField
                control={stepForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Account Setup" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={stepForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Configure your account details and preferences" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowStepDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {stepToEdit ? "Update Step" : "Add Step"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
