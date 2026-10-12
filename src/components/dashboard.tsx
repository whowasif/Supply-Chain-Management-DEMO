import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight, BadgeCheck, CircleDollarSign, Clock3, FileSearch, PackageCheck, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { ApprovalActions } from "@/components/approval-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetricCard, PageHeader, StatusBadge } from "@/components/procurement-ui";
import { approvalQueue, committedSpend, formatBDT, formatCompactBDT, formatDisplayDate, invoiceAmounts, linesTotal, planCeiling, toneFor, type ApprovalItem } from "@/lib/domain";
import { bandForValue, roleLabel } from "@/lib/policy";
import { useProcurement } from "@/lib/store";

const stages = [
  { label: "Requests", to: "/requisitions" },
  { label: "Review", to: "/approvals" },
  { label: "Tendering", to: "/tenders" },
  { label: "Evaluation", to: "/evaluations" },
  { label: "Awarded", to: "/purchase-orders" },
  { label: "Delivery", to: "/receiving" },
] as const;

export function Dashboard() {
  const { state } = useProcurement();
  const [review, setReview] = useState<ApprovalItem>();
  const queue = approvalQueue(state);
  const spend = committedSpend(state);
  const ceiling = planCeiling(state);
  const utilization = ceiling > 0 ? Math.round((spend / ceiling) * 100) : 0;
  const activeTenders = state.tenders.filter((item) => item.status === "Published" || item.status === "Evaluation").length;
  const deliveries = state.purchaseOrders.filter((item) => item.status === "Issued" || item.status === "Partially received").length;
  const received = state.purchaseOrders.filter((item) => item.status === "Received").length;
  const issued = state.purchaseOrders.filter((item) => item.status !== "Draft").length;
  const onTime = issued === 0 ? "—" : `${Math.round((received / issued) * 100)}%`;
  const counts = [
    state.requisitions.length,
    state.requisitions.filter((item) => item.status === "Submitted").length,
    state.tenders.filter((item) => item.status === "Draft" || item.status === "Published").length,
    state.evaluations.filter((item) => item.status === "Draft").length + state.tenders.filter((item) => item.status === "Evaluation").length,
    state.tenders.filter((item) => item.status === "Awarded").length,
    deliveries,
  ];

  return (
    <div className="space-y-7">
      <PageHeader title="Good afternoon, Nabila" description="Here is today’s procurement position across Bangladesh programmes." action={<Button asChild><Link to="/requisitions"><span>New requisition</span><ArrowRight className="size-4" /></Link></Button>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Procurement overview">
        <MetricCard label="Committed spend" value={formatCompactBDT(spend)} detail={ceiling ? `${utilization}% of active procurement plans` : "No active plan ceiling"} icon={<CircleDollarSign className="size-5" />} />
        <MetricCard label="Pending approvals" value={String(queue.length)} detail="Requisitions and invoices awaiting a decision" icon={<BadgeCheck className="size-5" />} />
        <MetricCard label="Active tenders" value={String(activeTenders)} detail="Published or under evaluation" icon={<FileSearch className="size-5" />} />
        <MetricCard label="Fully received orders" value={onTime} detail={`${received} of ${issued} issued orders`} icon={<TrendingUp className="size-5" />} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <div className="rounded-md border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div><h2 className="font-bold text-foreground">Pending your approval</h2><p className="mt-0.5 text-xs text-muted-foreground">Submitted requisitions and supplier invoices</p></div>
            <Link to="/approvals" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {queue.slice(0, 3).map((item) => {
              const id = item.record.id;
              const title = item.record.title;
              const value = item.kind === "requisition" ? linesTotal(item.record.lines) : invoiceAmounts(item.record.lines).net;
              return (
                <article key={id} className="p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-primary">{id}</span><StatusBadge tone={toneFor(item.record.status)}>{item.record.status}</StatusBadge></div>
                      <h3 className="mt-2 truncate text-sm font-semibold text-foreground">{title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{item.record.department}{item.kind === "requisition" && item.record.awaitingRole ? ` · ${bandForValue(value).label} · ${item.record.method} · ${roleLabel(item.record.awaitingRole)}` : ""}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{formatBDT(value)}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <ApprovalActions item={item} />
                    <Button size="sm" variant="secondary" onClick={() => setReview(item)}>Review</Button>
                  </div>
                </article>
              );
            })}
            {queue.length === 0 && <p className="p-5 text-sm text-muted-foreground">Nothing is waiting for approval.</p>}
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between"><h2 className="font-bold text-foreground">Annual plan</h2><span className="text-xs font-semibold text-muted-foreground">FY 2026–27</span></div>
          <div className="mt-5">
            <div className="flex items-end justify-between"><p className="text-3xl font-bold">{utilization}%</p><p className="text-xs text-muted-foreground">{formatCompactBDT(spend)} of {formatCompactBDT(ceiling)}</p></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(utilization, 100)}%` }} /></div>
          </div>
          <Link to="/plans" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">Open procurement plan <ArrowRight className="size-4" /></Link>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.9fr)]">
        <div className="rounded-md border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between"><div><h2 className="font-bold">Procurement pipeline</h2><p className="mt-0.5 text-xs text-muted-foreground">Live counts from the register</p></div><Activity className="size-5 text-muted-foreground" /></div>
          <div className="mt-8 grid grid-cols-3 gap-5 sm:grid-cols-6">
            {stages.map((step, index) => (
              <Link key={step.label} to={step.to} className="relative text-center">
                <div className="mx-auto grid size-11 place-items-center rounded-full border-4 border-accent bg-primary text-sm font-bold text-primary-foreground">{counts[index] ?? 0}</div>
                <p className="mt-2 text-xs font-medium text-muted-foreground">{step.label}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4"><h2 className="font-bold">Recent activity</h2></div>
          <ul className="divide-y divide-border">
            {state.audit.slice(0, 4).map((item) => (
              <li key={item.id}>
                <Link to={item.documentType === "bid" ? "/evaluations" : item.documentType === "invoice" ? "/payments" : item.documentType === "goods receipt" || item.documentType === "delivery" ? "/receiving" : `/${item.documentType === "purchase order" ? "purchase-orders" : item.documentType === "requisition" ? "requisitions" : item.documentType === "tender" ? "tenders" : "audit"}`} className="flex gap-3 px-5 py-3 hover:bg-muted/40">
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-primary"><Clock3 className="size-3.5" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.action} · {item.documentId}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.actor} · {item.fromStatus} to {item.toStatus}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{formatDisplayDate(item.at)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <Link to="/suppliers" className="flex min-h-24 items-center gap-4 rounded-md border border-border bg-card p-5 shadow-card hover:border-primary"><Users className="size-8 text-primary" /><div><p className="text-xl font-bold">{state.suppliers.length}</p><p className="text-sm text-muted-foreground">Registered suppliers</p></div></Link>
        <Link to="/receiving" className="flex min-h-24 items-center gap-4 rounded-md border border-border bg-card p-5 shadow-card hover:border-primary"><PackageCheck className="size-8 text-primary" /><div><p className="text-xl font-bold">{deliveries}</p><p className="text-sm text-muted-foreground">Deliveries in progress</p></div></Link>
        <Link to="/tenders" className="flex min-h-24 items-center gap-4 rounded-md border border-border bg-card p-5 shadow-card hover:border-primary"><FileSearch className="size-8 text-primary" /><div><p className="text-xl font-bold">{activeTenders}</p><p className="text-sm text-muted-foreground">Open tender events</p></div></Link>
      </section>
      <Dialog open={!!review} onOpenChange={(next) => { if (!next) setReview(undefined); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{review?.record.id}</DialogTitle>
            <DialogDescription>{review?.record.title}</DialogDescription>
          </DialogHeader>
          {review?.kind === "requisition" && <p className="text-sm">{review.record.justification}</p>}
          {review && <ApprovalActions item={review} onDone={() => setReview(undefined)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
