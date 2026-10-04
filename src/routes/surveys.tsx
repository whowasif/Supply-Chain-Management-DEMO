import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "surveys";
const definition = moduleDefinitions.surveys;
export const Route = createFileRoute("/surveys")({
  head: () => ({ meta: [
    { title: `Surveys — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Surveys — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
