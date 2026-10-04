import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "plans";
const definition = moduleDefinitions.plans;
export const Route = createFileRoute("/plans")({
  head: () => ({ meta: [
    { title: `Plans — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Plans — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
