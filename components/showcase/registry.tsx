// components/showcase/registry.tsx
import { statCardDocs } from "@/components/dashboard/stat-card/stat-card.docs";
import { metricCardDocs } from "@/components/dashboard/metric-card/metric-card.docs";
import { statsGridDocs } from "@/components/dashboard/stats-grid/stats-grid.docs";
import { statusBadgeDocs } from "@/components/dashboard/status-badge/status-badge.docs";
import { userAvatarDocs } from "@/components/dashboard/user-avatar/user-avatar.docs";
import { searchBarDocs } from "@/components/dashboard/search-bar/search-bar.docs";
import { actionDropdownDocs } from "@/components/dashboard/action-dropdown/action-dropdown.docs";
import { activityItemDocs } from "@/components/dashboard/activity-item/activity-item.docs";
import { quickActionDocs } from "@/components/dashboard/quick-action/quick-action.docs";
import { emptyStateDocs } from "@/components/dashboard/empty-state/empty-state.docs";
import type { ComponentRegistryItem } from "./types";

export const componentRegistry: ComponentRegistryItem[] = [
  statCardDocs,
  metricCardDocs,
  statsGridDocs,
  statusBadgeDocs,
  userAvatarDocs,
  searchBarDocs,
  actionDropdownDocs,
  activityItemDocs,
  quickActionDocs,
  emptyStateDocs,
];
