"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useStepper, useStepItem } from "./stepper"

interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean
}

const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, completed, ...props }, ref) => {
    const { orientation } = useStepper()
    const { state, isLastStep } = useStepItem()

    if (isLastStep) return null

    const isCompleted = completed ?? state === "completed"

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        data-state={isCompleted ? "completed" : "pending"}
        className={cn(
          "shrink-0 transition-colors duration-300 ease-in-out",
          orientation === "horizontal"
            ? "absolute left-[calc(50%+24px)] right-[calc(-50%+16px)] top-5 h-0.5 rounded-full"
            : "absolute left-5 top-11 h-[calc(100%-24px)] w-0.5 rounded-full",
          isCompleted ? "bg-primary" : "bg-border",
          className
        )}
        {...props}
      />
    )
  }
)
StepperSeparator.displayName = "StepperSeparator"

export { StepperSeparator }
export type { StepperSeparatorProps }
