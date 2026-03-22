// components/dashboard/search-bar.docs.tsx
import { Search as SearchIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { createComponentDocs } from "@/components/showcase/create-docs";

export const searchBarDocs = createComponentDocs({
  id: "search-bar",
  name: "SearchBar",
  category: "Input",
  icon: SearchIcon,
  description: "Enhanced search input with clear button",

  props: [
    {
      name: "placeholder",
      type: "string",
      description: "Placeholder text",
      default: '"Search..."',
    },
    { name: "value", type: "string", description: "Controlled value" },
    {
      name: "onChange",
      type: "(value: string) => void",
      description: "Change handler",
    },
    { name: "onClear", type: "() => void", description: "Clear handler" },
    {
      name: "className",
      type: "string",
      description: "Additional CSS classes",
    },
  ],

  examples: [
    {
      title: "Basic Search",
      description: "Search with clear button",
      preview: <SearchBar placeholder="Search anything..." />,
      code: `const [search, setSearch] = useState("");

<SearchBar
  placeholder="Search anything..."
  value={search}
  onChange={setSearch}
/>`,
    },
  ],

  usage: {
    when: "Use SearchBar for search functionality with a clear button. Works in tables, lists, or as a global search.",
    bestPractices: [
      "Provide clear, contextual placeholder text",
      "Show search results as user types (debounced)",
      "Clear button appears only when there's input",
      "Consider adding keyboard shortcuts (Cmd+K)",
    ],
    accessibility: [
      "Proper input labeling",
      "Clear button is keyboard accessible",
      "Focus states are visible",
    ],
  },
});
