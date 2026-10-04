import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "reports";
const definition = moduleDefinitions.reports;
export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: `Reports — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Reports — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
