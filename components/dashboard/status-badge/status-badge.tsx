// components/dashboard/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps
  extends Omit<React.ComponentProps<"span">, "variant"> {
  icon?: LucideIcon;
  // Combine shadcn variants + our custom status variants
  variant?: "default" | "secondary" | "destructive" | "outline";
  status?: "success" | "warning" | "info"; // ADD THIS LINE if missing
}

export function StatusBadge({
  className,
  variant,
  status, // Make sure this is here
  icon: Icon,
  children,
  ...props
}: StatusBadgeProps) {
  // Map custom variants to styling
  const customStyles = {
    success:
      "border-transparent bg-green-500/10 text-green-700 dark:text-green-400 [a&]:hover:bg-green-500/20",
    warning:
      "border-transparent bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 [a&]:hover:bg-yellow-500/20",
    info: "border-transparent bg-blue-500/10 text-blue-700 dark:text-blue-400 [a&]:hover:bg-blue-500/20",
  };

  // Check if it's a custom status
  if (status) {
    return (
      <span
        data-slot="badge"
        className={cn(
          "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors",
          customStyles[status],
          className,
        )}
        {...props}
      >
        {Icon && <Icon className="h-3 w-3" />}
        {children}
      </span>
    );
  }

  // Use shadcn Badge for default variants
  return (
    <Badge variant={variant} className={cn("gap-1.5", className)} {...props}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </Badge>
  );
}
