"use client";

import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  showText?: boolean;
  isCollapsed?: boolean;
  appName?: string;
  subtitle?: string;
}

export function AppLogo({
  className,
  showText = true,
  isCollapsed = false,
  appName = "",
}: AppLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        isCollapsed && "justify-center",
        className,
      )}
    >
      {/* Logo Icon */}
      <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 flex-shrink-0">
        <div className="absolute inset-2 grid grid-cols-2 gap-0.5">
          <div className="bg-primary-foreground/90 rounded-sm" />
          <div className="bg-primary-foreground/70 rounded-sm" />
          <div className="bg-primary-foreground/70 rounded-sm" />
          <div className="bg-primary-foreground/90 rounded-sm" />
        </div>
      </div>

      {/* Text */}
      {showText && !isCollapsed && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            OneUI
            {appName && (
              <span className="font-normal text-primary ml-1">{appName}</span>
            )}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            Bank of Maldives
          </span>
        </div>
      )}
    </div>
  );
}
