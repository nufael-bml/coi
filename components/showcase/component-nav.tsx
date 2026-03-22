// components/showcase/component-nav.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ComponentRegistryItem } from "./types";

interface ComponentNavProps {
  components: ComponentRegistryItem[];
  selectedId: string;
  onSelect: (component: ComponentRegistryItem) => void;
}

export function ComponentNav({
  components,
  selectedId,
  onSelect,
}: ComponentNavProps) {
  // Group by category
  const categories = Array.from(new Set(components.map((c) => c.category)));

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const categoryComponents = components.filter(
          (c) => c.category === category,
        );

        return (
          <div key={category}>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {category}
            </h4>
            <div className="space-y-1">
              {categoryComponents.map((component) => {
                const Icon = component.icon;
                return (
                  <Button
                    key={component.id}
                    variant={
                      selectedId === component.id ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start",
                      selectedId === component.id && "bg-secondary",
                    )}
                    onClick={() => onSelect(component)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {component.name}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
