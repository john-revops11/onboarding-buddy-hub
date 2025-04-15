
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChecklistItem as ChecklistItemType } from "@/types/onboarding";
import { ChecklistItemComponent } from "./ChecklistItem";
import { Loader2 } from "lucide-react";

interface ChecklistSectionProps {
  checklist: ChecklistItemType[];
  onCompleteTask: (id: string, isCompleted?: boolean) => void;
  areRequiredDocumentsUploaded: (task: ChecklistItemType) => boolean;
  isLoading?: boolean;
}

export const ChecklistSection = ({
  checklist,
  onCompleteTask,
  areRequiredDocumentsUploaded,
  isLoading = false,
}: ChecklistSectionProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Checklist</CardTitle>
          <CardDescription>
            Loading your personalized onboarding steps
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">Loading your checklist...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Checklist</CardTitle>
        <CardDescription>
          Follow these steps to complete your onboarding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {checklist.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No checklist items found</p>
          </div>
        ) : (
          checklist.map((item) => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              onComplete={onCompleteTask}
              areRequiredDocumentsUploaded={areRequiredDocumentsUploaded}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
