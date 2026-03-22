// components/showcase/create-docs.tsx
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import type { ComponentRegistryItem } from "./types";

interface CreateDocsParams {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
  examples: {
    title: string;
    description?: string;
    preview: ReactNode;
    code: string;
  }[];
  props: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    default?: string;
  }[];
  usage: {
    when: string;
    bestPractices: string[];
    accessibility?: string[];
  };
}

export function createComponentDocs(
  params: CreateDocsParams,
): ComponentRegistryItem {
  // Generate basic usage code from first example
  const basicCode = params.examples[0]?.code || "";

  return {
    ...params,
    code: basicCode,
  };
}
