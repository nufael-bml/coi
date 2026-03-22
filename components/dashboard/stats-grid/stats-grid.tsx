// components/dashboard/stats-grid.tsx
"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "separated";
  className?: string;
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

export function StatsGrid({
  children,
  columns = 4,
  gap = "md",
  variant = "default",
  className,
}: StatsGridProps) {
  if (variant === "bordered") {
    return (
      <div
        className={cn(
          "bg-card border border-border/50 rounded-lg overflow-hidden",
          className,
        )}
      >
        <div
          className={cn(
            "grid divide-x divide-y divide-border/60",
            columnClasses[columns],
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  if (variant === "separated") {
    return (
      <div
        className={cn(
          "grid",
          columnClasses[columns],
          gapClasses[gap],
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // Default variant - simple grid with gap
  return (
    <div
      className={cn("grid", columnClasses[columns], gapClasses[gap], className)}
    >
      {children}
    </div>
  );
}
