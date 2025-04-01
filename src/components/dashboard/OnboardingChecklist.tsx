
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, ExternalLink, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  clientAction: boolean;
  actionType: "manual" | "link" | "upload";
  actionTarget?: string;
}

interface OnboardingChecklistProps {
  clientName?: string;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ clientName = "Client" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mock checklist data - in a real app, this would come from an API
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "mNDA Signed",
      description: "Please sign and return the mutual non-disclosure agreement.",
      completed: true,
      clientAction: true,
      actionType: "manual"
    },
    {
      id: "2",
      title: "Complete Questionnaire",
      description: "Fill out our detailed questionnaire to help us understand your business needs.",
      completed: false,
      clientAction: true,
      actionType: "link",
      actionTarget: "https://surveymonkey.com/example-questionnaire"
    },
    {
      id: "3",
      title: "Initial Data Submission",
      description: "Upload your initial data files for analysis.",
      completed: false,
      clientAction: true,
      actionType: "upload"
    },
    {
      id: "4",
      title: "Data Health Check",
      description: "Our team will perform a data quality assessment on your uploaded files.",
      completed: false,
      clientAction: false,
      actionType: "manual"
    },
    {
      id: "5",
      title: "Activate Revify",
      description: "Your Revify instance will be activated with your data integrated.",
      completed: false,
      clientAction: false,
      actionType: "manual"
    },
    {
      id: "6",
      title: "Schedule Initial Diagnostic Review",
      description: "Schedule a call to review initial findings and next steps.",
      completed: false,
      clientAction: true,
      actionType: "link",
      actionTarget: "https://calendly.com/revify-team/diagnostic-review"
    },
  ]);
  
  const handleToggleChecklist = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleToggleItem = (id: string) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Onboarding Checklist</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleChecklist}
            aria-label={isExpanded ? "Collapse checklist" : "Expand checklist"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        <CardDescription>
          Complete these steps to fully set up your Revify account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">
            Progress: {completedCount} of {checklistItems.length} complete
          </div>
          <div className="text-sm font-medium">{Math.round(progress)}%</div>
        </div>
        <Progress value={progress} className="h-2" />
        
        {isExpanded && (
          <div className="space-y-4 mt-4">
            {checklistItems.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "p-3 border rounded-lg transition-colors",
                  item.completed ? "bg-muted/50 border-muted-foreground/20" : "bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
                    <Checkbox 
                      id={`checklist-item-${item.id}`} 
                      checked={item.completed}
                      onCheckedChange={() => handleToggleItem(item.id)}
                      disabled={!item.clientAction}
                    />
                  </div>
                  <div className="grid gap-1.5 leading-none">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`checklist-item-${item.id}`}
                        className={cn(
                          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                          item.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {index + 1}. {item.title}
                      </label>
                      {!item.clientAction && (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                          Revify Action
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.actionType === "link" && item.actionTarget && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full sm:w-auto" 
                        asChild
                      >
                        <a 
                          href={item.actionTarget} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink size={14} className="mr-2" />
                          {item.title === "Complete Questionnaire" ? "Open Questionnaire" : "Schedule Call"}
                        </a>
                      </Button>
                    )}
                    {item.actionType === "upload" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full sm:w-auto"
                        onClick={() => {}}
                      >
                        Upload Files
                      </Button>
                    )}
                  </div>
                  {item.completed && (
                    <div className="ml-auto">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check size={12} className="text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {isExpanded && (
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={handleToggleChecklist}
          >
            Collapse Checklist
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OnboardingChecklist;
