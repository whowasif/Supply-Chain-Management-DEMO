import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/procurement-ui";
import { Button } from "@/components/ui/button";
import { expiringSoon, formatBDT, pendingDeliveries, projectName, purchaseRegister, stockLedger } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — Procuria" },
    { name: "description", content: "Paper registers for purchases, stock, expiry, pending deliveries and assets." },
  ] }),
  component: ReportsPage,
});

type Row = Record<string, string | number>;

function downloadCsv(filename: string, rows: Row[]) {
  const first = rows[0];
  if (!first) return;
  const keys = Object.keys(first);
  const body = [keys.join(","), ...rows.map((row) => keys.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Register({ title, rows }: { title: string; rows: Row[] }) {
  const keys = Object.keys(rows[0] ?? {});
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button type="button" variant="secondary" onClick={() => downloadCsv(`${title.toLowerCase().replaceAll(" ", "-")}.csv`, rows)}>Export CSV</Button>
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Nothing in this register for the current filter.</p> : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted"><tr>{keys.map((key) => <th key={key} className="px-3 py-2 font-semibold">{key}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => <tr key={index} className="border-t border-border">{keys.map((key) => <td key={key} className="px-3 py-2">{row[key]}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ReportsPage() {
  const { state } = useProcurement();
  const [query, setQuery] = useState("");
  const [projectId, setProjectId] = useState("");
  const matches = (row: Row) => Object.values(row).join(" ").toLowerCase().includes(query.trim().toLowerCase());
  const purchases = useMemo(() => purchaseRegister(state).filter((row) => !projectId || row.project === projectName(state, projectId)).map((row) => ({ ...row, value: formatBDT(row.value) })), [state, projectId]);
  const ledger = useMemo(() => stockLedger(state).map((row) => ({ ...row })), [state]);
  const expiry = useMemo(() => expiringSoon(state).map((row) => ({ item: row.item, store: row.storeName, batch: row.batch || "—", expiry: row.expiry, onHand: row.onHand, project: projectName(state, row.projectId) })), [state]);
  const pending = useMemo(() => pendingDeliveries(state).filter((row) => !projectId || row.projectId === projectId).map((row) => ({ id: row.id, title: row.title, supplier: row.supplierName, project: projectName(state, row.projectId), status: row.status, needBy: row.needBy })), [state, projectId]);
  const assets = useMemo(() => state.assets.filter((row) => !projectId || row.projectId === projectId).map((row) => ({ tag: row.tag, description: row.description, location: row.location, custodian: row.custodian, condition: row.condition, value: formatBDT(row.value), project: projectName(state, row.projectId) })), [state, projectId]);
  const spend = useMemo(() => {
    const value = state.purchaseOrders.filter((item) => item.status !== "Draft" && (!projectId || item.projectId === projectId)).reduce((sum, item) => sum + item.lines.reduce((lineSum, line) => lineSum + line.quantity * line.unitPrice, 0), 0);
    return [{ register: "Committed spend", value: formatBDT(value) }];
  }, [state, projectId]);
  return (
    <div className="space-y-8">
      <PageHeader title="Reports" description="The paper registers a storekeeper and a procurement officer already keep, with committed spend as a summary." />
      <div className="grid gap-3 sm:grid-cols-2">
        <input aria-label="Filter registers" className="h-11 rounded-md border border-input px-3 text-sm" placeholder="Filter by supplier, item, store or location" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select aria-label="Filter by project" className="h-11 rounded-md border border-input px-3 text-sm" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          <option value="">All projects</option>
          {state.projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>
      <Register title="Purchase register" rows={purchases.filter(matches)} />
      <Register title="Stock ledger" rows={ledger.filter(matches)} />
      <Register title="Items expiring within 90 days" rows={expiry.filter(matches)} />
      <Register title="Pending deliveries" rows={pending.filter(matches)} />
      <Register title="Assets by location" rows={assets.filter(matches)} />
      <Register title="Committed spend" rows={spend.filter(matches)} />
    </div>
  );
}
