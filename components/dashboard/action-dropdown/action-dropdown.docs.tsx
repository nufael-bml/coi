// components/dashboard/action-dropdown.docs.tsx
import { MoreHorizontal, Edit, Copy, Trash } from "lucide-react";
import { ActionDropdown } from "./action-dropdown";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const actionDropdownDocs = createComponentDocs({
  id: "action-dropdown",
  name: "ActionDropdown",
  category: "Action",
  icon: MoreHorizontal,
  description: "Quick actions menu with three-dot trigger",

  props: [
    {
      name: "actions",
      type: "ActionItem[]",
      description: "Array of actions",
      required: true,
    },
    {
      name: "label",
      type: "string",
      description: "Dropdown label",
      default: '"Actions"',
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      description: "Menu alignment",
      default: '"end"',
    },
  ],

  examples: [
    {
      title: "Standard Actions",
      description: "Common CRUD actions",
      preview: (
        <ActionDropdown
          actions={[
            {
              id: "edit",
              label: "Edit",
              icon: Edit,
              onClick: () => alert("Edit"),
            },
            {
              id: "copy",
              label: "Copy",
              icon: Copy,
              onClick: () => alert("Copy"),
            },
            {
              id: "delete",
              label: "Delete",
              icon: Trash,
              onClick: () => alert("Delete"),
              variant: "destructive",
              separator: true,
            },
          ]}
        />
      ),
      code: `<ActionDropdown
  actions={[
    { id: "edit", label: "Edit", icon: Edit, onClick: () => {} },
    { id: "copy", label: "Copy", icon: Copy, onClick: () => {} },
    { 
      id: "delete", 
      label: "Delete", 
      icon: Trash, 
      onClick: () => {},
      variant: "destructive",
      separator: true
    },
  ]}
/>`,
    },
  ],

  usage: {
    when: "Use ActionDropdown for row actions in tables, cards, or lists. Perfect for secondary actions that don't need primary button prominence.",
    bestPractices: [
      "Group related actions together",
      "Use separators before destructive actions",
      "Keep action labels short and clear",
      "Put most common actions at the top",
      "Use destructive variant for delete/remove actions",
    ],
    accessibility: [
      "Keyboard navigable",
      "Proper ARIA labels",
      "Focus management",
    ],
  },
});
