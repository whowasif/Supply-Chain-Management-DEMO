import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { tenders } from "@/lib/procurement";
export const Route = createFileRoute("/vendor/tenders")({ head: () => ({ meta: [{ title: "Supplier Tenders — Procuria" }, { name: "description", content: "Supplier portal tenders workspace." }, { property: "og:title", content: "Supplier Tenders — Procuria" }, { property: "og:description", content: "Supplier portal tenders workspace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Page });
function Page(){ return <div className="space-y-6"><PageHeader title="Tenders" description="Find opportunities matching your verified supply categories."/><RecordsTable records={tenders.slice(0, 4)} emptyLabel="tenders"/></div> }
