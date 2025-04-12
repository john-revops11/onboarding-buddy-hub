
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-accentGreen-600/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "h-11 min-w-[136px] bg-primary-700 text-white hover:bg-primary-600 font-medium",
        destructive:
          "h-11 min-w-[136px] bg-error-600 text-white hover:bg-error-700 font-medium",
        outline:
          "h-11 min-w-[136px] border border-neutral-200 bg-background text-primary-700 hover:bg-primary-50 hover:text-primary-700 font-medium",
        secondary:
          "h-11 min-w-[136px] bg-neutral-200 text-neutral-900 hover:bg-neutral-300 font-medium",
        ghost: "text-primary-700 hover:bg-primary-50 hover:text-primary-700",
        link: "text-primary-700 underline-offset-4 hover:underline",
        icon: "h-11 w-11 p-0 bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-primary-700",
        success: "h-11 min-w-[136px] bg-accentGreen-600 text-white hover:bg-accentGreen-600/90 font-medium",
        warning: "h-11 min-w-[136px] bg-warning-600 text-white hover:bg-warning-700 font-medium",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-11 w-11",
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
    
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }
    
    return (
      <motion.button
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props as any} // Using type assertion to resolve the incompatible event handler types
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
