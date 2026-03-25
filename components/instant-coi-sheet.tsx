"use client"

import * as React from "react"
import { Zap, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InstantCoiFormData {
  dateOfOccurrence: Date | undefined
  coiType: string
  occurrenceType: string
  currency: string
  transactionValue: string
  description: string
}

const defaultFormData: InstantCoiFormData = {
  dateOfOccurrence: undefined,
  coiType: "",
  occurrenceType: "",
  currency: "",
  transactionValue: "",
  description: "",
}

interface InstantCoiSheetProps {
  trigger?: React.ReactNode
  onSubmit?: (data: InstantCoiFormData) => void
}

export function InstantCoiSheet({ trigger, onSubmit }: InstantCoiSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [form, setForm] = React.useState<InstantCoiFormData>(defaultFormData)

  const set = <K extends keyof InstantCoiFormData>(
    field: K,
    value: InstantCoiFormData[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(form)
    setOpen(false)
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      setForm(defaultFormData)
      setCalendarOpen(false)
    }
  }

  const isTransaction = form.occurrenceType === "transaction"

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Zap className="size-4" />
            Instant COI
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full min-w-xl flex-col p-0 sm:max-w-lg"
      >
        <SheetHeader className="shrink-0 px-6 pb-0 pt-6">
          <SheetTitle>Instant COI</SheetTitle>
          <SheetDescription>
            Log an unexpected conflict of interest that occurred outside of the
            annual declaration cycle.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <form id="instant-coi-form" onSubmit={handleSubmit}>
            <div className="space-y-6 px-6 py-6">
              {/* ── General details ── */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-medium text-foreground">
                  General Details
                </legend>

                <div className="grid grid-cols-2 gap-3">
                  {/* Date of Occurrence */}
                  <div className="space-y-1.5">
                    <Label className="select-text cursor-text text-xs text-muted-foreground">
                      Date of Occurrence
                    </Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !form.dateOfOccurrence && "text-muted-foreground",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <CalendarIcon className="size-4 shrink-0" />
                            {form.dateOfOccurrence
                              ? format(form.dateOfOccurrence, "dd MMM yyyy")
                              : "Pick a date"}
                          </span>
                          <ChevronDown className="size-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.dateOfOccurrence}
                          captionLayout="dropdown"
                          onSelect={(d) => {
                            set("dateOfOccurrence", d)
                            setCalendarOpen(false)
                          }}
                          disabled={(d) => d > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* COI Type */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="icoi-coi-type"
                      className="select-text cursor-text text-xs text-muted-foreground"
                    >
                      COI Type
                    </Label>
                    <Select
                      value={form.coiType}
                      onValueChange={(v) => set("coiType", v)}
                    >
                      <SelectTrigger id="icoi-coi-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actual">Actual</SelectItem>
                        <SelectItem value="perceived">Perceived</SelectItem>
                        <SelectItem value="potential">Potential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </fieldset>

              <Separator />

              {/* ── Occurrence ── */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-medium text-foreground">
                  Occurrence
                </legend>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="icoi-occurrence-type"
                    className="select-text cursor-text text-xs text-muted-foreground"
                  >
                    Occurrence Type
                  </Label>
                  <Select
                    value={form.occurrenceType}
                    onValueChange={(v) => {
                      set("occurrenceType", v)
                      if (v !== "transaction") {
                        set("currency", "")
                        set("transactionValue", "")
                      }
                    }}
                  >
                    <SelectTrigger id="icoi-occurrence-type">
                      <SelectValue placeholder="Select occurrence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="relationship">Relationship</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isTransaction && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="icoi-transaction-value"
                      className="select-text cursor-text text-xs text-muted-foreground"
                    >
                      Transaction Value
                    </Label>
                    <div className="flex">
                      <Select
                        value={form.currency}
                        onValueChange={(v) => set("currency", v)}
                      >
                        <SelectTrigger
                          id="icoi-currency"
                          className="w-[5.5rem] rounded-r-none border-r-0 focus:z-10"
                        >
                          <SelectValue placeholder="Curr." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MVR">MVR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="icoi-transaction-value"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="rounded-l-none focus:z-10"
                        value={form.transactionValue}
                        onChange={(e) => set("transactionValue", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </fieldset>

              <Separator />

              {/* ── Description ── */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-medium text-foreground">
                  Description
                </legend>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="icoi-description"
                    className="select-text cursor-text text-xs text-muted-foreground"
                  >
                    Provide details about the conflict of interest
                  </Label>
                  <Textarea
                    id="icoi-description"
                    placeholder="Describe what happened, who was involved, and any relevant context..."
                    className="min-h-32 resize-none"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </div>
              </fieldset>
            </div>
          </form>
        </ScrollArea>

        <div className="shrink-0 border-t bg-background px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="instant-coi-form" className="gap-2">
              <Zap className="size-4" />
              Submit
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
