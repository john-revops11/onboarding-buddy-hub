
import { Progress } from "@/components/ui/progress";

interface ClientProgressIndicatorProps {
  progress: number;
  stepsCompleted: number;
  totalSteps: number;
}

export function ClientProgressIndicator({ 
  progress, 
  stepsCompleted, 
  totalSteps 
}: ClientProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={progress} className="h-2 w-[100px]" />
      <span className="text-xs text-muted-foreground">
        {stepsCompleted}/{totalSteps}
      </span>
    </div>
  );
}
