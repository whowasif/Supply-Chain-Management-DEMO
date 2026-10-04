import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "contracts";
const definition = moduleDefinitions.contracts;
export const Route = createFileRoute("/contracts")({
  head: () => ({ meta: [
    { title: `Contracts — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Contracts — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
