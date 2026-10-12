import { createFileRoute } from "@tanstack/react-router";
import { ApprovalActions } from "@/components/approval-actions";
import { PageHeader, StatusBadge } from "@/components/procurement-ui";
import { approvalQueue, formatBDT, invoiceAmounts, linesTotal, toneFor } from "@/lib/domain";
import { DEMO_POLICY_NOTE, bandForValue, roleLabel } from "@/lib/policy";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [{ title: "Approvals — Procuria" }, { name: "description", content: "Review procurement items awaiting authorization." }] }),
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const { state } = useProcurement();
  const queue = approvalQueue(state);
  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Submitted requisitions and supplier invoices waiting for a decision. Returning an item requires a comment." />
      <p className="rounded-md bg-muted px-3 py-2 text-sm">{DEMO_POLICY_NOTE}</p>
      <div className="space-y-4">
        {queue.map((item) => {
          const value = item.kind === "requisition" ? linesTotal(item.record.lines) : invoiceAmounts(item.record.lines).net;
          const band = item.kind === "requisition" ? bandForValue(value) : undefined;
          return (
            <article key={item.record.id} className="rounded-md border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-primary">{item.record.id}</span><StatusBadge tone={toneFor(item.record.status)}>{item.kind === "invoice" ? "Invoice" : "Requisition"}</StatusBadge></div>
              <h2 className="mt-2 text-lg font-bold">{item.record.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.record.department} · {formatBDT(value)}{band ? ` · ${band.label} · ${roleLabel(band.role)}` : ""}</p>
              {item.kind === "requisition" && <p className="mt-3 text-sm">{item.record.justification}</p>}
              <div className="mt-4"><ApprovalActions item={item} /></div>
            </article>
          );
        })}
        {queue.length === 0 && <p className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">The approval queue is empty.</p>}
      </div>
    </div>
  );
}
