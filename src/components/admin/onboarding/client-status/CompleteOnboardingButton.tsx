
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CompleteOnboardingButtonProps {
  clientId: string;
  progress: number;
  isProcessing: boolean;
  onComplete: (id: string) => void;
}

export function CompleteOnboardingButton({
  clientId,
  progress,
  isProcessing,
  onComplete,
}: CompleteOnboardingButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isProcessing || progress < 100}
          className={progress === 100 ? "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200" : ""}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-1" />
          )}
          Complete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Onboarding</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark this client's onboarding as complete?
            This will grant them full access to the dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onComplete(clientId)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Complete Onboarding
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
