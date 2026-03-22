// components/dashboard/metric-card.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/status-badge/status-badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  change?: {
    value: number;
    label?: string;
  };
  progress?: number; // 0-100
  badge?: {
    label: string;
    variant?:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
      | "info";
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  change,
  progress,
  badge,
  className,
}: MetricCardProps) {
  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;
  const isNeutral = change && change.value === 0;

  // Determine if badge variant is a status or standard variant
  const isStatusVariant =
    badge?.variant && ["success", "warning", "info"].includes(badge.variant);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* Top section: Icon + Badge */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Icon with colored background */}
        {Icon && (
          <div
            className={cn(
              "rounded-lg p-2.5",
              badge?.variant === "success" && "bg-green-500/10",
              badge?.variant === "warning" && "bg-yellow-500/10",
              badge?.variant === "info" && "bg-blue-500/10",
              !badge && "bg-primary/10",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                badge?.variant === "success" &&
                  "text-green-600 dark:text-green-400",
                badge?.variant === "warning" &&
                  "text-yellow-600 dark:text-yellow-400",
                badge?.variant === "info" && "text-blue-600 dark:text-blue-400",
                !badge && "text-primary",
              )}
            />
          </div>
        )}

        {/* Badge */}
        {badge && (
          <StatusBadge
            variant={
              !isStatusVariant
                ? (badge.variant as
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline")
                : undefined
            }
            status={
              isStatusVariant
                ? (badge.variant as "success" | "warning" | "info")
                : undefined
            }
            className="text-[10px]"
          >
            {badge.label}
          </StatusBadge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Title */}
        <div className="text-sm font-medium text-muted-foreground">{title}</div>

        {/* Value */}
        <div className="text-3xl font-bold tracking-tight">{value}</div>

        {/* Change indicator */}
        {change && (
          <div className="flex items-center gap-1.5 text-sm">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5",
                isPositive && "bg-green-500/10",
                isNegative && "bg-red-500/10",
                isNeutral && "bg-muted",
              )}
            >
              {isPositive && (
                <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              )}
              {isNegative && (
                <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              )}
              {isNeutral && (
                <Minus className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "font-semibold text-xs",
                  isPositive && "text-green-600 dark:text-green-400",
                  isNegative && "text-red-600 dark:text-red-400",
                  isNeutral && "text-muted-foreground",
                )}
              >
                {change.value > 0 ? "+" : ""}
                {change.value}%
              </span>
            </div>
            {change.label && (
              <span className="text-xs text-muted-foreground">
                {change.label}
              </span>
            )}
          </div>
        )}

        {/* Description (if no change) */}
        {description && !change && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="space-y-2 pt-1">
            <Progress value={progress} className="h-1.5" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
