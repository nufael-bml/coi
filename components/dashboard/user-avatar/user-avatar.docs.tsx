// components/dashboard/user-avatar.docs.tsx
import { User } from "lucide-react";
import { UserAvatar } from "@/components/dashboard/user-avatar/user-avatar";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const userAvatarDocs = createComponentDocs({
  id: "user-avatar",
  name: "UserAvatar",
  category: "User",
  icon: User,
  description: "User avatar with automatic fallback initials",

  props: [
    { name: "src", type: "string | null", description: "Avatar image URL" },
    { name: "alt", type: "string", description: "Alt text", default: '"User"' },
    { name: "fallback", type: "string", description: "Name for initials" },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      description: "Avatar size",
      default: '"md"',
    },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "Different Sizes",
      description: "Avatar in various sizes",
      preview: (
        <div className="flex items-center gap-4">
          <div className="text-center space-y-2">
            <UserAvatar fallback="John Doe" size="sm" />
            <p className="text-xs text-muted-foreground">Small</p>
          </div>
          <div className="text-center space-y-2">
            <UserAvatar fallback="Jane Smith" size="md" />
            <p className="text-xs text-muted-foreground">Medium</p>
          </div>
          <div className="text-center space-y-2">
            <UserAvatar fallback="Bob Wilson" size="lg" />
            <p className="text-xs text-muted-foreground">Large</p>
          </div>
          <div className="text-center space-y-2">
            <UserAvatar fallback="Alice Brown" size="xl" />
            <p className="text-xs text-muted-foreground">XLarge</p>
          </div>
        </div>
      ),
      code: `<UserAvatar fallback="John Doe" size="sm" />
<UserAvatar fallback="Jane Smith" size="md" />
<UserAvatar fallback="Bob Wilson" size="lg" />
<UserAvatar fallback="Alice Brown" size="xl" />`,
    },
  ],

  usage: {
    when: "Use UserAvatar to represent users throughout your application. It automatically generates initials when no image is provided.",
    bestPractices: [
      "Always provide a fallback name",
      "Use consistent sizes in the same context",
      "Optimize avatar images for web",
      "Use appropriate sizes for different contexts (sm for lists, lg for profiles)",
    ],
    accessibility: [
      "Alt text is automatically generated",
      "Fallback initials are visible if image fails",
      "Proper contrast for initials",
    ],
  },
});
