import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DocumentDialog } from "@/components/forms/document-dialog";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { SUPPLIER_ACCOUNT, recordsFor } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/bids")({
  head: () => ({ meta: [{ title: "Supplier Bids — Procuria" }, { name: "description", content: "Draft and submitted bids." }] }),
  component: VendorBids,
});

function VendorBids() {
  const { state, focus, setFocus } = useProcurement();
  const [bidId, setBidId] = useState<string>();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (focus?.module === "vendor-bids") {
      setBidId(focus.id);
      setOpen(true);
      setFocus(null);
    }
  }, [focus, setFocus]);
  const records = recordsFor(state, "vendor-bids").filter(() => true);
  return (
    <div className="space-y-6">
      <PageHeader title="My bids" description={`Technical and financial offers from ${SUPPLIER_ACCOUNT}. Draft bids stay editable. Submitted bids are locked.`} />
      <RecordsTable records={records} emptyLabel="bids" onOpen={(item) => { setBidId(item.id); setOpen(true); }} />
      {open && <DocumentDialog kind="bid" documentId={bidId} open={open} onOpenChange={setOpen} />}
    </div>
  );
}
