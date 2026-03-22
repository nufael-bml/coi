// components/dashboard/activity-item.tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/dashboard/user-avatar/user-avatar";

interface ActivityItemProps {
  user?: {
    name: string;
    avatar?: string;
  };
  icon?: LucideIcon;
  title: string;
  description?: string;
  time: string;
  className?: string;
}

export function ActivityItem({
  user,
  icon: Icon,
  title,
  description,
  time,
  className,
}: ActivityItemProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      {user ? (
        <UserAvatar
          src={user.avatar}
          fallback={user.name}
          alt={user.name}
          size="sm"
        />
      ) : Icon ? (
        <div className="rounded-full bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      ) : null}

      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
