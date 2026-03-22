// components/showcase/types.ts
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ComponentExample {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}

export interface ComponentUsage {
  when: string;
  bestPractices: string[];
  accessibility?: string[];
}

export interface ComponentRegistryItem {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
  code: string;
  props: ComponentProp[];
  examples: ComponentExample[];
  usage: ComponentUsage;
}
