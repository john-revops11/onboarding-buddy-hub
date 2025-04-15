
import React from "react";
import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Main({ className, children, ...props }: MainProps) {
  return (
    <main className={cn("flex-1", className)} {...props}>
      {children}
    </main>
  );
}
