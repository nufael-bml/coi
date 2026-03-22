"use client";

import {
  createContext,
  useActionState,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormResponse } from "@/lib/helpers/action-helpers";

/* ---------------------------------- Types ---------------------------------- */
interface FormWrapperProps {
  action: (prevState: FormResponse, formData: FormData) => Promise<FormResponse>;
  formId?: string;
  onSuccess?: () => void;
  successToast?: string | false;
  errorToast?: string | false;
  children: React.ReactNode;
  className?: string;
}

interface FormContextValue {
  errors?: Record<string, string[]>;
  isPending: boolean;
  resetKey: number;
  clearForm: () => void;
}

/* --------------------------------- Context --------------------------------- */
const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormWrapper");
  }
  return context;
}

/* ------------------------------- Main Component ------------------------------- */
export function FormWrapper({
  action,
  formId,
  onSuccess,
  successToast,
  errorToast,
  children,
  className,
}: FormWrapperProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastProcessedState = useRef<FormResponse | null>(null);
  const currentFormId = useRef(formId);
  const skipNextToast = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const [localErrors, setLocalErrors] = useState<Record<string, string[]> | undefined>();

  const [state, formAction, isPending] = useActionState<FormResponse, FormData>(
    action,
    { success: false, message: "", error: null },
  );

  const clearForm = () => {
    skipNextToast.current = true;
    setResetKey((prev) => prev + 1);
    formRef.current?.reset();
    lastProcessedState.current = null;
    setLocalErrors(undefined);
  };

  // Handle formId changes (switching between create/edit modes)
  useEffect(() => {
    if (formId !== currentFormId.current && currentFormId.current !== undefined) {
      currentFormId.current = formId;
      skipNextToast.current = true;
      setResetKey((prev) => prev + 1);
      lastProcessedState.current = null;
      setLocalErrors(undefined);
    } else if (currentFormId.current === undefined) {
      currentFormId.current = formId;
    }
  }, [formId]);

  // Handle form submission results
  useEffect(() => {
    if (!state || state === lastProcessedState.current) return;
    if (!state.success && !state.error && !state.errors) return;

    lastProcessedState.current = state;

    if (state.success) {
      if (successToast !== false && !skipNextToast.current) {
        toast.success(
          successToast || state.message || "Action completed successfully!",
        );
      }
      setResetKey((prev) => prev + 1);
      setLocalErrors(undefined);
      onSuccess?.();
    } else if (state.error || state.errors) {
      setLocalErrors(state.errors);
      if (errorToast !== false && !skipNextToast.current) {
        toast.error(errorToast || state.error || "Please fix the errors below.");
      }
    }

    skipNextToast.current = false;
  }, [state, onSuccess, successToast, errorToast]);

  return (
    <FormContext.Provider value={{ errors: localErrors, isPending, resetKey, clearForm }}>
      <form
        ref={formRef}
        action={formAction}
        className={cn("flex h-full min-h-0 flex-col flex-1", className)}
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

/* ----------------------------- Helper Buttons ----------------------------- */
FormWrapper.SubmitButton = function SubmitButton({
  children = "Submit",
  className,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type">) {
  const { isPending } = useFormContext();
  
  return (
    <Button 
      type="submit" 
      disabled={isPending || disabled} 
      className={className} 
      {...props}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? "Processing..." : children}
    </Button>
  );
};

FormWrapper.CancelButton = function CancelButton({
  children = "Cancel",
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "variant">) {
  const { isPending, clearForm } = useFormContext();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clearForm(); // Clear form first (sets skipNextToast flag)
    onClick?.(e); // Then trigger the parent's onClick (closes dialog)
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

FormWrapper.ClearButton = function ClearButton({
  children = "Clear",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "variant" | "onClick">) {
  const { isPending, clearForm } = useFormContext();
  
  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isPending}
      onClick={clearForm}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};