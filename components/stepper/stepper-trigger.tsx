"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useStepper, useStepItem } from "./stepper"

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ className, children, asChild, onClick, disabled, ...props }, ref) => {
    const { setCurrentStep } = useStepper()
    const { step, isClickable } = useStepItem()

    const isDisabled = disabled || !isClickable

    const handleClick = (e: React.MouseEvent<Element>) => {
      if (isDisabled) return
      setCurrentStep(step)
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{
          onClick?: (e: React.MouseEvent) => void
        }>,
        { onClick: handleClick, ...props }
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none",
          !isClickable && "cursor-not-allowed",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
StepperTrigger.displayName = "StepperTrigger"

export { StepperTrigger }
export type { StepperTriggerProps }
