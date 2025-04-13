
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  isActive: boolean;
  isError: boolean;
  isChecking?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onView,
  onDelete,
  isActive,
  isError,
  isChecking = false
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onEdit}
        disabled={isChecking}
      >
        Edit
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onView}
                disabled={isError || isChecking}
              >
                View
              </Button>
            </span>
          </TooltipTrigger>
          {isError && (
            <TooltipContent>
              <p>First configure the integration to view details</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={onDelete}
                disabled={(!isActive && !isError) || isChecking}
              >
                Delete
              </Button>
            </span>
          </TooltipTrigger>
          {(!isActive && !isError) && (
            <TooltipContent>
              <p>Nothing to delete - integration is not configured</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
