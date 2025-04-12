
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  prevTab?: () => void;
  nextTab: () => void;
  showPrevious?: boolean;
}

export default function FormNavigation({ 
  prevTab, 
  nextTab, 
  showPrevious = true 
}: FormNavigationProps) {
  return (
    <div className="flex justify-between">
      {showPrevious && prevTab ? (
        <Button type="button" variant="outline" onClick={prevTab}>
          Previous
        </Button>
      ) : (
        <div></div> // Empty div to maintain flex spacing
      )}
      <Button type="button" onClick={nextTab}>
        Next
      </Button>
    </div>
  );
}
