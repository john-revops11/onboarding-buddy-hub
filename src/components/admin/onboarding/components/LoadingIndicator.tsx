
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = "Loading data..." }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
