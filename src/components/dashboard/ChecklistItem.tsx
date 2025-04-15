
import React from 'react';
import { ChecklistItem as ChecklistItemType } from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DOCUMENT_CATEGORIES } from "@/types/onboarding";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onComplete: (id: string, isCompleted?: boolean) => void;
  areRequiredDocumentsUploaded: (task: ChecklistItemType) => boolean;
}

export const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({
  item,
  onComplete,
  areRequiredDocumentsUploaded,
}) => {
  const documentsMissing = item.requiredDocuments && 
    item.requiredDocuments.length > 0 && 
    !areRequiredDocumentsUploaded(item);
  
  // Determine if we can complete this task
  const canComplete = !documentsMissing || item.completed;
  
  return (
    <div 
      className={`p-4 border rounded-md ${
        item.completed 
          ? "bg-green-50 border-green-200" 
          : documentsMissing 
            ? "bg-amber-50 border-amber-200" 
            : "bg-white hover:bg-slate-50"
      } transition-colors`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox
            checked={item.completed}
            onCheckedChange={(checked) => {
              if (canComplete) {
                onComplete(item.id, checked === true);
              }
            }}
            disabled={documentsMissing && !item.completed}
            className={item.completed ? "bg-green-500 text-white border-green-500" : ""}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${item.completed ? "text-green-700" : ""}`}>
              {item.title}
            </h3>
            
            {/* Status indicator */}
            {item.completed ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 gap-1 border-green-200">
                <Check className="h-3 w-3" />
                Completed
              </Badge>
            ) : documentsMissing ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 gap-1 border-amber-200">
                <AlertCircle className="h-3 w-3" />
                Documents Required
              </Badge>
            ) : null}
          </div>
          
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          )}
          
          {/* Required Documents */}
          {item.requiredDocuments && item.requiredDocuments.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Required Documents:</p>
              <div className="flex flex-wrap gap-1">
                {item.requiredDocuments.map((category) => (
                  <TooltipProvider key={category}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs gap-1">
                          <File className="h-3 w-3" />
                          {DOCUMENT_CATEGORIES[category]}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload this document type to proceed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
          
          {/* Addon indicator */}
          {item.isAddonStep && item.addonName && (
            <Badge variant="secondary" className="mt-2 text-xs">
              Add-on: {item.addonName}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
