"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type {
  StepperContextValue,
  StepItemContextValue,
  StepperProps,
} from "./types"

// ---- Contexts ---------------------------------------------------------------

export const StepperContext = React.createContext<StepperContextValue | null>(null)
export const StepItemContext = React.createContext<StepItemContextValue | null>(null)

// ---- Hooks ------------------------------------------------------------------

export function useStepper(): StepperContextValue {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepper must be used within a <Stepper>")
  }
  return context
}

export function useStepItem(): StepItemContextValue {
  const context = React.useContext(StepItemContext)
  if (!context) {
    throw new Error("useStepItem must be used within a <StepperItem>")
  }
  return context
}

export function useStepperControl(totalSteps: number, initialStep = 1) {
  const [currentStep, setStep] = React.useState(initialStep)

  const setCurrentStep = React.useCallback(
    (step: number) => {
      setStep(Math.max(1, Math.min(step, totalSteps)))
    },
    [totalSteps]
  )

  const goToNextStep = React.useCallback(() => {
    setStep((prev) => Math.min(prev + 1, totalSteps))
  }, [totalSteps])

  const goToPreviousStep = React.useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const reset = React.useCallback(() => {
    setStep(initialStep)
  }, [initialStep])

  return {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    canGoNext: currentStep < totalSteps,
    canGoPrevious: currentStep > 1,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    reset,
  }
}

// ---- Stepper root -----------------------------------------------------------

const STEPPER_ITEM_DISPLAY_NAME = "StepperItem"

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      defaultStep = 1,
      currentStep: controlledStep,
      onStepChange,
      orientation = "horizontal",
      linear = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledStep, setUncontrolledStep] = React.useState(defaultStep)

    const isControlled = controlledStep !== undefined
    const currentStep = isControlled ? controlledStep : uncontrolledStep

    const totalSteps = React.Children.toArray(children).filter(
      (child) =>
        React.isValidElement(child) &&
        (child.type as React.FC).displayName === STEPPER_ITEM_DISPLAY_NAME
    ).length

    const setCurrentStep = React.useCallback(
      (step: number) => {
        const clamped = Math.max(1, Math.min(step, totalSteps))
        if (!isControlled) setUncontrolledStep(clamped)
        onStepChange?.(clamped)
      },
      [isControlled, totalSteps, onStepChange]
    )

    const goToNextStep = React.useCallback(
      () => setCurrentStep(currentStep + 1),
      [currentStep, setCurrentStep]
    )

    const goToPreviousStep = React.useCallback(
      () => setCurrentStep(currentStep - 1),
      [currentStep, setCurrentStep]
    )

    const contextValue = React.useMemo<StepperContextValue>(
      () => ({
        currentStep,
        totalSteps,
        orientation,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        canGoNext: currentStep < totalSteps,
        canGoPrevious: currentStep > 1,
        linear,
      }),
      [
        currentStep,
        totalSteps,
        orientation,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
        linear,
      ]
    )

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          aria-label="Progress steps"
          data-orientation={orientation}
          className={cn(
            "flex",
            orientation === "horizontal"
              ? "w-full items-start gap-2"
              : "flex-col gap-6",
            className
          )}
          {...props}
        >
          <ol
            className={cn(
              "flex",
              orientation === "horizontal"
                ? "w-full items-start gap-2"
                : "flex-col gap-6 w-full"
            )}
          >
            {children}
          </ol>
        </div>
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

export { Stepper }
export type { StepperProps }
