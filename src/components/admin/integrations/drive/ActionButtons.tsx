
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  isActive: boolean;
  isError: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onView,
  onDelete,
  isActive,
  isError
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onView}
        disabled={isError}
      >
        View
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-destructive hover:text-destructive"
        onClick={onDelete}
        disabled={!isActive && !isError}
      >
        Delete
      </Button>
    </div>
  );
};
