import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "requisitions";
const definition = moduleDefinitions.requisitions;
export const Route = createFileRoute("/requisitions")({
  head: () => ({ meta: [
    { title: `Requisitions — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Requisitions — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
