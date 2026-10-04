import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "evaluations";
const definition = moduleDefinitions.evaluations;
export const Route = createFileRoute("/evaluations")({
  head: () => ({ meta: [
    { title: `Evaluations — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Evaluations — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
