import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "tenders";
const definition = moduleDefinitions.tenders;
export const Route = createFileRoute("/tenders")({
  head: () => ({ meta: [
    { title: `Tenders — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Tenders — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
