"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useStepItem } from "./stepper"

interface StepperTitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

const StepperTitle = React.forwardRef<HTMLSpanElement, StepperTitleProps>(
  ({ className, ...props }, ref) => {
    const { state } = useStepItem()

    return (
      <span
        ref={ref}
        className={cn(
          "text-sm font-semibold transition-colors duration-200",
          state === "inactive" ? "text-muted-foreground" : "text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
StepperTitle.displayName = "StepperTitle"

interface StepperDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const StepperDescription = React.forwardRef<HTMLParagraphElement, StepperDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { state } = useStepItem()

    return (
      <p
        ref={ref}
        className={cn(
          "text-xs text-muted-foreground transition-colors duration-200 lg:text-sm",
          state === "active" && "text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
StepperDescription.displayName = "StepperDescription"

export { StepperTitle, StepperDescription }
export type { StepperTitleProps, StepperDescriptionProps }
