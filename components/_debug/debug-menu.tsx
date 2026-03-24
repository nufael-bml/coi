"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DebugMenuProps {
  deadlinePassed: boolean;
  onDeadlinePassedChange: (value: boolean) => void;
  formSubmitted: boolean;
  onFormSubmittedChange: (value: boolean) => void;
  hasDraft: boolean;
  onHasDraftChange: (value: boolean) => void;
  hasAmendment: boolean;
  onHasAmendmentChange: (value: boolean) => void;
  useDestructiveDeadlineCard: boolean;
  onUseDestructiveDeadlineCardChange: (value: boolean) => void;
}

export function DebugMenu({
  deadlinePassed,
  onDeadlinePassedChange,
  formSubmitted,
  onFormSubmittedChange,
  hasDraft,
  onHasDraftChange,
  hasAmendment,
  onHasAmendmentChange,
  useDestructiveDeadlineCard,
  onUseDestructiveDeadlineCardChange,
}: DebugMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Open debug menu"
      >
        <Bug className="h-5 w-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-red-600">
              <Bug className="h-4 w-4" />
              Debug Menu
            </SheetTitle>
            <SheetDescription>
              Temporary debug utilities — remove before release.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 px-1">
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <Label htmlFor="debug-deadline-passed" className="text-sm">
                Deadline Passed
              </Label>
              <Switch
                id="debug-deadline-passed"
                checked={deadlinePassed}
                onCheckedChange={onDeadlinePassedChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <Label htmlFor="debug-form-submitted" className="text-sm">
                Form Submitted
              </Label>
              <Switch
                id="debug-form-submitted"
                checked={formSubmitted}
                onCheckedChange={onFormSubmittedChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <Label htmlFor="debug-has-draft" className="text-sm">
                Has Draft
              </Label>
              <Switch
                id="debug-has-draft"
                checked={hasDraft}
                onCheckedChange={onHasDraftChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <Label htmlFor="debug-has-amendment" className="text-sm">
                Has Amendment
              </Label>
              <Switch
                id="debug-has-amendment"
                checked={hasAmendment}
                onCheckedChange={onHasAmendmentChange}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <Label htmlFor="debug-destructive-deadline-card" className="text-sm">
                Deadline Card — Destructive Style
              </Label>
              <Switch
                id="debug-destructive-deadline-card"
                checked={useDestructiveDeadlineCard}
                onCheckedChange={onUseDestructiveDeadlineCardChange}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
