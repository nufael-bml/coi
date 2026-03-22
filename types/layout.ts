// types/layout.ts
import { LucideIcon } from "lucide-react";

export interface BreadcrumbItemType {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
  permission?: string; // Optional permission required to view this nav item
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
