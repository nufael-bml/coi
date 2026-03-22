// components/dashboard/advanced-stat-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/status-badge/status-badge";

interface AdvancedStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  description?: string;
  indicator?: "success" | "warning" | "error" | "neutral";
  badge?: {
    label: string;
    variant?: "success" | "warning" | "info" | "default";
  };
  className?: string;
  onClick?: () => void;
}

const indicatorColors = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  neutral: "bg-gray-400",
};

const iconBackgrounds = {
  success: "bg-green-500/10",
  warning: "bg-yellow-500/10",
  error: "bg-red-500/10",
  neutral: "bg-muted",
};

const iconColors = {
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
};

export function AdvancedStatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  indicator = "neutral",
  badge,
  className,
  onClick,
}: AdvancedStatCardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;
  const isNeutral = trend && trend.value === 0;
  const isClickable = !!onClick;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        isClickable && "cursor-pointer hover:shadow-md hover:border-primary/50",
        className,
      )}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <CardContent className="p-6">
        {/* Header: Icon + Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn("rounded-lg p-2.5", iconBackgrounds[indicator])}>
            <Icon className={cn("h-5 w-5", iconColors[indicator])} />
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <StatusBadge
                status={badge.variant === "default" ? undefined : badge.variant}
                className="text-[10px]"
              >
                {badge.label}
              </StatusBadge>
            )}
            <div
              className={cn("h-2 w-2 rounded-full", indicatorColors[indicator])}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Title */}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          {/* Value */}
          <p className="text-3xl font-bold tracking-tight">{value}</p>

          {/* Trend or Description */}
          {trend ? (
            <div className="flex items-center gap-1.5 mt-2">
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
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
              {trend.label && (
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              )}
            </div>
          ) : (
            description && (
              <p className="text-xs text-muted-foreground mt-2">
                {description}
              </p>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
