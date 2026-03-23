"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useStepper } from "./stepper"

interface StepperNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  onComplete?: () => void
  showBackOnFirstStep?: boolean
  nextLabel?: string
  previousLabel?: string
  completeLabel?: string
  isLoading?: boolean
}

const StepperNavigation = React.forwardRef<HTMLDivElement, StepperNavigationProps>(
  (
    {
      className,
      onComplete,
      showBackOnFirstStep = false,
      nextLabel = "Next",
      previousLabel = "Back",
      completeLabel = "Complete",
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const {
      goToNextStep,
      goToPreviousStep,
      canGoNext,
      canGoPrevious,
      currentStep,
      totalSteps,
    } = useStepper()

    const isLastStep = currentStep === totalSteps

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Step navigation"
        className={cn("flex items-center justify-between gap-4", className)}
        {...props}
      >
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={!canGoPrevious || isLoading}
          className={cn(!canGoPrevious && !showBackOnFirstStep && "invisible")}
        >
          {previousLabel}
        </Button>

        {isLastStep ? (
          <Button type="button" onClick={onComplete} disabled={isLoading}>
            {isLoading ? "Processing…" : completeLabel}
          </Button>
        ) : (
          <Button type="button" onClick={goToNextStep} disabled={!canGoNext || isLoading}>
            {nextLabel}
          </Button>
        )}
      </div>
    )
  }
)
StepperNavigation.displayName = "StepperNavigation"

export { StepperNavigation }
export type { StepperNavigationProps }
