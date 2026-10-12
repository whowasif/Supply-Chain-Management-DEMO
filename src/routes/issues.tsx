import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/procurement-ui";
import { Button } from "@/components/ui/button";
import { Field, controlClass } from "@/components/forms/form-fields";
import { fefoBatch, formatDisplayDate, postStoreIssue, projectName, stockPositions, storeName } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/issues")({
  head: () => ({ meta: [
    { title: "Store issues — Procuria" },
    { name: "description", content: "Issue a medicine or consumable batch to a ward or office." },
  ] }),
  component: IssuesPage,
});

function IssuesPage() {
  const { state, commit } = useProcurement();
  const [storeId, setStoreId] = useState(state.stores[1]?.id ?? state.stores[0]?.id ?? "");
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? "");
  const [destination, setDestination] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [batch, setBatch] = useState("");
  const positions = stockPositions(state).filter((row) => row.storeId === storeId && row.projectId === projectId && row.onHand > 0);
  const suggestion = item ? fefoBatch(state, storeId, item, projectId) : undefined;
  return (
    <div className="space-y-6">
      <PageHeader title="Store issues" description="Issue stock to a ward or office. Leave the batch blank to use the earliest expiry that still has stock. Expired stock cannot be issued." />
      <form className="space-y-4 rounded-md border border-border bg-card p-5" onSubmit={(event) => {
        event.preventDefault();
        commit(postStoreIssue(state, { storeId, destination, requestedBy, receivedBy, projectId, lines: [{ item, quantity, unit: "Each", batch, expiry: "" }] }), "Store issue posted");
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From store" required><select className={controlClass} value={storeId} onChange={(event) => setStoreId(event.target.value)}>{state.stores.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field>
          <Field label="Project" required><select className={controlClass} value={projectId} onChange={(event) => setProjectId(event.target.value)}>{state.projects.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field>
          <Field label="To ward or office" required><input className={controlClass} value={destination} onChange={(event) => setDestination(event.target.value)} /></Field>
          <Field label="Requested by" required><input className={controlClass} value={requestedBy} onChange={(event) => setRequestedBy(event.target.value)} /></Field>
          <Field label="Received by" required><input className={controlClass} value={receivedBy} onChange={(event) => setReceivedBy(event.target.value)} /></Field>
          <Field label="Item" required><input className={controlClass} list="issue-items" value={item} onChange={(event) => setItem(event.target.value)} /></Field>
          <Field label="Quantity" required><input type="number" min="1" className={controlClass} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></Field>
          <Field label="Batch (blank uses earliest expiry)"><input className={controlClass} value={batch} onChange={(event) => setBatch(event.target.value)} /></Field>
        </div>
        <datalist id="issue-items">{[...new Set(positions.map((row) => row.item))].map((name) => <option key={name} value={name} />)}</datalist>
        {suggestion && <p className="text-sm text-muted-foreground">Earliest usable batch: {suggestion.batch || "—"} · expiry {suggestion.expiry ? formatDisplayDate(suggestion.expiry) : "—"}.</p>}
        <div className="flex justify-end"><Button type="submit">Post issue</Button></div>
      </form>
      <ul className="space-y-2">
        {state.issues.map((issue) => (
          <li key={issue.id} className="rounded-md border border-border bg-card p-4 text-sm">
            <p className="font-semibold">{issue.id} · {storeName(state, issue.storeId)} → {issue.destination}</p>
            <p className="text-muted-foreground">{projectName(state, issue.projectId)} · requested by {issue.requestedBy} · received by {issue.receivedBy}</p>
            <p>{issue.lines.map((line) => `${line.quantity} ${line.unit} ${line.item} · ${line.batch || "no batch"}`).join("; ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
