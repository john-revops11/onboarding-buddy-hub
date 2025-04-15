
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#8ab454] text-white hover:bg-[#75a33d] focus-visible:ring-[#8ab454]/50 shadow-sm",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400 shadow-sm",
        outline:
          "border border-neutral-200 bg-transparent text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400",
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400",
        link: "text-[#8ab454] underline-offset-4 hover:underline focus-visible:ring-[#8ab454]/50",
        success: "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-400 shadow-sm",
        warning: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400 shadow-sm",
        info: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-400 shadow-sm",
        
        // Brand-specific variants
        brand: "bg-[#8ab454] text-white hover:bg-[#75a33d] focus-visible:ring-[#8ab454]/50 shadow-sm",
        "brand-outline": "border border-[#8ab454] bg-transparent text-[#8ab454] hover:bg-[#8ab454]/10 focus-visible:ring-[#8ab454]/50",
        "brand-ghost": "text-[#8ab454] hover:bg-[#8ab454]/10 focus-visible:ring-[#8ab454]/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2 py-1 text-xs rounded",
        sm: "h-9 px-3 py-1.5 text-sm rounded",
        lg: "h-11 px-6 py-2.5 text-base rounded-xl",
        xl: "h-12 px-8 py-3 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-full p-2",
      },
      isLoading: {
        true: "relative text-transparent hover:text-transparent cursor-wait",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isLoading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    loadingText,
    icon,
    iconPosition = "left",
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Button content with optional icon
    const buttonContent = (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="animate-spin h-4 w-4 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        
        {iconPosition === "left" && icon && <span className="shrink-0">{icon}</span>}
        {isLoading && loadingText ? loadingText : children}
        {iconPosition === "right" && icon && <span className="shrink-0">{icon}</span>}
      </>
    )
    
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, isLoading, className }))}
          ref={ref}
          {...props}
        >
          {buttonContent}
        </Comp>
      )
    }
    
    return (
      <motion.button
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(buttonVariants({ variant, size, isLoading, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props as any} // Using type assertion to resolve the incompatible event handler types
      >
        {buttonContent}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
