// ---------------------------------------------------------------------------
// Shared types & interfaces for the Stepper component family
// ---------------------------------------------------------------------------

export type StepState = "completed" | "active" | "inactive"

export interface StepperContextValue {
  currentStep: number
  totalSteps: number
  orientation: "horizontal" | "vertical"
  setCurrentStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  /** When true, users may only navigate to completed or the current step */
  linear: boolean
}

export interface StepItemContextValue {
  step: number
  state: StepState
  isFirstStep: boolean
  isLastStep: boolean
  /** Whether this step's trigger is interactive */
  isClickable: boolean
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial step for uncontrolled mode */
  defaultStep?: number
  /** Current step for controlled mode */
  currentStep?: number
  /** Callback when the active step changes */
  onStepChange?: (step: number) => void
  /** Layout orientation */
  orientation?: "horizontal" | "vertical"
  /** When true, users can only navigate to completed or current steps */
  linear?: boolean
  children: React.ReactNode
}

export interface StepperItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Step number (1-indexed) */
  step: number
  /** Accessible label for this step */
  label?: string
  children: React.ReactNode
}
