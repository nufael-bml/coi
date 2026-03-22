"use client";

import { ChevronRight, LinkIcon, Settings, Moon, Sun, Monitor } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavUser } from "@/components/layout/nav-user";
import { NavSecondary } from "@/components/layout/nav-secondary";
import type { UserProfile } from "@/types/auth";
import type { NavGroup, NavItem } from "@/types/layout";
import { AppLogo } from "@/components/layout/app-logo";
import { navigationItems } from "@/lib/navigation";
import { checkPermission } from "@/lib/actions/auth";

const secondaryNav = [
  { title: "Main App", url: "https://oneui-dev.bml.com.mv", icon: LinkIcon },
];

export function AppSidebar({
  user,
  appName,
  navItems = navigationItems,
  variant = "inset",
  ...props
}: {
  user: UserProfile;
  appName: string;
  navItems?: NavGroup[];
  variant?: "sidebar" | "floating" | "inset";
} & React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const [filteredNavItems, setFilteredNavItems] =
    useState<NavGroup[]>(navItems);

  // Filter navigation items based on permissions
  useEffect(() => {
    const filterNavItems = async () => {
      const filtered: NavGroup[] = [];

      for (const group of navItems) {
        const filteredItems: NavItem[] = [];

        for (const item of group.items) {
          // Check if item has permission requirement
          if (item.permission) {
            const hasPermission = await checkPermission(item.permission);
            if (hasPermission) {
              filteredItems.push(item);
            }
          } else {
            // No permission required on parent item
            // Now check nested items if they exist
            if (item.items) {
              const filteredSubItems: NavItem[] = [];

              for (const subItem of item.items) {
                if (subItem.permission) {
                  const hasSubPermission = await checkPermission(
                    subItem.permission
                  );
                  if (hasSubPermission) {
                    filteredSubItems.push(subItem);
                  }
                } else {
                  // No permission required on sub-item
                  filteredSubItems.push(subItem);
                }
              }

              // Include parent item with filtered sub-items
              filteredItems.push({
                ...item,
                items: filteredSubItems,
              });
            } else {
              // No nested items, include the item
              filteredItems.push(item);
            }
          }
        }

        // Only include group if it has items
        if (filteredItems.length > 0) {
          filtered.push({
            ...group,
            items: filteredItems,
          });
        }
      }

      setFilteredNavItems(filtered);
    };

    filterNavItems();
  }, [navItems]);

  return (
    <Sidebar variant={variant} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="w-full">
                <AppLogo
                  appName={appName}
                  isCollapsed={isCollapsed}
                  showText={!isCollapsed}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {filteredNavItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url;
                const hasActiveChild = item.items?.some(
                  (subItem) => pathname === subItem.url
                );
                const Icon = item.icon;

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={hasActiveChild}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {item.items ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={hasActiveChild}
                            >
                              {Icon && <Icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => {
                                const SubIcon = subItem.icon;
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={pathname === subItem.url}
                                      className={"mt-0.5"}
                                    >
                                      <Link href={subItem.url}>
                                        {SubIcon && <SubIcon />}
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={isActive}
                        >
                          <Link href={item.url}>
                            {Icon && <Icon />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        {/* Settings with Theme Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="w-48">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Theme
                  </div>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavSecondary items={secondaryNav} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}