import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentDialog } from "@/components/forms/document-dialog";
import { Field, controlClass } from "@/components/forms/form-fields";
import { PageHeader, RecordsTable } from "@/components/procurement-ui";
import { askClarification, formatBDT, formatDisplayDate, linesTotal, recordsFor } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/tenders")({
  head: () => ({ meta: [{ title: "Supplier Tenders — Procuria" }, { name: "description", content: "Open tenders your company can bid for." }] }),
  component: VendorTenders,
});

function VendorTenders() {
  const { state, focus, setFocus, commit } = useProcurement();
  const [tenderId, setTenderId] = useState<string>();
  const [bidding, setBidding] = useState(false);
  const [question, setQuestion] = useState("");
  const records = recordsFor(state, "vendor-tenders");
  const tender = state.tenders.find((item) => item.id === tenderId);
  useEffect(() => {
    if (focus?.module === "vendor-tenders" || focus?.module === "tenders") {
      setTenderId(focus.id);
      setFocus(null);
    }
  }, [focus, setFocus]);
  return (
    <div className="space-y-6">
      <PageHeader title="Available tenders" description="Read the papers, fees and clarifications, then submit a priced bid. A submitted bid can be replaced or withdrawn before the closing date." />
      <RecordsTable records={records} emptyLabel="tenders" onOpen={(item) => { setTenderId(item.id); setQuestion(""); }} />
      {tender && !bidding && <Dialog open onOpenChange={(open) => { if (!open) setTenderId(undefined); }}>
        <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{tender.id}</DialogTitle>
            <DialogDescription>{tender.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Closes {formatDisplayDate(tender.closingDate)} · {tender.method} · estimated {formatBDT(linesTotal(tender.lines))}</p>
            <p>Document fee {formatBDT(tender.documentFee)} · tender security {formatBDT(tender.tenderSecurity)}. These are recorded amounts, not a bank payment.</p>
            <p>{tender.eligibility}</p>
            <ul className="space-y-2">{tender.lines.map((line) => <li key={line.id}>{line.description} · {line.quantity} {line.unit} · {line.specification}</li>)}</ul>
            <div>
              <p className="font-semibold">Papers</p>
              <ul className="mt-2 space-y-2">{tender.papers.map((item) => <li key={item.id}><strong>{item.kind}:</strong> {item.title}<p className="whitespace-pre-wrap text-muted-foreground">{item.body}</p></li>)}</ul>
              {tender.papers.length === 0 && <p className="text-muted-foreground">No papers posted yet.</p>}
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Clarifications</p>
              {tender.clarifications.map((item) => (
                <div key={item.id} className="rounded-md border border-border p-3">
                  <p>{item.question}</p>
                  <p className="mt-1 text-muted-foreground">{item.answer ? `Answer: ${item.answer}` : "Waiting for an answer."}</p>
                </div>
              ))}
              {tender.clarifications.length === 0 && <p className="text-muted-foreground">No questions yet.</p>}
              <Field label="Ask a question"><textarea className={`${controlClass} h-20 py-2`} value={question} onChange={(event) => setQuestion(event.target.value)} /></Field>
              <Button type="button" variant="secondary" onClick={() => { if (commit(askClarification(state, tender.id, question), "Question sent")) setQuestion(""); }}>Send question</Button>
            </div>
            <div className="flex justify-end"><Button onClick={() => setBidding(true)}>Submit bid</Button></div>
          </div>
        </DialogContent>
      </Dialog>}
      {bidding && tenderId && <DocumentDialog kind="bid" tenderId={tenderId} open={bidding} onOpenChange={(open) => { setBidding(open); if (!open) setTenderId(undefined); }} />}
    </div>
  );
}
