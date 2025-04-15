
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  textPosition?: "top" | "right" | "inside";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value, 
  indicatorColor,
  showValue = false,
  size = "md",
  textPosition = "right",
  ...props 
}, ref) => {
  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  }
  
  const height = heights[size];
  
  return (
    <div className={showValue ? "flex items-center gap-2" : ""}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-neutral-100",
          height,
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-300 ease-in-out",
            indicatorColor || "bg-[#8ab454]"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        >
          {textPosition === "inside" && value !== undefined && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-sm">
                {Math.round(value)}%
              </span>
            </div>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
      
      {showValue && textPosition !== "inside" && (
        <div className={`text-sm font-medium ${textPosition === "top" ? "self-start" : ""}`}>
          {Math.round(value || 0)}%
        </div>
      )}
    </div>
  )
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
