// components/layout/theme-toggle.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setThemeMode } from '@/lib/actions/theme'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTransition } from 'react'
import { toast } from 'sonner'

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const [isPending, startTransition] = useTransition()

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    // Update client immediately for instant feedback
    setTheme(newTheme)

    // Update server in background
    startTransition(async () => {
      try {
        const result = await setThemeMode(newTheme)

        if (!result.success) {
          toast.error(result.error || 'Failed to save theme preference')
          // Optionally revert the theme on error
          // You could store previous theme and revert here
        }
      } catch (error) {
        console.error('[ThemeToggle] Error updating theme:', error)
        toast.error('Failed to save theme preference')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending} className="h-7 w-7">
          <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
