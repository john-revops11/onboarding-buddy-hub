
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ClientProgressIndicatorProps {
  progress: number;
  stepsCompleted: number;
  totalSteps: number;
}

export function ClientProgressIndicator({
  progress,
  stepsCompleted,
  totalSteps
}: ClientProgressIndicatorProps) {
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-amber-500";
    if (progress < 75) return "bg-blue-500";
    return "bg-[#8ab454]";
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-[100px] h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} rounded-full transition-all`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium">{progress}%</span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Info className="h-3.5 w-3.5 text-neutral-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="space-y-2 max-w-[200px]">
                <p className="text-sm font-medium">Onboarding Progress</p>
                <p className="text-xs">
                  Client has completed {stepsCompleted} of {totalSteps} onboarding steps.
                </p>
                {progress === 100 ? (
                  <p className="text-xs text-green-600 font-medium">All steps complete!</p>
                ) : (
                  <p className="text-xs text-amber-600 font-medium">Onboarding in progress</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-xs text-muted-foreground">
        {stepsCompleted} of {totalSteps} steps
      </p>
    </div>
  );
}
