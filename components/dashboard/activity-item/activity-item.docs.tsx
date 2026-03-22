// components/dashboard/activity-item.docs.tsx
import { Activity, FileText } from "lucide-react";
import { ActivityItem } from "./activity-item";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const activityItemDocs = createComponentDocs({
  id: "activity-item",
  name: "ActivityItem",
  category: "Display",
  icon: Activity,
  description: "Single activity entry for activity feeds",

  props: [
    {
      name: "user",
      type: "{ name: string; avatar?: string }",
      description: "User info for avatar",
    },
    {
      name: "icon",
      type: "LucideIcon",
      description: "Alternative to user avatar",
    },
    {
      name: "title",
      type: "string",
      description: "Activity title",
      required: true,
    },
    { name: "description", type: "string", description: "Activity details" },
    { name: "time", type: "string", description: "Time label", required: true },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "With User Avatar",
      description: "Activity with user information",
      preview: (
        <ActivityItem
          user={{ name: "John Doe" }}
          title="John Doe created a new project"
          description="Dashboard redesign project"
          time="2 hours ago"
        />
      ),
      code: `<ActivityItem
  user={{ name: "John Doe", avatar: "/avatar.jpg" }}
  title="John Doe created a new project"
  description="Dashboard redesign project"
  time="2 hours ago"
/>`,
    },
    {
      title: "With Icon",
      description: "System activity with icon",
      preview: (
        <ActivityItem
          icon={FileText}
          title="New document uploaded"
          description="Q4-report.pdf"
          time="5 hours ago"
        />
      ),
      code: `<ActivityItem
  icon={FileText}
  title="New document uploaded"
  description="Q4-report.pdf"
  time="5 hours ago"
/>`,
    },
  ],

  usage: {
    when: "Use ActivityItem to display individual activities in a feed. Works great for recent activity lists, notifications, or audit logs.",
    bestPractices: [
      "Use user avatars for user-generated activities",
      "Use icons for system-generated activities",
      "Keep titles concise and action-oriented",
      "Use relative time ('2 hours ago') for recent items",
      "Provide context in the description",
    ],
    accessibility: [
      "Semantic HTML structure",
      "Proper heading hierarchy",
      "Time is machine-readable",
    ],
  },
});
