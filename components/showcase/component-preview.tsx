// components/showcase/component-preview.tsx
"use client";

import { Card } from "@/components/ui/card";
import type { ComponentRegistryItem } from "./types";

interface ComponentPreviewProps {
  component: ComponentRegistryItem;
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  return (
    <div className="space-y-6">
      {component.examples.map((example, index) => (
        <div key={`${component.id}-example-${index}`} className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold">{example.title}</h3>
            {example.description && (
              <p className="text-sm text-muted-foreground">
                {example.description}
              </p>
            )}
          </div>
          <Card className="p-6">
            <div className="flex items-center justify-center min-h-[200px]">
              {example.preview}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
