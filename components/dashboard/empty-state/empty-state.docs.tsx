// components/dashboard/empty-state.docs.tsx
import { FileX } from "lucide-react";
import { EmptyState } from "./empty-state";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const emptyStateDocs = createComponentDocs({
  id: "empty-state",
  name: "EmptyState",
  category: "Feedback",
  icon: FileX,
  description: "Empty state placeholder with call-to-action",

  props: [
    { name: "icon", type: "LucideIcon", description: "Empty state icon" },
    {
      name: "title",
      type: "string",
      description: "Title text",
      required: true,
    },
    { name: "description", type: "string", description: "Description text" },
    {
      name: "action",
      type: "{ label: string; onClick: () => void }",
      description: "Call-to-action button",
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "With Action",
      description: "Empty state with CTA button",
      preview: (
        <EmptyState
          icon={FileX}
          title="No documents found"
          description="Get started by uploading your first document"
          action={{
            label: "Upload Document",
            onClick: () => alert("Upload"),
          }}
        />
      ),
      code: `<EmptyState
  icon={FileX}
  title="No documents found"
  description="Get started by uploading your first document"
  action={{
    label: "Upload Document",
    onClick: () => {},
  }}
/>`,
    },
    {
      title: "Without Action",
      description: "Simple empty message",
      preview: (
        <EmptyState
          icon={FileX}
          title="No results found"
          description="Try adjusting your search criteria"
        />
      ),
      code: `<EmptyState
  icon={FileX}
  title="No results found"
  description="Try adjusting your search criteria"
/>`,
    },
  ],

  usage: {
    when: "Use EmptyState when there's no data to display. Always provide clear guidance on what users can do next.",
    bestPractices: [
      "Explain why it's empty",
      "Provide a clear action to resolve it",
      "Use friendly, encouraging language",
      "Choose appropriate icons that match the context",
      "Don't just say 'No data' - be specific",
    ],
    accessibility: [
      "Meaningful text alternatives",
      "Clear call-to-action buttons",
      "Proper focus management",
    ],
  },
});
