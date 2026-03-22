// components/dashboard/status-badge.docs.tsx
import { Tag, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge/status-badge";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const statusBadgeDocs = createComponentDocs({
  id: "status-badge",
  name: "StatusBadge",
  category: "Feedback",
  icon: Tag,
  description: "Colored badges for status indicators and labels",

  props: [
    {
      name: "variant",
      type: '"default" | "secondary" | "destructive" | "outline"',
      description: "Standard badge variants",
    },
    {
      name: "status",
      type: '"success" | "warning" | "info"',
      description: "Colored status variants",
    },
    { name: "icon", type: "LucideIcon", description: "Optional icon" },
    {
      name: "children",
      type: "ReactNode",
      description: "Badge content",
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
      title: "Status Variants",
      description: "Different status colors",
      preview: (
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="success" icon={CheckCircle}>
            Success
          </StatusBadge>
          <StatusBadge status="warning" icon={AlertTriangle}>
            Warning
          </StatusBadge>
          <StatusBadge status="info" icon={Info}>
            Info
          </StatusBadge>
        </div>
      ),
      code: `<StatusBadge status="success" icon={CheckCircle}>Success</StatusBadge>
<StatusBadge status="warning" icon={AlertTriangle}>Warning</StatusBadge>
<StatusBadge status="info" icon={Info}>Info</StatusBadge>`,
    },
    {
      title: "Standard Variants",
      description: "shadcn badge variants",
      preview: (
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant="default">Default</StatusBadge>
          <StatusBadge variant="secondary">Secondary</StatusBadge>
          <StatusBadge variant="destructive">Destructive</StatusBadge>
          <StatusBadge variant="outline">Outline</StatusBadge>
        </div>
      ),
      code: `<StatusBadge variant="default">Default</StatusBadge>
<StatusBadge variant="secondary">Secondary</StatusBadge>
<StatusBadge variant="destructive">Destructive</StatusBadge>
<StatusBadge variant="outline">Outline</StatusBadge>`,
    },
  ],

  usage: {
    when: "Use StatusBadge to show status, categories, or labels. Perfect for indicating states like 'active', 'pending', 'completed'.",
    bestPractices: [
      "Use consistent colors for the same status across your app",
      "Keep badge text short (1-2 words)",
      "Use icons when they add clarity",
      "Don't rely solely on color to convey meaning",
    ],
    accessibility: [
      "Ensure sufficient color contrast",
      "Use meaningful text, not just colors",
      "Icons should be decorative with aria-hidden",
    ],
  },
});
