import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentDialog, type DocumentKind } from "@/components/forms/document-dialog";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { formatBDT, formatDisplayDate, recordsFor, stockPositions } from "@/lib/domain";
import { moduleDefinitions, type ProcurementRecord } from "@/lib/procurement";
import { useProcurement } from "@/lib/store";

const creatable = new Set<string>(["requisitions", "plans", "surveys", "tenders", "evaluations", "suppliers", "purchase-orders", "contracts", "receiving", "inventory", "payments"]);

export function ModulePage({ module }: { module: keyof typeof moduleDefinitions }) {
  const { state, focus, setFocus } = useProcurement();
  const definition = moduleDefinitions[module];
  const records = useMemo(() => recordsFor(state, module), [state, module]);
  const [documentId, setDocumentId] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ProcurementRecord>();
  const stock = module === "inventory" ? stockPositions(state) : [];

  useEffect(() => {
    if (focus?.module !== module) return;
    if (creatable.has(module)) {
      setDocumentId(focus.id);
      setOpen(true);
    } else {
      const match = records.find((item) => item.id === focus.id);
      if (match) setDetail(match);
    }
    setFocus(null);
  }, [focus, module, records, setFocus]);

  if (!definition) return null;
  const kind = module as DocumentKind;
  return (
    <div className="space-y-6">
      <PageHeader title={definition.title} description={definition.description} action={creatable.has(module) ? <Button onClick={() => { setDocumentId(undefined); setOpen(true); }}><Plus className="size-4" />{definition.action}</Button> : undefined} />
      {module === "inventory" && stock.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Stock on hand">
          {stock.map((item) => (
            <article key={item.id} className="rounded-md border border-border bg-card p-4 shadow-card">
              <p className="text-sm font-semibold">{item.item}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.storeName} · batch {item.batch || "—"} · expiry {item.expiry ? formatDisplayDate(item.expiry) : "—"}</p>
              <p className="mt-2 text-xl font-bold">{item.onHand} on hand</p>
            </article>
          ))}
        </section>
      )}
      {module === "reports" && <p className="text-sm text-muted-foreground">Committed purchase-order value across departments is {formatBDT(records.reduce((sum, item) => sum + item.value, 0))}.</p>}
      <RecordsTable records={records} emptyLabel={definition.title.toLowerCase()} onOpen={(item) => {
        if (creatable.has(module)) { setDocumentId(item.id); setOpen(true); }
        else setDetail(item);
      }} />
      {open && creatable.has(module) && <DocumentDialog kind={kind} documentId={documentId} open={open} onOpenChange={setOpen} />}
      <Dialog open={!!detail} onOpenChange={(next) => { if (!next) setDetail(undefined); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.id}</DialogTitle>
            <DialogDescription>{detail?.title}</DialogDescription>
          </DialogHeader>
          {detail && module === "audit" && (
            <dl className="grid gap-3 text-sm">
              <div><dt className="text-muted-foreground">When</dt><dd className="font-semibold">{formatDisplayDate(state.audit.find((item) => item.id === detail.id)?.at ?? detail.date)}</dd></div>
              <div><dt className="text-muted-foreground">Actor</dt><dd className="font-semibold">{detail.owner}</dd></div>
              <div><dt className="text-muted-foreground">Action</dt><dd className="font-semibold">{state.audit.find((item) => item.id === detail.id)?.action} · {state.audit.find((item) => item.id === detail.id)?.fromStatus} to {detail.status}</dd></div>
            </dl>
          )}
          {detail && module === "reports" && <p className="text-sm">Committed value for {detail.department} is {formatBDT(detail.value)}. Export the table to take this register offline.</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
