"use client"

import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  count: number
  description: string
  icon: LucideIcon
  indicatorColor: string
  isActive?: boolean
  onClick?: () => void
}

export function StatusCard({
  title,
  count,
  description,
  icon: Icon,
  indicatorColor,
  isActive,
  onClick,
}: StatusCardProps) {
  const bgClass = indicatorColor
    .split(" ")
    .find((cls) => cls.startsWith("bg-"))
  const colorToken = bgClass?.replace("bg-", "").split("/")[0]
  const iconColorStyle = colorToken
    ? ({ color: `var(--color-${colorToken})` } as React.CSSProperties)
    : undefined

  return (
    <Card
      className={cn(
        "relative cursor-pointer py-4 transition-all hover:border-muted-foreground/50 bg-background",
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-pressed={isActive}
    >
      <div>
      <div className="flex items-start justify-between px-4">
        <div className="flex items-center gap-2">
          <Icon className="size-4" style={iconColorStyle} />
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <span
          className={cn("size-2 rounded-full", indicatorColor)}
          aria-hidden="true"
          />
      </div>
      <div className="mt-2 px-4">
        <div className="text-2xl font-bold" style={iconColorStyle}>{count}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      </div>
    </Card>
  )
}
