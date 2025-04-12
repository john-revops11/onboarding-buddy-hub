
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export function LoadingIndicator({ 
  message = "Loading data...", 
  size = "medium" 
}: LoadingIndicatorProps) {
  const sizeClass = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClass[size]} animate-spin text-primary mb-4`} />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
