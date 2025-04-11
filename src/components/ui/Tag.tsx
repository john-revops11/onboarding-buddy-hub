
import React from "react";
import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "success" | "warning" | "error" | "info" | "default";
  children: React.ReactNode;
}

export function Tag({
  status = "default",
  className,
  children,
  ...props
}: TagProps) {
  const statusClasses = {
    success: "bg-green-base/20 text-green-base border-green-base/30",
    warning: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    error: "bg-red-500/20 text-red-600 border-red-500/30",
    info: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    default: "bg-gray-200 text-gray-700 border-gray-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold",
        statusClasses[status],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
