import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, FileSearch, FileSignature, PackageCheck, ReceiptText, Send } from "lucide-react";
import { MetricCard, PageHeader, RecordsTable } from "@/components/procurement-ui";
import { DocumentDialog } from "@/components/forms/document-dialog";
import { SUPPLIER_ACCOUNT, recordsFor } from "@/lib/domain";
import { useProcurement } from "@/lib/store";
import { useState } from "react";

export function VendorDashboard() {
  const { state } = useProcurement();
  const [tenderId, setTenderId] = useState<string>();
  const tenders = recordsFor(state, "vendor-tenders");
  const bids = state.bids.filter((item) => item.supplierName === SUPPLIER_ACCOUNT);
  const waitingAwards = state.contracts.filter((item) => item.supplierName === SUPPLIER_ACCOUNT && item.acceptance === "Pending");
  const openDeliveries = state.purchaseOrders.filter((item) => item.supplierName === SUPPLIER_ACCOUNT && (item.status === "Issued" || item.status === "Partially received"));
  const unpaid = state.invoices.filter((item) => item.supplierName === SUPPLIER_ACCOUNT && item.status !== "Paid" && item.status !== "Rejected");
  return (
    <div className="space-y-7">
      <PageHeader title="Supplier overview" description="Welcome back, Bengal Medical Supplies Ltd. Keep the company file verified before you bid." action={<Link to="/vendor/tenders" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Browse tenders <ArrowRight className="size-4" /></Link>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Open tenders" value={String(tenders.length)} detail="Published tenders you can bid on" icon={<FileSearch className="size-5" />} />
        <MetricCard label="Bids" value={String(bids.length)} detail="Draft, submitted and withdrawn" icon={<Send className="size-5" />} />
        <MetricCard label="Awards waiting" value={String(waitingAwards.length)} detail="Contracts waiting for your acceptance" icon={<FileSignature className="size-5" />} />
        <MetricCard label="Deliveries open" value={String(openDeliveries.length)} detail="Orders not yet fully received" icon={<PackageCheck className="size-5" />} />
        <MetricCard label="Invoices unpaid" value={String(unpaid.length)} detail="Draft or submitted, not yet paid" icon={<ReceiptText className="size-5" />} />
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div><h2 className="text-lg font-bold">Recommended tenders</h2><p className="mt-1 text-sm text-muted-foreground">Open the row to read the lots and prepare a bid.</p></div>
          <BadgeCheck className="size-5 text-success" />
        </div>
        <RecordsTable records={tenders} emptyLabel="matching tenders" onOpen={(item) => setTenderId(item.id)} />
      </section>
      {tenderId && <DocumentDialog kind="bid" tenderId={tenderId} open={!!tenderId} onOpenChange={(open) => { if (!open) setTenderId(undefined); }} />}
    </div>
  );
}
