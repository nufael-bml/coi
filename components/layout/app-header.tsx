// components/layout/app-header.tsx
'use client'

import { NotificationMenu } from '@/components/layout/notification-menu'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { NavGroup } from '@/types/layout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

function getBreadcrumbs(pathname: string, navItems: NavGroup[]) {
  const breadcrumbs: { title: string; href: string }[] = []

  // For admin routes, start with Admin instead of Dashboard
  if (pathname.startsWith('/admin')) {
    breadcrumbs.push({ title: 'Admin', href: '/admin' })
  } else if (pathname !== '/') {
    breadcrumbs.push({ title: 'Dashboard', href: '/' })
  }

  // Helper to find matching nav item
  const findNavItem = (url: string) => {
    for (const group of navItems) {
      for (const item of group.items) {
        if (item.url === url) return { item }
        if (item.items) {
          const subItem = item.items.find(sub => sub.url === url)
          if (subItem) return { item, subItem }
        }
      }
    }
    return null
  }

  // Try exact match first
  const exactMatch = findNavItem(pathname)
  if (exactMatch) {
    // Don't add the item if it's the same URL as the last breadcrumb (avoids duplicates)
    if (!breadcrumbs.length || breadcrumbs[breadcrumbs.length - 1].href !== exactMatch.item.url) {
      breadcrumbs.push({
        title: exactMatch.item.title,
        href: exactMatch.item.url,
      })
    }
    if (exactMatch.subItem) {
      breadcrumbs.push({
        title: exactMatch.subItem.title,
        href: exactMatch.subItem.url,
      })
    }
    return breadcrumbs
  }

  // Handle dynamic routes
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 1) {
    const basePath = `/${pathSegments[0]}`
    const lastSegment = pathSegments[pathSegments.length - 1]
    const baseMatch = findNavItem(basePath)

    if (baseMatch) {
      breadcrumbs.push({
        title: baseMatch.item.title,
        href: baseMatch.item.url,
      })
      if (baseMatch.subItem) {
        breadcrumbs.push({
          title: baseMatch.subItem.title,
          href: baseMatch.subItem.url,
        })
      }

      const pageTitle =
        lastSegment === 'edit'
          ? 'Edit'
          : lastSegment === 'new' || lastSegment === 'create'
            ? 'New'
            : 'Details'

      breadcrumbs.push({ title: pageTitle, href: '' })
      return breadcrumbs
    }
  }

  // Default fallback
  if (breadcrumbs.length === 1) {
    breadcrumbs.push({ title: 'Page', href: '' })
  }

  return breadcrumbs
}

export function AppHeader({
  navItems = [],
}: {
  navItems?: NavGroup[]
} = {}) {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname, navItems)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-2 lg:px-4 py-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 z-20" />
        {/* Breadcrumb "island" - only show when there are breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="bg-muted/40 rounded-md px-2 py-1 border border-border/30 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center gap-2 max-w-[70%] lg:max-w-[55%]">
              <Breadcrumb>
                <BreadcrumbList className="flex items-center gap-1 text-sm flex-nowrap">
                  {breadcrumbs.map((item, index) => (
                    <Fragment key={`${item.href}-${item.title}-${index}`}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="truncate max-w-48">
                            {item.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link className="truncate max-w-48" href={item.href}>
                              {item.title}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        )}
      </div>

      {/* Actions "island" */}
      <div className="flex items-center gap-2 bg-muted/40 rounded-md p-1 border border-border/30 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-1">
          <NotificationMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
