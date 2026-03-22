// components/dashboard/stats-grid.docs.tsx
import { Grid3x3, TrendingUp, Award, Activity, Zap } from "lucide-react";
import { StatsGrid } from "@/components/dashboard/stats-grid/stats-grid";
import { StatCard } from "@/components/dashboard/stat-card/stat-card";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const statsGridDocs = createComponentDocs({
  id: "stats-grid",
  name: "StatsGrid",
  category: "Layout",
  icon: Grid3x3,
  description: "Responsive grid layout for organizing stat cards",

  props: [
    {
      name: "columns",
      type: "1 | 2 | 3 | 4",
      description: "Number of columns",
      default: "4",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Grid items",
      required: true,
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "4 Column Grid",
      description: "Standard dashboard layout",
      preview: (
        <StatsGrid columns={4}>
          <StatCard title="Users" value="2,543" icon={TrendingUp} />
          <StatCard title="Revenue" value="$45K" icon={Award} />
          <StatCard title="Sales" value="574" icon={Activity} />
          <StatCard title="Active" value="127" icon={Zap} />
        </StatsGrid>
      ),
      code: `<StatsGrid columns={4}>
  <StatCard title="Users" value="2,543" icon={TrendingUp} />
  <StatCard title="Revenue" value="$45K" icon={Award} />
  <StatCard title="Sales" value="574" icon={Activity} />
  <StatCard title="Active" value="127" icon={Zap} />
</StatsGrid>`,
    },
    {
      title: "3 Column Grid",
      description: "Alternative layout",
      preview: (
        <StatsGrid columns={3}>
          <StatCard title="Users" value="2,543" icon={TrendingUp} />
          <StatCard title="Revenue" value="$45K" icon={Award} />
          <StatCard title="Sales" value="574" icon={Activity} />
        </StatsGrid>
      ),
      code: `<StatsGrid columns={3}>
  <StatCard title="Users" value="2,543" icon={TrendingUp} />
  <StatCard title="Revenue" value="$45K" icon={Award} />
  <StatCard title="Sales" value="574" icon={Activity} />
</StatsGrid>`,
    },
  ],

  usage: {
    when: "Use StatsGrid to organize multiple stat cards in a responsive layout. It automatically adjusts to different screen sizes.",
    bestPractices: [
      "Use 4 columns for dashboards with many metrics",
      "Use 3 columns for focused views with key metrics",
      "Use 2 columns on tablet-sized screens",
      "Keep all cards in a grid visually similar in height",
      "Group related metrics together",
    ],
  },
});
