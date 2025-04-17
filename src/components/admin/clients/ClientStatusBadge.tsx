
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ClientStatusBadgeProps {
  progress: number;
  completedSteps: number;
  totalSteps: number;
}

export const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ 
  progress, 
  completedSteps, 
  totalSteps 
}) => {
  // Determine status based on progress
  const getStatus = () => {
    if (progress === 100) return "completed";
    if (progress >= 1) return "in-progress";
    return "not-started";
  };

  const status = getStatus();
  
  // Choose badge color based on status
  const getBadgeVariant = () => {
    switch(status) {
      case "completed": 
        return "success";
      case "in-progress": 
        return "default";
      default: 
        return "outline";
    }
  };

  // Render badge based on status
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={getBadgeVariant()}
            className="flex items-center gap-1 cursor-help"
          >
            {status === "completed" ? (
              <>
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </>
            ) : status === "in-progress" ? (
              <>
                <Clock className="h-3 w-3" />
                <span>In Progress ({progress}%)</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                <span>Not Started</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Onboarding Progress</p>
            <p className="text-xs">
              {completedSteps} of {totalSteps} steps completed
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
