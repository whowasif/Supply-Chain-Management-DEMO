import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DocumentDialog } from "@/components/forms/document-dialog";
import { PageHeader } from "@/components/procurement-ui";
import { SUPPLIER_ACCOUNT, formatBDT, formatDisplayDate, linesTotal } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/deliveries")({
  head: () => ({ meta: [{ title: "Deliveries — Procuria" }, { name: "description", content: "Confirm a challan and see whether the store accepted the goods." }] }),
  component: VendorDeliveries,
});

function VendorDeliveries() {
  const { state, focus, setFocus } = useProcurement();
  const [orderId, setOrderId] = useState<string>();
  const [confirming, setConfirming] = useState(false);
  const orders = state.purchaseOrders.filter((item) => item.supplierName === SUPPLIER_ACCOUNT && item.status !== "Draft");
  useEffect(() => {
    if (focus?.module === "vendor-deliveries" || focus?.module === "vendor-orders" || focus?.module === "purchase-orders") {
      setOrderId(focus.id);
      setFocus(null);
    }
  }, [focus, setFocus]);
  const selected = orders.find((item) => item.id === orderId);
  const receipts = state.receipts.filter((item) => item.purchaseOrderId === selected?.id);
  const confirmations = state.deliveries.filter((item) => item.purchaseOrderId === selected?.id);
  return (
    <div className="space-y-6">
      <PageHeader title="Deliveries" description="Confirm what you will ship, with a challan number. After the store posts a goods receipt, the result appears here." action={<Button onClick={() => { setOrderId(undefined); setConfirming(true); }}>Confirm delivery</Button>} />
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {orders.map((item) => (
          <li key={item.id}>
            <button type="button" className="w-full p-4 text-left text-sm hover:bg-accent" onClick={() => setOrderId(item.id)}>
              <p className="font-semibold">{item.id} · {item.status}</p>
              <p className="text-muted-foreground">{item.title} · {item.deliveryLocation} · need by {formatDisplayDate(item.needBy)} · {formatBDT(linesTotal(item.lines))}</p>
            </button>
          </li>
        ))}
        {orders.length === 0 && <li className="p-4 text-sm text-muted-foreground">No orders yet.</li>}
      </ul>
      {selected && (
        <section className="space-y-3 rounded-md border border-border bg-card p-4 text-sm">
          <p className="font-semibold">{selected.id} · {selected.title}</p>
          <div className="flex justify-end"><Button type="button" variant="secondary" onClick={() => setConfirming(true)} disabled={selected.status !== "Issued" && selected.status !== "Partially received"}>Confirm delivery</Button></div>
          <p className="font-semibold">Your challans</p>
          {confirmations.map((item) => <p key={item.id}>{item.challan} · arriving {formatDisplayDate(item.expectedDate)} · {item.lines.map((line) => `${line.description} ${line.quantity}`).join(", ")}</p>)}
          {confirmations.length === 0 && <p className="text-muted-foreground">No challan confirmed yet.</p>}
          <p className="font-semibold">Goods receipts</p>
          {receipts.map((item) => (
            <div key={item.id}>
              <p>{item.id} · {item.quality} · {item.warehouse}</p>
              <p className="text-muted-foreground">{item.challan || "No store note."}</p>
            </div>
          ))}
          {receipts.length === 0 && <p className="text-muted-foreground">The store has not posted a receipt yet.</p>}
        </section>
      )}
      {confirming && <DocumentDialog kind="delivery" purchaseOrderId={orderId} open onOpenChange={(open) => { if (!open) setConfirming(false); }} />}
    </div>
  );
}
