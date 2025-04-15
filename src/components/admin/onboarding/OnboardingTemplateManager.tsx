import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { OnboardingTemplateStep } from "@/lib/types/client-types";
import { getSubscriptionTiers } from "@/lib/subscription-management";

interface OnboardingTemplate {
  id: string;
  name: string;
  description?: string;
  steps: OnboardingTemplateStep[];
}

const OnboardingTemplateManager = () => {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [steps, setSteps] = useState<OnboardingTemplateStep[]>([]);
  const [isDefaultTemplate, setIsDefaultTemplate] = useState(false);
  const [draggedStep, setDraggedStep] = useState<OnboardingTemplateStep | null>(null);
  
  // Form schema for step
  const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().optional(),
    order_index: z.number(),
    required_document_categories: z.array(z.string()).optional(),
  })
  
  // Hook form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      order_index: 0,
      required_document_categories: [],
    },
  })
  
  // Add a new step
  const handleAddStep = () => {
    // Create a new step with required fields
    const newStep: OnboardingTemplateStep = {
      id: `step-${Date.now()}`,
      title: "New Step", // Set a default title to satisfy the required property
      order_index: steps.length,
      description: "",
      required_document_categories: []
    };
    
    setSteps([...steps, newStep]);
  };
  
  // Update step details
  const handleUpdateStep = (id: string, updatedFields: Partial<OnboardingTemplateStep>) => {
    const updatedSteps = steps.map(step =>
      step.id === id ? { ...step, ...updatedFields } : step
    );
    setSteps(updatedSteps);
  };
  
  // Delete a step
  const handleDeleteStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    setSteps(updatedSteps);
  };
  
  // Create a new template
  const createTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newTemplate = {
      steps: steps,
      name: templateName.trim(), // Ensure name is provided
      description: templateDescription,
      is_default: isDefaultTemplate
    };
    
    console.log("Creating template:", newTemplate);
    toast({
      title: "Template Created",
      description: `${templateName} has been created`,
    });
  };
  
  // Drag start step handler
  const handleDragStartStep = (e, stepData) => {
    setDraggedStep(stepData);
  };
  
  // Dragover step handler
  const handleDragOverStep = (e, stepData) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    if (draggedStep && stepData.id !== draggedStep.id) {
      // Make a copy of the steps array
      const stepsCopy = [...steps];
      
      // Find indices
      const fromIndex = stepsCopy.findIndex(s => s.id === draggedStep.id);
      const toIndex = stepsCopy.findIndex(s => s.id === stepData.id);
      
      if (fromIndex !== -1) {
        // Remove the dragged step
        const [removed] = stepsCopy.splice(fromIndex, 1);
        
        // Ensure the removed step has a title
        const step: OnboardingTemplateStep = {
          ...removed,
          title: removed.title || "Untitled Step" // Ensure title is provided
        };
        
        // Insert at the new position
        stepsCopy.splice(toIndex, 0, step);
        
        // Update the order_index values
        const updatedSteps = stepsCopy.map((step, index) => ({
          ...step,
          order_index: index
        }));
        
        // Update state
        setSteps(updatedSteps);
      }
    }
  };
  
  // Drop step handler
  const handleDropStep = (e, stepData) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Template Manager</CardTitle>
          <CardDescription>Create and manage onboarding templates</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                type="text"
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="templateDescription">Template Description</Label>
              <Input
                type="text"
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="defaultTemplate">Set as Default Template</Label>
            <Checkbox
              id="defaultTemplate"
              checked={isDefaultTemplate}
              onCheckedChange={(checked) => setIsDefaultTemplate(!!checked)}
            />
          </div>
          <Button onClick={handleAddStep}>Add Step</Button>
          
          <Table>
            <TableCaption>A list of your tasks.</TableCaption>
            <TableHead>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHead>
            <TableBody>
              {steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell>{step.title}</TableCell>
                  <TableCell>{step.description}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleDeleteStep(step.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Button onClick={createTemplate}>Create Template</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTemplateManager;
