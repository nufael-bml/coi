'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell } from 'lucide-react'

interface Notification {
  id: number
  title: string
  time: string
  unread?: boolean
}

interface NotificationMenuProps {
  notifications?: Notification[]
}

export function NotificationMenu({
  notifications = [
    { id: 1, title: 'New user registered', time: '5 min ago', unread: true },
    {
      id: 2,
      title: 'Server backup completed',
      time: '1 hour ago',
      unread: true,
    },
    { id: 3, title: 'Payment received', time: '2 hours ago' },
  ],
}: NotificationMenuProps) {
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-7 w-7">
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-600" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map(n => (
            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3">
              <div className="flex w-full items-center justify-between">
                <span className={`text-sm font-medium ${n.unread ? 'font-semibold' : ''}`}>
                  {n.title}
                </span>
                {n.unread && <span className="h-2 w-2 rounded-full bg-blue-600" />}
              </div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full justify-center text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
