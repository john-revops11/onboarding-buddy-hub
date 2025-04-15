
import { Loader2, Save, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SubmitActionsProps {
  isSubmitting: boolean;
  onPrev: () => void;
}

export function SubmitActions({ isSubmitting, onPrev }: SubmitActionsProps) {
  return (
    <div className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrev} 
        disabled={isSubmitting}
        className="gap-2 border-brand text-brand"
      >
        <ChevronLeft size={18} />
        Previous: Team Members
      </Button>
      
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        variant="brand"
        className="gap-2 font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Save size={18} />
            Submit & Save
          </>
        )}
      </Button>
    </div>
  );
}
