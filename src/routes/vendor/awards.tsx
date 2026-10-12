import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/procurement-ui";
import { SUPPLIER_ACCOUNT, billMilestone, formatBDT, formatDisplayDate, respondToContract } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/awards")({
  head: () => ({ meta: [{ title: "Awards and contracts — Procuria" }, { name: "description", content: "Award results, contract acceptance and milestone bills." }] }),
  component: VendorAwards,
});

function VendorAwards() {
  const { state, commit } = useProcurement();
  const [openId, setOpenId] = useState<string>();
  const results = state.evaluations.filter((item) => item.bidder === SUPPLIER_ACCOUNT && item.status !== "Draft");
  const contracts = state.contracts.filter((item) => item.supplierName === SUPPLIER_ACCOUNT);
  const contract = contracts.find((item) => item.id === openId);
  return (
    <div className="space-y-6">
      <PageHeader title="Awards and contracts" description="Award results for your company, and contracts you can accept or decline. Accepting an active contract lets you bill a milestone." />
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Award results</h2>
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {results.map((item) => <li key={item.id} className="p-4 text-sm"><p className="font-semibold">{item.tenderId} · {item.status}</p><p className="text-muted-foreground">{item.title} · technical {item.technicalScore} · financial {item.financialScore}</p><p className="mt-1">{item.recommendation}</p></li>)}
          {results.length === 0 && <li className="p-4 text-sm text-muted-foreground">No award result yet.</li>}
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Contracts</h2>
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {contracts.map((item) => (
            <li key={item.id}>
              <button type="button" className="w-full p-4 text-left text-sm hover:bg-accent" onClick={() => setOpenId(item.id)}>
                <p className="font-semibold">{item.id} · {item.acceptance}</p>
                <p className="text-muted-foreground">{item.title} · {formatBDT(item.value)} · {item.status}</p>
              </button>
            </li>
          ))}
          {contracts.length === 0 && <li className="p-4 text-sm text-muted-foreground">No contract yet.</li>}
        </ul>
      </section>
      {contract && (
        <section className="space-y-3 rounded-md border border-border bg-card p-4 text-sm">
          <p className="font-semibold">{contract.id} · {contract.title}</p>
          <p>Purchase order {contract.purchaseOrderId || "—"} · {formatDisplayDate(contract.startDate)} to {formatDisplayDate(contract.endDate)} · {formatBDT(contract.value)}</p>
          <p>Performance security: {contract.performanceSecurity || "—"}</p>
          <ul className="space-y-2">{contract.milestones.map((milestone) => (
            <li key={milestone.id} className="flex flex-wrap items-center justify-between gap-2">
              <span>{milestone.title} · {formatDisplayDate(milestone.dueDate)} · {formatBDT(milestone.amount)}</span>
              <Button type="button" variant="secondary" onClick={() => commit(billMilestone(state, contract.id, milestone.id), "Milestone bill started")}>Bill this milestone</Button>
            </li>
          ))}</ul>
          {contract.acceptance === "Pending" && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => commit(respondToContract(state, contract.id, "Declined"), "Contract declined")}>Decline</Button>
              <Button type="button" onClick={() => commit(respondToContract(state, contract.id, "Accepted"), "Contract accepted")}>Accept</Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
