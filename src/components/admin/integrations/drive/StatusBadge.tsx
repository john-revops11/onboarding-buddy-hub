
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusBadgeProps {
  isChecking: boolean;
  isActive: boolean;
  isError: boolean;
  errorType?: "connection" | "missing" | "auth";
  errorMessage?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isChecking,
  isActive,
  isError,
  errorType = "connection",
  errorMessage
}) => {
  if (isChecking) {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
          Checking...
        </div>
      </Badge>
    );
  }

  if (isError) {
    let badgeText;
    let tooltipText;
    
    switch (errorType) {
      case "connection":
        badgeText = "Connection error";
        tooltipText = errorMessage || "Unable to connect to the Edge Function. Please check network connection.";
        break;
      case "auth":
        badgeText = "Auth error";
        tooltipText = errorMessage || "The service account has auth or permission issues.";
        break;
      default:
        badgeText = "Missing key";
        tooltipText = errorMessage || "No service account key found. Upload a key to activate.";
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
              {badgeText}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isActive) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
        Active
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Missing key
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>No service account key found. Upload a key to activate.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
