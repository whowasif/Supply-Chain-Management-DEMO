import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "audit";
const definition = moduleDefinitions.audit;
export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [
    { title: `Audit — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Audit — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
