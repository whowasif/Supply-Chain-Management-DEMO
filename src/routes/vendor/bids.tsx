import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { tenders } from "@/lib/procurement";
export const Route = createFileRoute("/vendor/bids")({ head: () => ({ meta: [{ title: "Supplier Bids — Procuria" }, { name: "description", content: "Supplier portal bids workspace." }, { property: "og:title", content: "Supplier Bids — Procuria" }, { property: "og:description", content: "Supplier portal bids workspace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Page });
function Page(){ return <div className="space-y-6"><PageHeader title="Bids" description="Track your submitted technical and financial offers."/><RecordsTable records={tenders.slice(0, 3)} emptyLabel="bids"/></div> }
