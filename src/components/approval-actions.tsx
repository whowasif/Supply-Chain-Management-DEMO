import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decideRequisition, formatBDT, invoiceAmounts, linesTotal, saveInvoice, type ApprovalItem } from "@/lib/domain";
import { bandForValue, roleLabel } from "@/lib/policy";
import { useProcurement } from "@/lib/store";

export function ApprovalActions({ item, onDone }: { item: ApprovalItem; onDone?: () => void }) {
  const { state, commit } = useProcurement();
  const [comment, setComment] = useState("");
  const [returning, setReturning] = useState(false);

  const finish = (ok: boolean) => {
    if (ok) onDone?.();
  };

  const approve = () => {
    if (item.kind === "requisition") finish(commit(decideRequisition(state, item.record.id, "Approved"), "Requisition approved"));
    else finish(commit(saveInvoice(state, item.record, "pay"), "Invoice marked paid"));
  };

  const reject = () => {
    if (item.kind === "requisition") finish(commit(decideRequisition(state, item.record.id, "Rejected"), "Requisition rejected"));
    else finish(commit(saveInvoice(state, item.record, "reject"), "Invoice rejected"));
  };

  const sendBack = () => {
    if (!comment.trim()) return;
    if (item.kind === "requisition") finish(commit(decideRequisition(state, item.record.id, "Returned", comment), "Requisition returned"));
    else finish(commit(saveInvoice(state, item.record, "return", comment), "Invoice returned"));
  };

  const value = item.kind === "requisition" ? linesTotal(item.record.lines) : invoiceAmounts(item.record.lines).net;
  const band = item.kind === "requisition" ? bandForValue(value) : undefined;
  const waitingRole = item.kind === "requisition" ? item.record.awaitingRole : undefined;
  const canDecide = item.kind === "invoice" || state.persona === waitingRole;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{item.kind === "invoice" ? `Net payable ${formatBDT(value)}. Approving this invoice records it as paid.` : `${band?.label} · ${item.record.method} · ${waitingRole ? roleLabel(waitingRole) : "Approver"} · ${formatBDT(value)}`}</p>
      {!canDecide && <p className="text-sm">Switch to the {waitingRole ? roleLabel(waitingRole) : "assigned approver"} to decide this requisition.</p>}
      {returning ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold" htmlFor={`return-${item.record.id}`}>Comment <span className="text-destructive">*</span>
            <Textarea id={`return-${item.record.id}`} value={comment} onChange={(event) => setComment(event.target.value)} className="mt-1.5" placeholder="Explain what must be changed" />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setReturning(false)}>Cancel</Button>
            <Button type="button" onClick={sendBack} disabled={!comment.trim()}>Return</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={approve} disabled={!canDecide}>{item.kind === "invoice" ? "Approve and pay" : "Approve"}</Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setReturning(true)} disabled={!canDecide}>Return</Button>
          <Button type="button" size="sm" variant="secondary" onClick={reject} disabled={!canDecide}>Reject</Button>
        </div>
      )}
    </div>
  );
}
