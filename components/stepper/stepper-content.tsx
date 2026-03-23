"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useStepper } from "./stepper"

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  forceMount?: boolean
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ step, forceMount, className, children, ...props }, ref) => {
    const { currentStep } = useStepper()
    const isActive = step === currentStep

    if (!forceMount && !isActive) return null

    return (
      <div
        ref={ref}
        role="region"
        aria-label={`Step ${step} content`}
        aria-hidden={!isActive}
        data-state={isActive ? "active" : "inactive"}
        className={cn("mt-4", !isActive && "hidden", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepperContent.displayName = "StepperContent"

export { StepperContent }
export type { StepperContentProps }
