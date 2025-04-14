
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitActionsProps {
  isSubmitting: boolean;
  isSendingInvites?: boolean;
  onPrev: () => void;
}

export function SubmitActions({ 
  isSubmitting, 
  isSendingInvites = false,
  onPrev 
}: SubmitActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isSubmitting}
      >
        Previous
      </Button>

      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSendingInvites ? "Sending Invitations..." : "Creating Client..."}
          </>
        ) : (
          "Complete Onboarding"
        )}
      </Button>
    </div>
  );
}
