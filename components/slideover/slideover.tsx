"use client";

import { createContext, useContext } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader as UISheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* --------------------------------------------------------------------------------
 * Context
 * -------------------------------------------------------------------------------*/

type SlideoverContextProps = {
  icon?: LucideIcon;
  iconColor?: "primary" | "secondary" | "success" | "danger" | "warning";
};

const SlideoverContext = createContext<SlideoverContextProps | null>(null);

function useSlideoverContext() {
  const context = useContext(SlideoverContext);
  if (!context) {
    throw new Error(
      "Slideover components must be rendered within a Slideover component.",
    );
  }
  return context;
}

/* --------------------------------------------------------------------------------
 * Root
 * -------------------------------------------------------------------------------*/

type SlideoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: "primary" | "secondary" | "success" | "danger" | "warning";
  className?: string;
  maxWidth?: string;
  side?: "top" | "right" | "bottom" | "left";
};

export function Slideover({
  open,
  onOpenChange,
  children,
  icon,
  iconColor = "primary",
  className,
  maxWidth = "650px",
  side = "right",
}: SlideoverProps) {
  return (
    <SlideoverContext.Provider value={{ icon, iconColor }}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={side}
          className={cn(
            "flex top-2 bottom-2 right-2 rounded-lg  h-[dvh] min-h-0 flex-col w-full p-0",
            side === "left" || side === "right"
              ? `sm:max-w-[${maxWidth}]`
              : undefined,
            "bg-card/95 dark:bg-background/95 backdrop-blur-xl border border-border/40",
            "shadow-2xl shadow-black/10 dark:shadow-black/30",
            "transition-all duration-200",
            className,
          )}
          style={side === "left" || side === "right" ? { maxWidth } : undefined}
        >
          {children}
        </SheetContent>
      </Sheet>
    </SlideoverContext.Provider>
  );
}

/* --------------------------------------------------------------------------------
 * Header
 * -------------------------------------------------------------------------------*/

type SlideoverHeaderProps = {
  title?: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  hideIcon?: boolean;
};

export function SlideoverHeader({
  title,
  description,
  className,
  actions,
  hideIcon = false,
}: SlideoverHeaderProps) {
  const context = useSlideoverContext();
  const Icon = context?.icon;
  const iconColor = context?.iconColor || "primary";

  const colorMap = {
    primary: {
      bg: "bg-primary/8 dark:bg-primary/12",
      text: "text-primary",
      border: "border-primary/20 dark:border-primary/30",
      shadow: "shadow-primary/10 dark:shadow-primary/20",
    },
    secondary: {
      bg: "bg-secondary/8 dark:bg-secondary/12",
      text: "text-secondary-foreground",
      border: "border-secondary/20 dark:border-secondary/30",
      shadow: "shadow-secondary/10 dark:shadow-secondary/20",
    },
    success: {
      bg: "bg-green-500/8 dark:bg-green-500/12",
      text: "text-green-600 dark:text-green-500",
      border: "border-green-500/20 dark:border-green-500/30",
      shadow: "shadow-green-500/10 dark:shadow-green-500/20",
    },
    danger: {
      bg: "bg-red-500/8 dark:bg-red-500/12",
      text: "text-red-600 dark:text-red-500",
      border: "border-red-500/20 dark:border-red-500/30",
      shadow: "shadow-red-500/10 dark:shadow-red-500/20",
    },
    warning: {
      bg: "bg-yellow-500/8 dark:bg-yellow-500/12",
      text: "text-yellow-600 dark:text-yellow-500",
      border: "border-yellow-500/20 dark:border-yellow-500/30",
      shadow: "shadow-yellow-500/10 dark:shadow-yellow-500/20",
    },
  };

  const palette = colorMap[iconColor];

  return (
    <UISheetHeader
      className={cn(
        "sticky top-0 z-20 flex flex-row items-center gap-4 flex-shrink-0",
        "bg-background/95 backdrop-blur-md border-b border-border/60",
        "shadow-sm px-6 py-5 transition-all rounded-t-lg /mt-2 /mx-2 duration-200",
        className,
      )}
    >
      {Icon && !hideIcon && (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-xl border p-3",
            "bg-background/60 backdrop-blur-sm shadow-sm",
            "hover:shadow-md hover:scale-105 transition-all duration-200",
            palette.bg,
            palette.text,
            palette.border,
            palette.shadow,
          )}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <SheetTitle className="truncate text-lg font-semibold leading-tight text-foreground">
          {title ?? "Title"}
        </SheetTitle>
        {description && (
          <SheetDescription className="line-clamp-2 text-sm text-muted-foreground/80 mt-0.5">
            {description}
          </SheetDescription>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </UISheetHeader>
  );
}
SlideoverHeader.displayName = "SlideoverHeader";

/* --------------------------------------------------------------------------------
 * Body
 * -------------------------------------------------------------------------------*/

type SlideoverBodyProps = React.ComponentProps<"div"> & {
  spaced?: boolean;
  fullHeight?: boolean;
  scrollable?: boolean;
  noPadding?: boolean;
};

export function SlideoverBody({
  className,
  spaced = false,
  fullHeight = false,
  scrollable = false,
  noPadding = false,
  children,
  ...props
}: SlideoverBodyProps) {
  const content = (
    <div
      {...props}
      className={cn(
        "min-h-0 flex-1",
        !noPadding && "px-6 py-6",
        spaced && "space-y-8 md:space-y-10",
        fullHeight && "flex flex-col",
        className,
      )}
    >
      {children}
    </div>
  );

  if (scrollable) {
    return (
      <ScrollArea
        className={cn(
          "flex-1 min-h-0",
          !fullHeight &&
            "[mask-image:linear-gradient(0deg,transparent_0%,black_8px,black_calc(100%-8px),transparent_100%)]",
        )}
      >
        {content}
      </ScrollArea>
    );
  }

  return content;
}
SlideoverBody.displayName = "SlideoverBody";

/* --------------------------------------------------------------------------------
 * Footer
 * -------------------------------------------------------------------------------*/

type SlideoverFooterProps = React.ComponentProps<"div"> & {
  sticky?: boolean;
  variant?: "default" | "form" | "split";
};

export function SlideoverFooter({
  className,
  sticky = true,
  variant = "default",
  children,
  ...props
}: SlideoverFooterProps) {
  return (
    <div
      className={cn(
        sticky && "mt-auto",
        "flex items-center flex-shrink-0 rounded-b-lg",
        "bg-background/95 backdrop-blur-md border-t border-border/60",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.20)]",
        "px-6 py-4 transition-all duration-200",
        // Variant-based layouts
        variant === "default" && "gap-3 justify-end",
        variant === "form" && "gap-3 justify-between",
        variant === "split" && "justify-between gap-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
SlideoverFooter.displayName = "SlideoverFooter";

/* --------------------------------------------------------------------------------
 * Divider
 * -------------------------------------------------------------------------------*/

export function SlideoverDivider({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      className={cn("border-0 border-t border-border/40 my-4", className)}
      {...props}
    />
  );
}
SlideoverDivider.displayName = "SlideoverDivider";

/* --------------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------------*/

type SlideoverSectionProps = React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
};

export function SlideoverSection({
  className,
  title,
  description,
  children,
  ...props
}: SlideoverSectionProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
SlideoverSection.displayName = "SlideoverSection";