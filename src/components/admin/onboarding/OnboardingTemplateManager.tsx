import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Copy, ArrowUp, ArrowDown, AlertCircle, CheckCircle, X, LinkIcon } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getOnboardingTemplates, 
  getTemplateWithSteps,
  createOnboardingTemplate, 
  updateOnboardingTemplate, 
  deleteOnboardingTemplate,
  linkTemplateToSubscription,
  getSubscriptionTiers
} from "@/lib/template-management";
import { OnboardingTemplate, OnboardingTemplateStep } from "@/lib/types/client-types";
import { getSubscriptions } from "@/lib/subscription-management";

const stepSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Step title is required"),
  description: z.string().optional(),
  order_index: z.number().int().positive().default(1),
  required_document_categories: z.array(z.string()).optional(),
});

const templateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  is_default: z.boolean().default(false),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;
type StepFormValues = z.infer<typeof stepSchema>;

export function OnboardingTemplateManager() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<OnboardingTemplate | null>(null);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [stepToEdit, setStepToEdit] = useState<OnboardingTemplateStep | null>(null);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      is_default: false,
      steps: [],
    },
  });
  
  const stepForm = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      title: "",
      description: "",
      order_index: 1,
      required_document_categories: [],
    },
  });

  useEffect(() => {
    loadTemplatesAndSubscriptions();
  }, []);

  const loadTemplatesAndSubscriptions = async () => {
    setIsLoading(true);
    try {
      const [templatesData, subscriptionsData] = await Promise.all([
        getOnboardingTemplates(),
        getSubscriptionTiers()
      ]);
      
      setTemplates(templatesData);
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load templates and subscriptions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = () => {
    form.reset({
      name: "",
      description: "",
      is_default: false,
      steps: [],
    });
    setIsEditing(false);
    setCurrentTemplate(null);
    setShowTemplateDialog(true);
  };

  const handleEditTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      const template = await getTemplateWithSteps(templateId);
      
      if (template) {
        form.reset({
          id: template.id,
          name: template.name,
          description: template.description || "",
          is_default: template.is_default || false,
          steps: template.steps || [],
        });
        setIsEditing(true);
        setCurrentTemplate(template);
        setShowTemplateDialog(true);
      }
    } catch (error) {
      console.error("Error loading template for edit:", error);
      toast({
        title: "Error",
        description: "Failed to load template details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      const template = await getTemplateWithSteps(templateId);
      
      if (template) {
        form.reset({
          name: `${template.name} (Copy)`,
          description: template.description || "",
          is_default: false,
          steps: template.steps || [],
        });
        setIsEditing(false);
        setCurrentTemplate(null);
        setShowTemplateDialog(true);
        
        toast({
          title: "Template duplicated",
          description: "You can now edit the duplicated template.",
        });
      }
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate template.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkTemplateToSubscription = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedSubscriptionId(null);
    setShowLinkDialog(true);
  };

  const handleSaveLinkToSubscription = async () => {
    if (!selectedTemplateId || !selectedSubscriptionId) {
      toast({
        title: "Error",
        description: "Please select a subscription tier.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await linkTemplateToSubscription(selectedSubscriptionId, selectedTemplateId, true);
      
      if (result) {
        toast({
          title: "Success",
          description: "Template linked to subscription tier.",
        });
        setShowLinkDialog(false);
      }
    } catch (error) {
      console.error("Error linking template to subscription:", error);
      toast({
        title: "Error",
        description: "Failed to link template to subscription.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteDialog(true);
  };

  const handleDeleteTemplate = async () => {
    if (templateToDelete) {
      try {
        setIsLoading(true);
        const success = await deleteOnboardingTemplate(templateToDelete);
        
        if (success) {
          loadTemplatesAndSubscriptions();
          
          toast({
            title: "Template deleted",
            description: "The template has been deleted successfully.",
          });
        } else {
          throw new Error("Failed to delete template");
        }
      } catch (error) {
        console.error("Error deleting template:", error);
        toast({
          title: "Error",
          description: "Failed to delete template.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setShowDeleteDialog(false);
        setTemplateToDelete(null);
      }
    }
  };

  const handleAddStep = () => {
    stepForm.reset({
      title: "",
      description: "",
      order_index: (form.getValues("steps")?.length || 0) + 1,
      required_document_categories: [],
    });
    setStepToEdit(null);
    setStepIndex(null);
    setShowStepDialog(true);
  };

  const handleEditStep = (step: OnboardingTemplateStep, index: number) => {
    stepForm.reset({
      id: step.id,
      title: step.title,
      description: step.description || "",
      order_index: step.order_index,
      required_document_categories: step.required_document_categories || [],
    });
    setStepToEdit(step);
    setStepIndex(index);
    setShowStepDialog(true);
  };

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

  const handleMoveStepUp = (index: number) => {
    if (index === 0) return;
    
    const currentSteps = form.getValues("steps");
    const newSteps = [...currentSteps];
    
    // Swap the steps
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    
    // Update order_index values
    newSteps.forEach((step, i) => {
      step.order_index = i + 1;
    });
    
    form.setValue("steps", newSteps);
  };

  const handleMoveStepDown = (index: number) => {
    const currentSteps = form.getValues("steps");
    
    if (index === currentSteps.length - 1) return;
    
    const newSteps = [...currentSteps];
    
    // Swap the steps
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    
    // Update order_index values
    newSteps.forEach((step, i) => {
      step.order_index = i + 1;
    });
    
    form.setValue("steps", newSteps);
  };

  const onStepSubmit = (data: StepFormValues) => {
    const currentSteps = form.getValues("steps") || [];
    
    const stepData: OnboardingTemplateStep = {
      ...data,
      title: data.title || '',
      id: stepToEdit?.id || `step-${Date.now()}`
    };
    
    if (stepIndex !== null) {
      // Update existing step
      const newSteps = [...currentSteps];
      newSteps[stepIndex] = stepData;
      form.setValue("steps", newSteps);
    } else {
      // Add new step
      form.setValue("steps", [
        ...currentSteps,
        stepData
      ]);
    }
    
    setShowStepDialog(false);
    stepForm.reset();
  };

  const onTemplateSubmit = async (data: TemplateFormValues) => {
    try {
      setIsLoading(true);
      
      // Ensure steps have correct order indexes and required properties
      const stepsWithCorrectOrder: OnboardingTemplateStep[] = data.steps.map((step, index) => ({
        ...step,
        order_index: index + 1,
        title: step.title || '',
      }));
      
      let result;
      
      if (isEditing && currentTemplate) {
        // Update existing template
        result = await updateOnboardingTemplate(currentTemplate.id, {
          ...data,
          steps: stepsWithCorrectOrder
        });
      } else {
        // Create new template
        result = await createOnboardingTemplate({
          ...data,
          steps: stepsWithCorrectOrder
        });
      }
      
      if (result) {
        // Refresh templates list
        loadTemplatesAndSubscriptions();
        
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
      } else {
        throw new Error("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Onboarding Templates</h2>
        <Button onClick={handleAddTemplate} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : templates.length === 0 ? (
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
                <div className="flex items-center justify-between">
                  <CardTitle>{template.name}</CardTitle>
                  {template.is_default && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{template.steps?.length || 0} Steps</Badge>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="steps">
                    <AccordionTrigger>View Steps</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 mt-2">
                        {template.steps && template.steps.map((step, index) => (
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
                            {step.required_document_categories && step.required_document_categories.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {step.required_document_categories.map((category) => (
                                  <Badge key={category} variant="outline" className="text-xs">
                                    {category.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            )}
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
                    onClick={() => handleLinkTemplateToSubscription(template.id)}
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Link to Tier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template.id)}
                    disabled={isLoading}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditTemplate(template.id)}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleConfirmDelete(template.id)}
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    disabled={isLoading}
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
                
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Default Template</FormLabel>
                        <FormDescription>
                          Make this the default template for new clients
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                                        {step.required_document_categories && step.required_document_categories.length > 0 && (
                                          <div className="mt-1 flex flex-wrap gap-1">
                                            {step.required_document_categories.map((category) => (
                                              <Badge key={category} variant="outline" className="text-xs">
                                                {category.replace('_', ' ')}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
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
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Saving...
                    </>
                  ) : isEditing ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
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
              
              <FormField
                control={stepForm.control}
                name="required_document_categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Documents</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {["id_verification", "address_proof", "business_certificate", "tax_document", "contract_agreement", "company_logo"].map((category) => (
                        <Badge 
                          key={category}
                          variant={field.value?.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const currentCategories = field.value || [];
                            if (currentCategories.includes(category)) {
                              field.onChange(currentCategories.filter(cat => cat !== category));
                            } else {
                              field.onChange([...currentCategories, category]);
                            }
                          }}
                        >
                          {category.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>
                      Select any documents required to complete this step
                    </FormDescription>
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
      
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Link Template to Subscription</DialogTitle>
            <DialogDescription>
              Associate this template with a subscription tier to automatically assign it to clients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription Tier</label>
              <Select value={selectedSubscriptionId || ""} onValueChange={setSelectedSubscriptionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subscription tier" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((subscription) => (
                    <SelectItem key={subscription.id} value={subscription.id}>
                      {subscription.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This will set the template as the default for new clients with this subscription.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLinkDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLinkToSubscription} disabled={!selectedSubscriptionId}>
              Link Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
