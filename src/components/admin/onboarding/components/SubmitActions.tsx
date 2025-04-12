
import { Button } from "@/components/ui/button";

interface SubmitActionsProps {
  isSubmitting: boolean;
  onPrev: () => void;
}

export function SubmitActions({ isSubmitting, onPrev }: SubmitActionsProps) {
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onPrev}>
        Previous: Team Members
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit & Send Invitations"}
      </Button>
    </div>
  );
}
