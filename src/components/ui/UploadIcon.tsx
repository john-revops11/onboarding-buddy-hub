
import React from "react";
import { cn } from "@/lib/utils";
import { LucideProps, UploadCloud } from "lucide-react";

export interface UploadIconProps extends LucideProps {
  className?: string;
}

export function UploadIcon({ className, ...props }: UploadIconProps) {
  return (
    <UploadCloud
      className={cn("h-4 w-4", className)}
      {...props}
    />
  );
}
