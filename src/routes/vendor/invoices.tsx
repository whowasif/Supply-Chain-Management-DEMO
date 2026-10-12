import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DocumentDialog } from "@/components/forms/document-dialog";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { SUPPLIER_ACCOUNT, recordsFor } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/invoices")({
  head: () => ({ meta: [{ title: "Invoices and payments — Procuria" }, { name: "description", content: "Supplier invoices, Mushak 6.3 and payment status." }] }),
  component: VendorInvoices,
});

function VendorInvoices() {
  const { state, focus, setFocus } = useProcurement();
  const [invoiceId, setInvoiceId] = useState<string>();
  const [open, setOpen] = useState(false);
  const records = recordsFor(state, "payments").filter((item) => state.invoices.some((invoice) => invoice.id === item.id && invoice.supplierName === SUPPLIER_ACCOUNT));
  useEffect(() => {
    if (focus?.module === "vendor-invoices" || focus?.module === "payments") {
      const invoice = state.invoices.find((item) => item.id === focus.id && item.supplierName === SUPPLIER_ACCOUNT);
      if (invoice) {
        setInvoiceId(invoice.id);
        setOpen(true);
      }
      setFocus(null);
    }
  }, [focus, setFocus, state.invoices]);
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices and payments" description="Submit an invoice with a Mushak 6.3 whose date matches the invoice date. Payment is marked by the buyer." action={<Button onClick={() => { setInvoiceId(undefined); setOpen(true); }}>Submit invoice</Button>} />
      <RecordsTable records={records} emptyLabel="invoices" onOpen={(item) => { setInvoiceId(item.id); setOpen(true); }} />
      {open && <DocumentDialog kind="payments" documentId={invoiceId} open={open} onOpenChange={setOpen} />}
    </div>
  );
}
