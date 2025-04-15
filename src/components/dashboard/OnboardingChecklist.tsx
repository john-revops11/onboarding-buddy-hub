
import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Check, 
  Clock,
  FileText,
  Upload,
  Calendar,
  ClipboardCheck,
  Shield,
  BarChart2,
  InfoIcon,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  clientAction: boolean;
  actionType: "manual" | "link" | "upload";
  actionTarget?: string;
  icon?: React.ReactNode;
  dueDate?: string;
}

interface OnboardingChecklistProps {
  clientName?: string;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ clientName = "Client" }) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Check if user is viewing the checklist for the first time
  useEffect(() => {
    const hasSeenChecklist = localStorage.getItem("hasSeenChecklist");
    if (hasSeenChecklist) {
      setIsFirstTimeUser(false);
    } else {
      // Show welcome message for first-time users
      setTimeout(() => {
        toast({
          title: "Welcome to your onboarding checklist!",
          description: "Complete these steps to get started with Revify.",
        });
        localStorage.setItem("hasSeenChecklist", "true");
      }, 1000);
    }
  }, [toast]);
  
  // Toggle tooltip visibility
  const handleTooltipToggle = (id: string | null) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  // Mock checklist data - in a real app, this would come from an API
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Contract Signed",
      description: "Revify agreement finalized.",
      completed: true,
      clientAction: true,
      actionType: "manual",
      icon: <FileText size={18} className="text-green-500" />,
      dueDate: "Completed"
    },
    {
      id: "2",
      title: "Complete Data Questionnaire",
      description: "Provide details about your data sources and structure.",
      completed: false,
      clientAction: true,
      actionType: "link",
      actionTarget: "https://docs.google.com/forms/d/e/1FAIpQLSdG8wss8NTjT-1_3S2vM-0iJ7xJEFrX7J0sxSx4c4vKT_E0rg/viewform",
      icon: <ClipboardCheck size={18} className="text-amber-500" />,
      dueDate: "Due in 3 days"
    },
    {
      id: "3",
      title: "Initial Data Submission",
      description: "Upload your initial data files for analysis.",
      completed: false,
      clientAction: true,
      actionType: "upload",
      icon: <Upload size={18} className="text-blue-500" />,
      dueDate: "Due in 5 days"
    },
    {
      id: "4",
      title: "Data Health Check Review",
      description: "Our team will perform a data quality assessment on your uploaded files.",
      completed: false,
      clientAction: false,
      actionType: "manual",
      icon: <Shield size={18} className="text-purple-500" />,
      dueDate: "Expected by Apr 15"
    },
    {
      id: "5",
      title: "Activate Revify Analytics",
      description: "Your Revify instance will be activated with your data integrated.",
      completed: false,
      clientAction: false,
      actionType: "manual",
      icon: <BarChart2 size={18} className="text-purple-500" />,
      dueDate: "Expected by Apr 20"
    },
    {
      id: "6",
      title: "Schedule Initial Diagnostic Review",
      description: "Schedule a call to review initial findings and next steps.",
      completed: false,
      clientAction: true,
      actionType: "link",
      actionTarget: "https://calendly.com/revify-team/diagnostic-review",
      icon: <Calendar size={18} className="text-green-500" />,
      dueDate: "Due by Apr 22"
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
    
    // Show a toast when an item is marked complete
    const item = checklistItems.find(item => item.id === id);
    if (item && !item.completed) {
      toast({
        title: "Task completed",
        description: `You've completed: ${item.title}`,
        className: "bg-green-50 text-green-900 border-green-200",
      });
    }
  };
  
  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;
  
  // Calculate the stage based on completed items
  const getStage = () => {
    if (completedCount === 0) return "Getting Started";
    if (completedCount <= 2) return "Initial Setup";
    if (completedCount <= 4) return "Data Integration";
    return "Final Configuration";
  };

  return (
    <Card className={cn(
      "transition-all duration-300 overflow-hidden",
      isFirstTimeUser && !isExpanded ? "shadow-lg ring-2 ring-[#8ab454]/30" : ""
    )}>
      <CardHeader className={cn(
        "pb-3",
        isFirstTimeUser && !isExpanded ? "bg-[#8ab454]/5" : ""
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">Your Onboarding Journey</CardTitle>
            {isFirstTimeUser && !isExpanded && (
              <Badge variant="default" className="ml-2 bg-[#8ab454] hover:bg-[#75a33d] animate-pulse-subtle">New</Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleChecklist}
            aria-label={isExpanded ? "Collapse checklist" : "Expand checklist"}
            className="hover:bg-[#8ab454]/10"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        <CardDescription className="text-neutral-600">
          Complete these steps to unlock the full power of your Revify portal.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
          <div className="text-sm font-medium flex items-center gap-2 mb-2 sm:mb-0">
            <div className="flex items-center">
              <span className="mr-2">Stage: {getStage()}</span>
              <div 
                className="relative cursor-help"
                onMouseEnter={() => handleTooltipToggle('stages')}
                onMouseLeave={() => handleTooltipToggle(null)}
              >
                <InfoIcon size={14} className="text-neutral-400 hover:text-[#8ab454]" />
                {activeTooltip === 'stages' && (
                  <div className="absolute left-0 bottom-full mb-2 p-3 bg-white rounded-lg shadow-lg border border-neutral-200 w-64 z-50 text-xs animate-fade-in">
                    <strong className="block mb-1 text-neutral-800">Onboarding Stages:</strong>
                    <ul className="space-y-1 text-neutral-600">
                      <li><span className="font-medium">Getting Started:</span> Initial account setup</li>
                      <li><span className="font-medium">Initial Setup:</span> Data questionnaire completion</li>
                      <li><span className="font-medium">Data Integration:</span> Upload and analysis of data</li>
                      <li><span className="font-medium">Final Configuration:</span> Readiness for full platform use</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {completedCount === checklistItems.length && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium animate-fade-in">
                All complete!
              </span>
            )}
          </div>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
            <span className="text-sm font-medium text-neutral-700">Progress</span>
            <span className="text-sm font-medium ml-2">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className="relative h-2 mb-4">
          <Progress 
            value={progress} 
            className={cn(
              "h-2 rounded-full transition-colors", 
              progress === 100 ? "bg-green-100" : ""
            )} 
          />
          {progress > 0 && (
            <div className="absolute top-0 left-0 h-2 rounded-full bg-[#8ab454] transition-all" style={{ width: `${progress}%` }}></div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {checklistItems.map((item, idx) => (
            <div 
              key={item.id}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                item.completed 
                  ? "bg-[#8ab454]" 
                  : idx === completedCount 
                    ? "bg-amber-400" 
                    : "bg-neutral-200"
              )}
              title={item.title}
            />
          ))}
        </div>
        
        {!isExpanded && completedCount < checklistItems.length && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border border-[#8ab454]/40 hover:border-[#8ab454]/70 hover:bg-[#8ab454]/5 hover-lift"
              onClick={handleToggleChecklist}
            >
              View {checklistItems.length - completedCount} pending tasks
            </Button>
          </div>
        )}
        
        {isExpanded && (
          <div className="space-y-4 mt-4">
            {checklistItems.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "p-4 border rounded-lg transition-all duration-200 hover:border-[#8ab454]/30 group",
                  item.completed 
                    ? "bg-neutral-50 border-neutral-200" 
                    : index === completedCount
                      ? "bg-white border-amber-200 ring-1 ring-amber-200" 
                      : "bg-white border-neutral-200"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center pt-0.5">
                    <Checkbox 
                      id={`checklist-item-${item.id}`} 
                      checked={item.completed}
                      onCheckedChange={() => handleToggleItem(item.id)}
                      disabled={!item.clientAction}
                      className={cn(
                        item.completed ? "bg-[#8ab454] border-[#8ab454]" : "",
                        "rounded transition-all"
                      )}
                    />
                  </div>
                  <div className="grid gap-1.5 leading-none flex-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`checklist-item-${item.id}`}
                        className={cn(
                          "text-sm font-medium leading-none flex items-center gap-2 transition-colors",
                          item.completed 
                            ? "text-neutral-500" 
                            : index === completedCount 
                              ? "text-amber-800" 
                              : "text-neutral-800"
                        )}
                      >
                        {item.icon}
                        <span className={item.completed ? "line-through" : ""}>
                          {index + 1}. {item.title}
                        </span>
                      </label>
                      {!item.clientAction && (
                        <div className="relative ml-2">
                          <span 
                            className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full cursor-help"
                            onMouseEnter={() => handleTooltipToggle(item.id)}
                            onMouseLeave={() => handleTooltipToggle(null)}
                          >
                            Revify Action
                          </span>
                          {activeTooltip === item.id && (
                            <div className="absolute left-0 bottom-full mb-2 p-2 bg-white rounded-lg shadow-lg border border-neutral-200 w-60 z-50 text-xs animate-fade-in">
                              This task will be completed by the Revify team. No action required from you.
                            </div>
                          )}
                        </div>
                      )}
                      {item.dueDate && !item.completed && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full ml-auto",
                          item.dueDate.includes("Due") 
                            ? "bg-amber-50 text-amber-800 border border-amber-200" 
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        )}>
                          {item.dueDate}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.actionType === "link" && item.actionTarget && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-[#8ab454]/5 border-[#8ab454]/20 hover:bg-[#8ab454]/10 hover-lift" 
                          asChild
                        >
                          <a 
                            href={item.actionTarget} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink size={14} className="mr-2" />
                            {item.title.includes("Questionnaire") ? "Open Questionnaire" : "Schedule Call"}
                          </a>
                        </Button>
                      )}
                      {item.actionType === "upload" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-[#8ab454]/5 border-[#8ab454]/20 hover:bg-[#8ab454]/10 hover-lift"
                          onClick={() => window.location.href = '/data-uploads'}
                        >
                          <Upload size={14} className="mr-2" />
                          Upload Files
                        </Button>
                      )}
                    </div>
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
        <CardFooter className="pt-2 flex justify-between">
          <div className="text-xs text-neutral-500 flex items-center">
            <AlertCircle size={12} className="mr-1" />
            Tasks must be completed in order
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-[#8ab454]/5 hover-lift"
            onClick={handleToggleChecklist}
          >
            <ChevronUp className="mr-1 h-4 w-4" />
            Collapse Checklist
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OnboardingChecklist;
