
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus:outline focus:outline-2 focus:outline-accentGreen-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "h-10 min-w-[120px] bg-primary-700 text-white hover:bg-primary-600 font-medium",
        destructive:
          "h-10 min-w-[120px] bg-error-600 text-white hover:bg-error-700 font-medium",
        outline:
          "h-10 min-w-[120px] border border-neutral-200 bg-background text-primary-700 hover:bg-primary-50 hover:text-primary-700 font-medium",
        secondary:
          "h-10 min-w-[120px] bg-neutral-200 text-neutral-900 hover:bg-neutral-300 font-medium",
        ghost: "text-primary-700 hover:bg-primary-50 hover:text-primary-700",
        link: "text-primary-700 underline-offset-4 hover:underline",
        icon: "h-10 w-10 p-0 bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-primary-700",
        success: "h-10 min-w-[120px] bg-accentGreen-600 text-white hover:bg-accentGreen-700 font-medium",
        warning: "h-10 min-w-[120px] bg-warning-600 text-white hover:bg-warning-700 font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
