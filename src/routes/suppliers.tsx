import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "suppliers";
const definition = moduleDefinitions.suppliers;
export const Route = createFileRoute("/suppliers")({
  head: () => ({ meta: [
    { title: `Suppliers — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Suppliers — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
