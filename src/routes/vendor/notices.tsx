import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/procurement-ui";
import { SUPPLIER_ACCOUNT, formatDisplayDate } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/notices")({
  head: () => ({ meta: [{ title: "Notices — Procuria" }, { name: "description", content: "Award notices and tenders that are no longer open." }] }),
  component: VendorNotices,
});

function VendorNotices() {
  const { state } = useProcurement();
  const awards = state.evaluations.filter((item) => item.bidder === SUPPLIER_ACCOUNT && (item.status === "Awarded" || item.status === "Unsuccessful"));
  const closed = state.tenders.filter((item) => item.status === "Awarded" || item.status === "Closed");
  return (
    <div className="space-y-6">
      <PageHeader title="Notices" description="Award results for your company, and tenders that are no longer open." />
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Award notices</h2>
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {awards.map((item) => <li key={item.id} className="p-4 text-sm"><p className="font-semibold">{item.tenderId} · {item.status}</p><p className="text-muted-foreground">{item.title} · {formatDisplayDate(item.updatedAt)}</p></li>)}
          {awards.length === 0 && <li className="p-4 text-sm text-muted-foreground">No award notice yet.</li>}
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Closed tenders</h2>
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {closed.map((item) => <li key={item.id} className="p-4 text-sm"><p className="font-semibold">{item.id} · {item.status}</p><p className="text-muted-foreground">{item.title} · closed {formatDisplayDate(item.closingDate)}</p></li>)}
          {closed.length === 0 && <li className="p-4 text-sm text-muted-foreground">No closed tender yet.</li>}
        </ul>
      </section>
    </div>
  );
}
