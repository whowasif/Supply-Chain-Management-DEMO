import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "inventory";
const definition = moduleDefinitions.inventory;
export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [
    { title: `Inventory — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Inventory — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
