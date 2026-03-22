// components/dashboard/quick-action.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "outline";
  className?: string;
}

export function QuickAction({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "outline",
  className,
}: QuickActionProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn(
        "h-auto flex-col items-start gap-2 p-4 text-left",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
      <div className="space-y-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground font-normal">
            {description}
          </div>
        )}
      </div>
    </Button>
  );
}
