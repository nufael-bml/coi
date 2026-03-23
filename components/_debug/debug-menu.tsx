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

export function DebugMenu() {
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
            {/* Add debug tools here */}
            <p className="text-sm text-muted-foreground px-4">No debug tools configured.</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
