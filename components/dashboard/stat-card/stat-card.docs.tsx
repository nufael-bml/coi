// components/dashboard/stat-card.docs.tsx
import { TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const statCardDocs = createComponentDocs({
  id: "stat-card",
  name: "StatCard",
  category: "Data Display",
  icon: TrendingUp,
  description: "Display key metrics with optional trends and icons",

  props: [
    {
      name: "title",
      type: "string",
      description: "The card title",
      required: true,
    },
    {
      name: "value",
      type: "string | number",
      description: "The main value to display",
      required: true,
    },
    {
      name: "icon",
      type: "LucideIcon",
      description: "Optional icon component",
    },
    {
      name: "description",
      type: "string",
      description: "Optional description text",
    },
    {
      name: "trend",
      type: "{ value: number; label?: string }",
      description: "Optional trend data with percentage",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "Basic Stat Card",
      description: "Simple card with a value and icon",
      preview: (
        <StatCard
          title="Total Users"
          value="2,543"
          icon={TrendingUp}
          description="Active users"
        />
      ),
      code: `<StatCard
  title="Total Users"
  value="2,543"
  icon={TrendingUp}
  description="Active users"
/>`,
    },
    {
      title: "With Positive Trend",
      description: "Card showing positive growth",
      preview: (
        <StatCard
          title="Revenue"
          value="$45,231"
          icon={TrendingUp}
          trend={{ value: 12.5, label: "from last month" }}
        />
      ),
      code: `<StatCard
  title="Revenue"
  value="$45,231"
  icon={TrendingUp}
  trend={{ value: 12.5, label: "from last month" }}
/>`,
    },
    {
      title: "With Negative Trend",
      description: "Card showing decline",
      preview: (
        <StatCard
          title="Sales"
          value="574"
          icon={TrendingUp}
          trend={{ value: -4.3, label: "from last month" }}
        />
      ),
      code: `<StatCard
  title="Sales"
  value="574"
  icon={TrendingUp}
  trend={{ value: -4.3, label: "from last month" }}
/>`,
    },
  ],

  usage: {
    when: "Use StatCard to display important metrics, KPIs, or statistics on dashboards. Perfect for showing numbers that need quick visibility with optional trend indicators.",
    bestPractices: [
      "Keep titles short and descriptive (2-3 words)",
      "Use icons that relate to the metric being displayed",
      "Show trends when comparing to previous periods",
      "Group related stats together using StatsGrid",
      "Use consistent value formatting (currency, percentages, etc.)",
    ],
    accessibility: [
      "Icons are decorative and have aria-hidden",
      "Ensure good color contrast for trend indicators",
      "Value and title are properly labeled for screen readers",
    ],
  },
});
