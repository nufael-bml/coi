// components/layout/page-header.tsx
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageHeaderVariants = cva("font-semibold tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const descriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface PageHeaderProps extends VariantProps<typeof pageHeaderVariants> {
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  size = "md",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex-1 space-y-1">
        {typeof title === "string" ? (
          <h1 className={pageHeaderVariants({ size })}>{title}</h1>
        ) : (
          <div className={pageHeaderVariants({ size })}>{title}</div>
        )}
        {description && (
          <p className={descriptionVariants({ size })}>{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
