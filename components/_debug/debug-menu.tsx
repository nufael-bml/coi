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
}

export function DebugMenu({
  deadlinePassed,
  onDeadlinePassedChange,
  formSubmitted,
  onFormSubmittedChange,
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
