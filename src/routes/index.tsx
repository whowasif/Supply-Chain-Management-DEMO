import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Procurement Dashboard — Procuria" }, { name: "description", content: "Internal procurement overview, approvals, tenders and supply chain performance." }, { property: "og:title", content: "Procurement Dashboard — Procuria" }, { property: "og:description", content: "Internal procurement overview, approvals, tenders and supply chain performance." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <Dashboard />;
}
