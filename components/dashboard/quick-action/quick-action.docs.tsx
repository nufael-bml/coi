// components/dashboard/quick-action.docs.tsx
import { Zap, Plus, Users, FileText } from "lucide-react";
import { QuickAction } from "./quick-action";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const quickActionDocs = createComponentDocs({
  id: "quick-action",
  name: "QuickAction",
  category: "Action",
  icon: Zap,
  description: "Action button card for dashboard shortcuts",

  props: [
    {
      name: "icon",
      type: "LucideIcon",
      description: "Action icon",
      required: true,
    },
    {
      name: "label",
      type: "string",
      description: "Action label",
      required: true,
    },
    { name: "description", type: "string", description: "Action description" },
    {
      name: "onClick",
      type: "() => void",
      description: "Click handler",
      required: true,
    },
    {
      name: "variant",
      type: '"default" | "outline"',
      description: "Button variant",
      default: '"outline"',
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "Quick Actions Grid",
      description: "Common dashboard actions",
      preview: (
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            icon={Plus}
            label="Create Project"
            description="Start a new project"
            onClick={() => alert("Create")}
          />
          <QuickAction
            icon={Users}
            label="Invite Team"
            description="Add team members"
            onClick={() => alert("Invite")}
          />
          <QuickAction
            icon={FileText}
            label="Upload Files"
            description="Import documents"
            onClick={() => alert("Upload")}
          />
        </div>
      ),
      code: `<div className="grid gap-4 md:grid-cols-3">
  <QuickAction
    icon={Plus}
    label="Create Project"
    description="Start a new project"
    onClick={() => {}}
  />
  <QuickAction
    icon={Users}
    label="Invite Team"
    description="Add team members"
    onClick={() => {}}
  />
  <QuickAction
    icon={FileText}
    label="Upload Files"
    description="Import documents"
    onClick={() => {}}
  />
</div>`,
    },
  ],

  usage: {
    when: "Use QuickAction for frequently used actions on dashboards. Perfect for getting users to key features quickly.",
    bestPractices: [
      "Limit to 3-6 actions to avoid overwhelming users",
      "Use clear, action-oriented labels",
      "Choose icons that clearly represent the action",
      "Order by usage frequency",
      "Keep descriptions short and helpful",
    ],
    accessibility: [
      "Keyboard accessible buttons",
      "Clear focus states",
      "Descriptive labels",
    ],
  },
});
