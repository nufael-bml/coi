"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useStepper, StepItemContext } from "./stepper"
import type { StepItemContextValue, StepperItemProps, StepState } from "./types"

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  ({ step, label, className, children, ...props }, ref) => {
    const { currentStep, totalSteps, orientation, linear } = useStepper()

    const state: StepState = React.useMemo(() => {
      if (step < currentStep) return "completed"
      if (step === currentStep) return "active"
      return "inactive"
    }, [step, currentStep])

    const isFirstStep = step === 1
    const isLastStep = step === totalSteps

    const isClickable = linear ? step <= currentStep : true

    const contextValue = React.useMemo<StepItemContextValue>(
      () => ({ step, state, isFirstStep, isLastStep, isClickable }),
      [step, state, isFirstStep, isLastStep, isClickable]
    )

    return (
      <StepItemContext.Provider value={contextValue}>
        <li
          ref={ref}
          aria-current={state === "active" ? "step" : undefined}
          data-state={state}
          data-step={step}
          data-orientation={orientation}
          className={cn(
            "group relative",
            orientation === "horizontal"
              ? "flex flex-1 flex-col items-center justify-center"
              : "flex w-full items-start gap-4",
            className
          )}
          {...props}
        >
          <span className="sr-only">
            Step {step} of {totalSteps}
            {label ? `: ${label}` : ""}
            {state === "completed"
              ? " (completed)"
              : state === "active"
              ? " (current)"
              : ""}
          </span>
          {children}
        </li>
      </StepItemContext.Provider>
    )
  }
)
StepperItem.displayName = "StepperItem"

export { StepperItem }
export type { StepperItemProps }
