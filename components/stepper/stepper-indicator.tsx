"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStepItem } from "./stepper"

export const stepperIndicatorVariants = cva(
  "relative z-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2 bg-background",
        ghost: "bg-transparent",
      },
      size: {
        sm: "size-8 text-xs",
        default: "size-10",
        lg: "size-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface StepperIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperIndicatorVariants> {
  completedIcon?: React.ReactNode
  activeIcon?: React.ReactNode
  showIcon?: boolean
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  (
    {
      className,
      variant,
      size,
      completedIcon,
      activeIcon,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const { step, state, isClickable } = useStepItem()

    const stateStyles = React.useMemo(() => {
      switch (state) {
        case "completed":
          return "bg-primary text-primary-foreground"
        case "active":
          return "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
        default:
          return cn("bg-muted text-muted-foreground", isClickable && "hover:bg-muted/80")
      }
    }, [state, isClickable])

    const content = React.useMemo(() => {
      if (children) return children
      if (state === "completed" && showIcon) {
        return completedIcon ?? <Check className="size-4" strokeWidth={3} />
      }
      if (state === "active" && showIcon && activeIcon) return activeIcon
      return step
    }, [children, state, showIcon, completedIcon, activeIcon, step])

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(stepperIndicatorVariants({ variant, size }), stateStyles, className)}
        {...props}
      >
        {content}
      </div>
    )
  }
)
StepperIndicator.displayName = "StepperIndicator"

export { StepperIndicator }
export type { StepperIndicatorProps }
