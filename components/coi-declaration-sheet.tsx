"use client"

import * as React from "react"
import { FilePen } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCoiDeclarationForm } from "@/components/coi-declaration-form"

interface CoiDeclarationSheetProps {
  trigger?: React.ReactNode
  deadlinePassed?: boolean
  onSubmit?: (data: unknown) => void
  onSaveDraft?: (data: unknown) => void
}

export function CoiDeclarationSheet({
  trigger,
  deadlinePassed = false,
  onSubmit,
  onSaveDraft,
}: CoiDeclarationSheetProps) {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (data: unknown) => {
    onSubmit?.(data)
    setOpen(false)
  }

  const handleSaveDraft = (data: unknown) => {
    onSaveDraft?.(data)
    setOpen(false)
  }

  const { StepperHeader, NavFooter, StepContent } = useCoiDeclarationForm(
    deadlinePassed,
    handleSubmit,
    handleSaveDraft
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FilePen className="size-4" />
            Start Declaration
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full min-w-xl sm:max-w-lg flex flex-col p-0"
      >
        {/* ── Zone 1: sticky header ── */}
        <SheetHeader className="shrink-0 px-6 pt-6 pb-0">
          <SheetTitle>COI Declaration</SheetTitle>
          <SheetDescription>
            Complete this form to submit your annual Conflict of Interest
            declaration.
          </SheetDescription>
          <div className="pt-4 pb-1">{StepperHeader}</div>
        </SheetHeader>

        {/* ── Zone 2: scrollable content ── */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-4">{StepContent}</div>
        </ScrollArea>

        {/* ── Zone 3: sticky footer ── */}
        <div className="shrink-0 border-t bg-background px-6 py-4">
          {NavFooter}
        </div>
      </SheetContent>
    </Sheet>
  )
}
