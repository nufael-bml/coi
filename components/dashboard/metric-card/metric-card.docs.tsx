// components/dashboard/metric-card.docs.tsx
import {
  Award,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "./metric-card";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const metricCardDocs = createComponentDocs({
  id: "metric-card",
  name: "MetricCard",
  category: "Data Display",
  icon: Award,
  description:
    "Modern metric card with color-coded icons, badges, progress bars, and trend indicators",

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
      description: "The main value",
      required: true,
    },
    {
      name: "icon",
      type: "LucideIcon",
      description: "Optional icon (color-coded based on badge variant)",
    },
    {
      name: "description",
      type: "string",
      description: "Optional description text",
    },
    {
      name: "change",
      type: "{ value: number; label?: string }",
      description: "Change percentage with optional label",
    },
    { name: "progress", type: "number", description: "Progress value 0-100" },
    {
      name: "badge",
      type: "{ label: string; variant?: string }",
      description:
        "Status badge with variants: success, warning, info, default, secondary, destructive, outline",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "Success State - With Progress",
      description: "Full-featured metric card showing positive growth",
      preview: (
        <MetricCard
          title="Total Revenue"
          value="$45,231.89"
          icon={DollarSign}
          change={{ value: 20.1, label: "from last month" }}
          badge={{ label: "On Track", variant: "success" }}
          progress={75}
        />
      ),
      code: `<MetricCard
  title="Total Revenue"
  value="$45,231.89"
  icon={DollarSign}
  change={{ value: 20.1, label: "from last month" }}
  badge={{ label: "On Track", variant: "success" }}
  progress={75}
/>`,
    },
    {
      title: "Warning State - Below Target",
      description: "Metric showing negative trend with warning badge",
      preview: (
        <MetricCard
          title="Sales Target"
          value="12,234"
          icon={ShoppingCart}
          change={{ value: -2.5, label: "from target" }}
          badge={{ label: "Below Target", variant: "warning" }}
          progress={45}
        />
      ),
      code: `<MetricCard
  title="Sales Target"
  value="12,234"
  icon={ShoppingCart}
  change={{ value: -2.5, label: "from target" }}
  badge={{ label: "Below Target", variant: "warning" }}
  progress={45}
/>`,
    },
    {
      title: "Info State - Neutral Growth",
      description: "Metric with info badge and neutral change",
      preview: (
        <MetricCard
          title="Active Users"
          value="2,543"
          icon={Users}
          change={{ value: 0, label: "no change" }}
          badge={{ label: "Stable", variant: "info" }}
          progress={60}
        />
      ),
      code: `<MetricCard
  title="Active Users"
  value="2,543"
  icon={Users}
  change={{ value: 0, label: "no change" }}
  badge={{ label: "Stable", variant: "info" }}
  progress={60}
/>`,
    },
    {
      title: "Simple - Without Badge",
      description: "Minimal metric card with just icon and change",
      preview: (
        <MetricCard
          title="Conversion Rate"
          value="3.24%"
          icon={TrendingUp}
          change={{ value: 12.5, label: "from last week" }}
        />
      ),
      code: `<MetricCard
  title="Conversion Rate"
  value="3.24%"
  icon={TrendingUp}
  change={{ value: 12.5, label: "from last week" }}
/>`,
    },
    {
      title: "Progress Only",
      description: "Metric focused on goal progress",
      preview: (
        <MetricCard
          title="Monthly Goal"
          value="$32,450"
          icon={Award}
          badge={{ label: "In Progress", variant: "info" }}
          progress={82}
        />
      ),
      code: `<MetricCard
  title="Monthly Goal"
  value="$32,450"
  icon={Award}
  badge={{ label: "In Progress", variant: "info" }}
  progress={82}
/>`,
    },
    {
      title: "Destructive State",
      description: "Critical metric requiring attention",
      preview: (
        <MetricCard
          title="System Errors"
          value="127"
          icon={Award}
          change={{ value: 45.2, label: "from yesterday" }}
          badge={{ label: "Critical", variant: "destructive" }}
        />
      ),
      code: `<MetricCard
  title="System Errors"
  value="127"
  icon={Award}
  change={{ value: 45.2, label: "from yesterday" }}
  badge={{ label: "Critical", variant: "destructive" }}
/>`,
    },
  ],

  usage: {
    when: "Use MetricCard when you need more context than a simple StatCard. Ideal for tracking progress towards goals, showing status with visual indicators, or displaying key metrics with trends. The color-coded icon and modern pill-shaped change indicator make it easy to scan and understand metrics at a glance.",
    bestPractices: [
      "Use progress bars for goal-oriented metrics (revenue targets, completion rates)",
      "Match badge colors to the metric status (success for on-track, warning for at-risk, info for stable)",
      "Always include change percentages to show trends over time",
      "Reserve for important metrics that need extra emphasis and context",
      "Use icons that clearly represent the metric type (dollar for revenue, users for customers)",
      "Keep titles concise (2-3 words) for better scannability",
      "Group related metrics together using StatsGrid for comparison",
      "Use consistent time periods in change labels (from last month, from yesterday)",
    ],
    accessibility: [
      "Progress bars have proper ARIA labels and role attributes",
      "Color is not the only indicator of status - text labels are always present",
      "Badge text is meaningful without relying on color alone",
      "Change indicators include both visual icons and percentage text",
      "Icons have proper aria-hidden attributes as they are decorative",
      "Sufficient color contrast for all text elements",
    ],
  },
});
