import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { tenders, purchaseOrders } from "@/lib/procurement";
export const Route = createFileRoute("/vendor/orders")({ head: () => ({ meta: [{ title: "Supplier Orders — Procuria" }, { name: "description", content: "Supplier portal orders workspace." }, { property: "og:title", content: "Supplier Orders — Procuria" }, { property: "og:description", content: "Supplier portal orders workspace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Page });
function Page(){ return <div className="space-y-6"><PageHeader title="Orders" description="Manage your supplier orders and related documentation."/><RecordsTable records={"orders" === "orders" ? purchaseOrders : tenders.slice(0, 4)} emptyLabel="orders"/></div> }
