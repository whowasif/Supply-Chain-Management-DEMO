import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApprovalActions } from "@/components/approval-actions";
import { BidEditor, ContractEditor, DeliveryEditor, InvoiceEditor, MovementEditor, PurchaseOrderEditor, ReceiptEditor, SupplierEditor } from "@/components/forms/commercial-editors";
import { EvaluationEditor, PlanEditor, RequisitionEditor, SurveyEditor, TenderEditor } from "@/components/forms/sourcing-editors";
import { answerClarification, bidResult, createPoFromAward, formatBDT, formatDisplayDate, invoiceAmounts, linesTotal, projectName, replaceBid, saveInvoice, saveOpeningMinute, saveTenderPaper, todayIso, withdrawBid, type PaperKind } from "@/lib/domain";
import { bandForValue, roleLabel } from "@/lib/policy";
import { PurchaseOrderBangla, ReceiptBangla, RequisitionBangla, printSheet } from "@/components/forms/bangla-print";
import { moduleDefinitions } from "@/lib/procurement";
import { useProcurement } from "@/lib/store";

export type DocumentKind = "requisitions" | "plans" | "surveys" | "tenders" | "evaluations" | "suppliers" | "purchase-orders" | "contracts" | "receiving" | "inventory" | "payments" | "bid" | "delivery";

function Facts({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm font-semibold">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function LineTable({ lines }: { lines: { id: string; description: string; quantity: number; unit: string; unitPrice: number; specification: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-muted-foreground"><tr><th className="py-2 pr-3">Description</th><th className="py-2 pr-3">Qty</th><th className="py-2 pr-3">Unit price</th><th className="py-2">Amount</th></tr></thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id} className="border-t border-border">
              <td className="py-2 pr-3">{line.description}<p className="text-xs text-muted-foreground">{line.specification}</p></td>
              <td className="py-2 pr-3">{line.quantity} {line.unit}</td>
              <td className="py-2 pr-3">{formatBDT(line.unitPrice)}</td>
              <td className="py-2 font-semibold">{formatBDT(line.quantity * line.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentView({ kind, id, onEdit, onClose }: { kind: DocumentKind; id: string; onEdit: () => void; onClose: () => void }) {
  const { state, commit } = useProcurement();
  const [bangla, setBangla] = useState(false);
  const [minute, setMinute] = useState({ date: todayIso(), chair: "", members: "", note: "" });
  const [paper, setPaper] = useState<{ kind: PaperKind; title: string; body: string }>({ kind: "Tender document", title: "", body: "" });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const requisition = state.requisitions.find((item) => item.id === id);
  const plan = state.plans.find((item) => item.id === id);
  const survey = state.surveys.find((item) => item.id === id);
  const tender = state.tenders.find((item) => item.id === id);
  const evaluation = state.evaluations.find((item) => item.id === id);
  const supplier = state.suppliers.find((item) => item.id === id);
  const purchaseOrder = state.purchaseOrders.find((item) => item.id === id);
  const contract = state.contracts.find((item) => item.id === id);
  const receipt = state.receipts.find((item) => item.id === id);
  const movement = state.movements.find((item) => item.id === id);
  const invoice = state.invoices.find((item) => item.id === id);
  const bid = state.bids.find((item) => item.id === id);
  const editable =
    (kind === "requisitions" && !!requisition && (requisition.status === "Draft" || requisition.status === "Returned")) ||
    (kind === "plans" && !!plan) ||
    (kind === "surveys" && survey?.status === "Draft") ||
    (kind === "tenders" && tender?.status === "Draft") ||
    (kind === "evaluations" && evaluation?.status === "Draft") ||
    kind === "suppliers" ||
    (kind === "purchase-orders" && purchaseOrder?.status === "Draft") ||
    (kind === "contracts" && contract?.status === "Draft") ||
    (kind === "payments" && invoice?.status === "Draft") ||
    (kind === "bid" && bid?.status === "Draft");

  return (
    <div className="space-y-4">
      {kind === "requisitions" && requisition && (
        <>
          <Facts rows={[["Programme", requisition.programme], ["Department", requisition.department], ["Requester", requisition.requester], ["Need by", formatDisplayDate(requisition.needBy)], ["Project", projectName(state, requisition.projectId)], ["Method", requisition.method], ["Approver", requisition.awaitingRole ? roleLabel(requisition.awaitingRole) : "—"], ["Band", bandForValue(linesTotal(requisition.lines)).label], ["Status", requisition.status], ["Value", formatBDT(linesTotal(requisition.lines))]]} />
          <p className="text-sm">{requisition.justification}</p>
          {requisition.methodJustification && <p className="text-sm">Less competitive method: {requisition.methodJustification}</p>}
          {requisition.returnComment && <p className="rounded-md bg-warning-soft px-3 py-2 text-sm">Returned: {requisition.returnComment}</p>}
          <LineTable lines={requisition.lines} />
          <Button type="button" variant="secondary" onClick={() => setBangla(true)}>Print in Bangla</Button>
          {requisition.status === "Submitted" && <ApprovalActions item={{ kind: "requisition", record: requisition }} onDone={onClose} />}
          {bangla && (
            <div className="space-y-3 rounded-md border border-border p-3">
              <RequisitionBangla state={state} requisition={requisition} />
              <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setBangla(false)}>Close preview</Button><Button type="button" onClick={printSheet}>Print</Button></div>
            </div>
          )}
        </>
      )}
      {kind === "plans" && plan && (
        <>
          <Facts rows={[["Fiscal year", plan.fiscalYear], ["Programme", plan.programme], ["Owner", plan.owner], ["Ceiling", formatBDT(plan.budgetCeiling)], ["Status", plan.status]]} />
          <ul className="space-y-2 text-sm">{plan.lines.map((line) => <li key={line.id}>{line.quarter} · {line.description} · {formatBDT(line.estimatedValue)} · {line.method}</li>)}</ul>
        </>
      )}
      {kind === "surveys" && survey && (
        <>
          <Facts rows={[["Requisition", survey.requisitionId], ["Owner", survey.owner], ["Status", survey.status]]} />
          <p className="text-sm">{survey.recommendation}</p>
          <ul className="space-y-1 text-sm">{survey.quotes.map((quote) => <li key={quote.id}>{quote.supplierName} · {formatBDT(quote.unitPrice)} · {quote.leadTimeDays} days · valid {formatDisplayDate(quote.validUntil)}</li>)}</ul>
        </>
      )}
      {kind === "tenders" && tender && (
        <>
          <Facts rows={[["Method", tender.method], ["Project", projectName(state, tender.projectId)], ["Closes", formatDisplayDate(tender.closingDate)], ["Document fee", formatBDT(tender.documentFee)], ["Tender security", formatBDT(tender.tenderSecurity)], ["Status", tender.status], ["Value", formatBDT(linesTotal(tender.lines))]]} />
          <p className="text-sm">{tender.eligibility}</p>
          <LineTable lines={tender.lines} />
          <div className="space-y-2 rounded-md border border-border p-3 text-sm">
            <p className="font-semibold">Opening minute</p>
            {tender.openingMinute ? <p>{formatDisplayDate(tender.openingMinute.date)} · {tender.openingMinute.chair} · {tender.openingMinute.members}<br />{tender.openingMinute.note}</p> : <p className="text-muted-foreground">No opening minute yet.</p>}
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="h-11 rounded-md border border-input px-3" type="date" value={minute.date} onChange={(event) => setMinute({ ...minute, date: event.target.value })} />
              <input className="h-11 rounded-md border border-input px-3" placeholder="Chair" value={minute.chair} onChange={(event) => setMinute({ ...minute, chair: event.target.value })} />
              <input className="h-11 rounded-md border border-input px-3 sm:col-span-2" placeholder="Members" value={minute.members} onChange={(event) => setMinute({ ...minute, members: event.target.value })} />
              <textarea className="rounded-md border border-input px-3 py-2 sm:col-span-2" placeholder="Minute" value={minute.note} onChange={(event) => setMinute({ ...minute, note: event.target.value })} />
            </div>
            <Button type="button" variant="secondary" onClick={() => commit(saveOpeningMinute(state, tender.id, minute), "Opening minute saved")}>Save opening minute</Button>
          </div>
          <div className="space-y-2 rounded-md border border-border p-3 text-sm">
            <p className="font-semibold">Papers</p>
            <ul className="space-y-2">{tender.papers.map((item) => <li key={item.id}><strong>{item.kind}:</strong> {item.title}<p className="whitespace-pre-wrap text-muted-foreground">{item.body}</p></li>)}</ul>
            <div className="grid gap-2">
              <select className="h-11 rounded-md border border-input px-3" value={paper.kind} onChange={(event) => setPaper({ ...paper, kind: event.target.value as PaperKind })}><option>Tender document</option><option>Corrigendum</option><option>Opening minute</option><option>Challan</option><option>Evaluation minute</option></select>
              <input className="h-11 rounded-md border border-input px-3" placeholder="Title" value={paper.title} onChange={(event) => setPaper({ ...paper, title: event.target.value })} />
              <textarea className="rounded-md border border-input px-3 py-2" placeholder="Paper text" value={paper.body} onChange={(event) => setPaper({ ...paper, body: event.target.value })} />
            </div>
            <Button type="button" variant="secondary" onClick={() => { if (commit(saveTenderPaper(state, tender.id, { ...paper, date: todayIso() }), "Paper saved")) setPaper({ kind: paper.kind, title: "", body: "" }); }}>Save paper</Button>
          </div>
          <div className="space-y-2 rounded-md border border-border p-3 text-sm">
            <p className="font-semibold">Clarifications</p>
            {tender.clarifications.length === 0 && <p className="text-muted-foreground">No questions yet.</p>}
            {tender.clarifications.map((item) => (
              <div key={item.id} className="space-y-2 border-t border-border pt-2">
                <p>{item.question}</p>
                {item.answer ? <p className="text-muted-foreground">Answered {formatDisplayDate(item.answeredAt)}: {item.answer}</p> : (
                  <>
                    <textarea className="w-full rounded-md border border-input px-3 py-2" placeholder="Answer" value={answers[item.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))} />
                    <Button type="button" variant="secondary" onClick={() => commit(answerClarification(state, tender.id, item.id, answers[item.id] ?? ""), "Clarification answered")}>Post answer</Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {kind === "evaluations" && evaluation && (
        <>
          <Facts rows={[["Tender", evaluation.tenderId], ["Bidder", evaluation.bidder], ["Technical", String(evaluation.technicalScore)], ["Financial", String(evaluation.financialScore)], ["Status", evaluation.status]]} />
          <p className="text-sm">{evaluation.recommendation}</p>
          <p className="text-sm text-muted-foreground">{evaluation.committeeNote}</p>
          {evaluation.status === "Awarded" && <Button type="button" onClick={() => { if (commit(createPoFromAward(state, evaluation.id), "Draft purchase order created from the award")) onClose(); }}>Create purchase order</Button>}
        </>
      )}
      {kind === "suppliers" && supplier && (
        <>
          <Facts rows={[["Trade licence", supplier.tradeLicence], ["Licence expiry", formatDisplayDate(supplier.licenceExpiry)], ["TIN", supplier.tin], ["BIN", supplier.bin], ["Bank", supplier.bankName], ["Account", supplier.accountNumber], ["Routing", supplier.routingNumber], ["Categories", supplier.categories], ["District", supplier.district], ["Contact", supplier.contact], ["Status", supplier.status]]} />
          {supplier.returnComment && <p className="rounded-md bg-warning-soft px-3 py-2 text-sm">Returned: {supplier.returnComment}</p>}
        </>
      )}
      {kind === "purchase-orders" && purchaseOrder && (
        <>
          <Facts rows={[["Supplier", purchaseOrder.supplierName], ["Project", projectName(state, purchaseOrder.projectId)], ["Deliver to", purchaseOrder.deliveryLocation], ["Need by", formatDisplayDate(purchaseOrder.needBy)], ["Status", purchaseOrder.status], ["Value", formatBDT(linesTotal(purchaseOrder.lines))]]} />
          <LineTable lines={purchaseOrder.lines} />
          <Button type="button" variant="secondary" onClick={() => setBangla(true)}>Print in Bangla</Button>
          {bangla && <div className="space-y-3 rounded-md border border-border p-3"><PurchaseOrderBangla state={state} order={purchaseOrder} /><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setBangla(false)}>Close preview</Button><Button type="button" onClick={printSheet}>Print</Button></div></div>}
        </>
      )}
      {kind === "contracts" && contract && (
        <>
          <Facts rows={[["Supplier", contract.supplierName], ["Purchase order", contract.purchaseOrderId || "—"], ["Start", formatDisplayDate(contract.startDate)], ["End", formatDisplayDate(contract.endDate)], ["Value", formatBDT(contract.value)], ["Status", contract.status], ["Acceptance", contract.acceptance], ["Performance security", contract.performanceSecurity || "—"]]} />
          <ul className="space-y-1 text-sm">{contract.milestones.map((milestone) => <li key={milestone.id}>{milestone.title} · {formatDisplayDate(milestone.dueDate)} · {formatBDT(milestone.amount)}</li>)}</ul>
        </>
      )}
      {kind === "receiving" && receipt && (
        <>
          <Facts rows={[["Purchase order", receipt.purchaseOrderId], ["Store", receipt.warehouse], ["Project", projectName(state, receipt.projectId)], ["Quality", receipt.quality], ["Posted by", receipt.owner]]} />
          <p className="text-sm">Challan: {receipt.challan || "—"}</p>
          <ul className="space-y-1 text-sm">{receipt.lines.map((line, index) => <li key={`${line.lineId}-${index}`}>{line.description}: received {line.receivedNow} of {line.ordered} · batch {line.batch || "—"} · expiry {line.expiry ? formatDisplayDate(line.expiry) : "—"}</li>)}</ul>
          <Button type="button" variant="secondary" onClick={() => setBangla(true)}>Print in Bangla</Button>
          {bangla && <div className="space-y-3 rounded-md border border-border p-3"><ReceiptBangla state={state} receipt={receipt} /><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setBangla(false)}>Close preview</Button><Button type="button" onClick={printSheet}>Print</Button></div></div>}
        </>
      )}
      {kind === "inventory" && movement && <Facts rows={[["Item", movement.item], ["Warehouse", movement.warehouse], ["Type", movement.movementType], ["Quantity", String(movement.quantity)], ["Note", movement.note]]} />}
      {kind === "payments" && invoice && (
        <>
          <Facts rows={[["Invoice no.", invoice.invoiceNumber], ["Supplier", invoice.supplierName], ["Project", projectName(state, invoice.projectId)], ["Purchase order", invoice.purchaseOrderId], ["Receipt", invoice.receiptId || "—"], ["Mushak 6.3", invoice.mushakNumber || "—"], ["Mushak date", formatDisplayDate(invoice.mushakDate)], ["Subtotal", formatBDT(invoiceAmounts(invoice.lines).subtotal)], ["VAT", formatBDT(invoiceAmounts(invoice.lines).vat)], ["TDS", formatBDT(invoiceAmounts(invoice.lines).tds)], ["Net payable", formatBDT(invoiceAmounts(invoice.lines).net)], ["Status", invoice.status]]} />
          <LineTable lines={invoice.lines} />
          {invoice.status === "Submitted" && state.persona !== "supplier" && <ApprovalActions item={{ kind: "invoice", record: invoice }} onDone={onClose} />}
        </>
      )}
      {kind === "bid" && bid && (
        <>
          <Facts rows={[["Tender", bid.tenderId], ["Valid until", formatDisplayDate(bid.validityDate)], ["Submitted", bid.submittedAt ? formatDisplayDate(bid.submittedAt) : "—"], ["Receipt", bid.submittedAt ? bid.id : "—"], ["Security reference", bid.securityNote || "—"], ["Status", bid.status], ["Result", bidResult(state, bid) ?? "Pending"], ["Value", formatBDT(linesTotal(bid.lines))]]} />
          <p className="text-sm">{bid.technicalNote}</p>
          <LineTable lines={bid.lines} />
          {bid.status === "Submitted" && state.persona === "supplier" && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => { if (commit(withdrawBid(state, bid.id), "Bid withdrawn")) onClose(); }}>Withdraw</Button>
              <Button type="button" onClick={() => { if (commit(replaceBid(state, bid.id), "Bid opened for replacement")) onEdit(); }}>Replace</Button>
            </div>
          )}
        </>
      )}
      <div className="flex justify-end gap-2">
        {editable && <Button type="button" variant="secondary" onClick={onEdit}>Edit</Button>}
        {kind === "payments" && invoice?.status === "Submitted" && state.persona !== "supplier" && <Button type="button" onClick={() => { if (commit(saveInvoice(state, invoice, "pay"), "Invoice marked paid")) onClose(); }}>Mark paid</Button>}
        <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

export function DocumentDialog({ kind, documentId, open, onOpenChange, tenderId, purchaseOrderId }: { kind: DocumentKind; documentId?: string | undefined; open: boolean; onOpenChange: (open: boolean) => void; tenderId?: string | undefined; purchaseOrderId?: string | undefined }) {
  const { state } = useProcurement();
  const [editing, setEditing] = useState(!documentId);
  useEffect(() => { setEditing(!documentId); }, [documentId, open, kind]);
  const close = () => onOpenChange(false);
  const definition = kind in moduleDefinitions ? moduleDefinitions[kind as keyof typeof moduleDefinitions] : undefined;
  const title = kind === "bid" ? "Supplier bid" : kind === "delivery" ? "Confirm delivery" : definition?.title ?? "Document";
  const showForm = !documentId || editing || kind === "delivery";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{documentId ?? `New ${title.toLowerCase()}`}</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        {showForm ? (
          <div key={`${kind}-${documentId ?? "new"}-${tenderId ?? ""}-${purchaseOrderId ?? ""}`}>
            {kind === "requisitions" && <RequisitionEditor existing={state.requisitions.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "plans" && <PlanEditor existing={state.plans.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "surveys" && <SurveyEditor existing={state.surveys.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "tenders" && <TenderEditor existing={state.tenders.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "evaluations" && <EvaluationEditor existing={state.evaluations.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "suppliers" && <SupplierEditor existing={state.suppliers.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "purchase-orders" && <PurchaseOrderEditor existing={state.purchaseOrders.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "contracts" && <ContractEditor existing={state.contracts.find((item) => item.id === documentId)} onDone={close} />}
            {kind === "receiving" && <ReceiptEditor onDone={close} />}
            {kind === "inventory" && <MovementEditor onDone={close} />}
            {kind === "payments" && <InvoiceEditor existing={state.invoices.find((item) => item.id === documentId)} purchaseOrderId={purchaseOrderId} onDone={close} />}
            {kind === "bid" && <BidEditor existing={state.bids.find((item) => item.id === documentId)} tenderId={tenderId} onDone={close} />}
            {kind === "delivery" && <DeliveryEditor purchaseOrderId={purchaseOrderId ?? documentId} onDone={close} />}
          </div>
        ) : documentId ? <DocumentView kind={kind} id={documentId} onEdit={() => setEditing(true)} onClose={close} /> : null}
      </DialogContent>
    </Dialog>
  );
}
