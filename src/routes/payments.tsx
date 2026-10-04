import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";
import { moduleDefinitions } from "@/lib/procurement";

const moduleKey = "payments";
const definition = moduleDefinitions.payments;
export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [
    { title: `Payments — Procuria` },
    { name: "description", content: definition.description },
    { property: "og:title", content: `Payments — Procuria` },
    { property: "og:description", content: definition.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <ModulePage module={moduleKey} />,
});
