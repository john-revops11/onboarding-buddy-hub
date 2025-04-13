
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitActionsProps {
  isSubmitting: boolean;
  onPrev: () => void;
}

export function SubmitActions({ isSubmitting, onPrev }: SubmitActionsProps) {
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
        Previous: Team Members
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="gap-2 bg-primary-700 text-white hover:bg-primary-600"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Save size={18} />
            Submit & Send Invitations
          </>
        )}
      </Button>
    </div>
  );
}
