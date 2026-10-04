import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "receiving";
const definition = moduleDefinitions.receiving;
export const Route = createFileRoute("/receiving")({
  head: () => ({ meta: [
    { title: `Receiving — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Receiving — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
