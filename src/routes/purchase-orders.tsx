import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "purchase-orders";
const definition = moduleDefinitions["purchase-orders"];
export const Route = createFileRoute("/purchase-orders")({
  head: () => ({ meta: [
    { title: `Purchase-orders — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Purchase-orders — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
