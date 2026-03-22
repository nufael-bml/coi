"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useFormContext } from "./form-wrapper";
import { Plus, Trash2, Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/* ---------------------------------- Types ---------------------------------- */

type BaseProps = {
  label: string;
  name: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

type InputProps = BaseProps & {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "color";
  placeholder?: string;
  defaultValue?: string;
  min?: number;
  max?: number;
  step?: number;
};

type DateTimeProps = BaseProps & {
  type: "date" | "time" | "datetime-local" | "month" | "week";
  defaultValue?: string;
};

type DatePickerProps = BaseProps & {
  type: "datepicker";
  defaultValue?: Date;
  placeholder?: string;
};

type TextareaProps = BaseProps & {
  type: "textarea";
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
};

type SelectProps = BaseProps & {
  type: "select";
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  placeholder?: string;
  defaultValue?: string;
};

type CheckboxProps = BaseProps & {
  type: "checkbox";
  defaultChecked?: boolean;
  description?: string;
};

type RadioProps = BaseProps & {
  type: "radio";
  options: Array<{ label: string; value: string; description?: string }>;
  defaultValue?: string;
};

type SwitchProps = BaseProps & {
  type: "switch";
  defaultChecked?: boolean;
  description?: string;
};

type FileProps = BaseProps & {
  type: "file";
  accept?: string;
  multiple?: boolean;
};

type SliderProps = BaseProps & {
  type: "slider";
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
};

type RangeProps = BaseProps & {
  type: "range";
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
};

type HiddenProps = {
  type: "hidden";
  name: string;
  value: string;
};

type FormFieldProps =
  | InputProps
  | DateTimeProps
  | DatePickerProps
  | TextareaProps
  | SelectProps
  | CheckboxProps
  | RadioProps
  | SwitchProps
  | FileProps
  | SliderProps
  | RangeProps
  | HiddenProps;

/* -------------------------------- Main Component -------------------------------- */

export function FormField(props: FormFieldProps) {
  // Always call hooks at the top level
  const { errors, isPending, resetKey } = useFormContext();
  
  // Hidden fields don't need error handling
  if (props.type === "hidden") {
    return <input type="hidden" name={props.name} value={props.value} />;
  }

  const { label, name, hint, required } = props;
  const fieldErrors = errors?.[name];
  const errorMessage = fieldErrors?.[0];
  const hasError = Boolean(errorMessage);

  const renderInput = () => {
    switch (props.type) {
      case "textarea":
        return <TextareaField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "select":
        return <SelectField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "checkbox":
        return <CheckboxField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "radio":
        return <RadioField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "switch":
        return <SwitchField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "file":
        return <FileField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "slider":
        return <SliderField {...props} isPending={isPending} resetKey={resetKey} />;
      case "range":
        return <RangeField {...props} isPending={isPending} resetKey={resetKey} />;
      case "date":
      case "time":
      case "datetime-local":
      case "month":
      case "week":
        return <DateTimeField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      case "datepicker":
        return <DatePickerField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
      default:
        return <InputField {...props} hasError={hasError} isPending={isPending} resetKey={resetKey} />;
    }
  };

  const isInlineLabel = props.type === "checkbox" || props.type === "switch";

  return (
    <div className="space-y-2">
      {!isInlineLabel && (
        <Label htmlFor={name} className={cn(hasError && "text-destructive")}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}

      {renderInput()}

      {hint && !hasError && (
        <p id={`${name}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {hasError && (
        <p id={`${name}-error`} className="text-xs text-destructive font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- Input Components -------------------------------- */

function InputField({
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  className,
  min,
  max,
  step,
  hasError,
  isPending,
  resetKey,
}: InputProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    void resetKey;
    setValue(defaultValue ?? "");
  }, [defaultValue, resetKey]);

  return (
    <Input
      key={`${name}-${resetKey}`}
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      disabled={isPending}
      required={required}
      min={min}
      max={max}
      step={step}
      aria-invalid={hasError}
      className={cn(
        hasError && "border-destructive focus-visible:ring-destructive",
        className
      )}
    />
  );
}

function DateTimeField({
  name,
  type,
  defaultValue,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: DateTimeProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    void resetKey;
    setValue(defaultValue ?? "");
  }, [defaultValue, resetKey]);

  return (
    <Input
      key={`${name}-${resetKey}`}
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={isPending}
      required={required}
      aria-invalid={hasError}
      className={cn(
        hasError && "border-destructive focus-visible:ring-destructive",
        className
      )}
    />
  );
}

function DatePickerField({
  name,
  placeholder = "Pick a date",
  defaultValue,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: DatePickerProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [date, setDate] = useState<Date | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void resetKey;
    setDate(defaultValue);
  }, [defaultValue, resetKey]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            key={`${name}-${resetKey}`}
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(true)}
            className={cn(
              "w-full justify-between text-left font-normal",
              !date && "text-muted-foreground",
              hasError && "border-destructive focus-visible:ring-destructive",
              className
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : <span>{placeholder}</span>}
            </div>
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selected) => {
              setDate(selected);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
        required={required}
      />
    </>
  );
}

function TextareaField({
  name,
  placeholder,
  defaultValue,
  required,
  rows = 4,
  className,
  hasError,
  isPending,
  resetKey,
}: TextareaProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    void resetKey;
    setValue(defaultValue ?? "");
  }, [defaultValue, resetKey]);

  return (
    <Textarea
      key={`${name}-${resetKey}`}
      id={name}
      name={name}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={isPending}
      required={required}
      aria-invalid={hasError}
      className={cn(
        hasError && "border-destructive focus-visible:ring-destructive",
        className
      )}
    />
  );
}

function SelectField({
  name,
  options,
  placeholder,
  defaultValue,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: SelectProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    void resetKey;
    setValue(defaultValue ?? "");
  }, [defaultValue, resetKey]);

  return (
    <>
      <Select
        key={`${name}-${resetKey}`}
        value={value}
        onValueChange={setValue}
        disabled={isPending}
        required={required}
      >
        <SelectTrigger
          id={name}
          className={cn(
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={hasError}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </>
  );
}

function CheckboxField({
  name,
  label,
  description,
  defaultChecked = false,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: CheckboxProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    void resetKey;
    setChecked(defaultChecked);
  }, [defaultChecked, resetKey]);

  const handleCheckedChange = (value: boolean | "indeterminate") => {
    if (typeof value === "boolean") {
      setChecked(value);
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        key={`${name}-${resetKey}`}
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={isPending}
        required={required}
        aria-invalid={hasError}
        className={cn(hasError && "border-destructive", "mt-1", className)}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive"
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

function RadioField({
  name,
  options,
  defaultValue,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: RadioProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    void resetKey;
    setValue(defaultValue ?? "");
  }, [defaultValue, resetKey]);

  return (
    <RadioGroup
      key={`${name}-${resetKey}`}
      value={value}
      onValueChange={setValue}
      disabled={isPending}
      required={required}
      className={className}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-start space-x-3">
          <RadioGroupItem
            value={option.value}
            id={`${name}-${option.value}`}
            className={cn(hasError && "border-destructive", "mt-1")}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor={`${name}-${option.value}`}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                hasError && "text-destructive"
              )}
            >
              {option.label}
            </Label>
            {option.description && (
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            )}
          </div>
        </div>
      ))}
      <input type="hidden" name={name} value={value} />
    </RadioGroup>
  );
}

function SwitchField({
  name,
  label,
  description,
  defaultChecked = false,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: SwitchProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    void resetKey;
    setChecked(defaultChecked);
  }, [defaultChecked, resetKey]);

  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex-1 space-y-1">
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium leading-none",
            hasError && "text-destructive"
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        key={`${name}-${resetKey}`}
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={setChecked}
        disabled={isPending}
        aria-invalid={hasError}
        className={className}
      />
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
    </div>
  );
}

function FileField({
  name,
  accept,
  multiple = false,
  required,
  className,
  hasError,
  isPending,
  resetKey,
}: FileProps & { hasError: boolean; isPending: boolean; resetKey: number }) {
  return (
    <Input
      key={`${name}-${resetKey}`}
      id={name}
      name={name}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={isPending}
      required={required}
      aria-invalid={hasError}
      className={cn(
        "cursor-pointer file:cursor-pointer",
        hasError && "border-destructive focus-visible:ring-destructive",
        className
      )}
    />
  );
}

function SliderField({
  name,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  className,
  isPending,
  resetKey,
}: SliderProps & { isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState([defaultValue]);

  useEffect(() => {
    void resetKey;
    setValue([defaultValue]);
  }, [defaultValue, resetKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{min}</span>
        <span className="text-sm font-medium">{value[0]}</span>
        <span className="text-sm text-muted-foreground">{max}</span>
      </div>
      <Slider
        key={`${name}-${resetKey}`}
        value={value}
        onValueChange={setValue}
        min={min}
        max={max}
        step={step}
        disabled={isPending}
        className={className}
      />
      <input type="hidden" name={name} value={value[0]} />
    </div>
  );
}

function RangeField({
  name,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  className,
  isPending,
  resetKey,
}: RangeProps & { isPending: boolean; resetKey: number }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    void resetKey;
    setValue(defaultValue);
  }, [defaultValue, resetKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{min}</span>
        <div className="flex gap-2">
          <span className="text-sm font-medium">{value[0]}</span>
          <span className="text-sm text-muted-foreground">-</span>
          <span className="text-sm font-medium">{value[1]}</span>
        </div>
        <span className="text-sm text-muted-foreground">{max}</span>
      </div>
      <Slider
        key={`${name}-${resetKey}`}
        value={value}
        onValueChange={(newValue: number[]) => setValue(newValue as [number, number])}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        disabled={isPending}
        className={className}
      />
      <input type="hidden" name={`${name}.min`} value={value[0]} />
      <input type="hidden" name={`${name}.max`} value={value[1]} />
    </div>
  );
}

/* -------------------------------- Field Array Component -------------------------------- */

type FormFieldArrayProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  defaultValues?: string[];
  minItems?: number;
  maxItems?: number;
  hint?: string;
  required?: boolean;
};

export function FormFieldArray({
  name,
  label,
  type = "text",
  placeholder,
  defaultValues = [""],
  minItems = 1,
  maxItems = 10,
  hint,
  required,
}: FormFieldArrayProps) {
  const { resetKey } = useFormContext();
  const [items, setItems] = useState(defaultValues);

  useEffect(() => {
    void resetKey;
    setItems(defaultValues);
  }, [resetKey, defaultValues]);

  const addItem = () => {
    if (items.length < maxItems) {
      setItems([...items, ""]);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > minItems) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={items.length >= maxItems}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      <div className="space-y-2">
        {items.map((_, index) => (
          <div key={`${name}-${index}-${resetKey}`} className="flex gap-2 items-start">
            <div className="flex-1">
              <FormField
                name={`${name}.${index}`}
                label=""
                type={type}
                placeholder={placeholder || `${label} ${index + 1}`}
                defaultValue={items[index]}
                required={required}
              />
            </div>
            {items.length > minItems && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="mt-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}