
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompleteOnboardingButtonProps {
  clientId: string;
  progress: number;
  isProcessing: boolean;
  onComplete: (id: string) => Promise<void>;
}

export function CompleteOnboardingButton({
  clientId,
  progress,
  isProcessing,
  onComplete,
}: CompleteOnboardingButtonProps) {
  const isReady = progress >= 80;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              variant={isReady ? "outline" : "ghost"}
              size="sm"
              onClick={() => onComplete(clientId)}
              disabled={isProcessing}
              className={`h-8 gap-1 transition-all ${
                isReady 
                  ? "border-green-200 text-green-700 hover:bg-green-50" 
                  : "text-amber-600"
              } ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isProcessing ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  {isReady ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isReady ? "Complete" : "Not Ready"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          {isProcessing ? (
            <p>Processing completion request...</p>
          ) : isReady ? (
            <p>Mark client onboarding as complete and activate their account</p>
          ) : (
            <div className="space-y-1 max-w-[200px]">
              <p className="font-medium text-amber-700">Client not ready</p>
              <p className="text-xs">
                This client has only completed {progress}% of their onboarding steps.
                It's recommended to wait until they reach at least 80% completion.
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
