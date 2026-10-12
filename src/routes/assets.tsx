import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/procurement-ui";
import { Button } from "@/components/ui/button";
import { Field, controlClass } from "@/components/forms/form-fields";
import { formatBDT, projectName, updateAsset, type AssetCondition } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/assets")({
  head: () => ({ meta: [
    { title: "Assets — Procuria" },
    { name: "description", content: "Fixed assets created when equipment or a vehicle is received." },
  ] }),
  component: AssetsPage,
});

function AssetsPage() {
  const { state, commit } = useProcurement();
  const [selected, setSelected] = useState(state.assets[0]?.id ?? "");
  const asset = state.assets.find((item) => item.id === selected);
  const [custodian, setCustodian] = useState(asset?.custodian ?? "");
  const [location, setLocation] = useState(asset?.location ?? "");
  const [condition, setCondition] = useState<AssetCondition>(asset?.condition ?? "Good");
  return (
    <div className="space-y-6">
      <PageHeader title="Assets" description="Equipment and vehicles received against a purchase order. Consumable stock stays on the inventory page." />
      <ul className="grid gap-3 lg:grid-cols-2">
        {state.assets.map((item) => (
          <li key={item.id}>
            <button type="button" className="w-full rounded-md border border-border bg-card p-4 text-left" onClick={() => { setSelected(item.id); setCustodian(item.custodian); setLocation(item.location); setCondition(item.condition); }}>
              <p className="text-sm font-semibold">{item.tag} · {item.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.location} · {item.custodian} · {item.condition}</p>
              <p className="mt-2 text-sm">{formatBDT(item.value)} · {projectName(state, item.projectId)}</p>
            </button>
          </li>
        ))}
      </ul>
      {asset && (
        <form className="grid gap-4 rounded-md border border-border bg-card p-5 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); commit(updateAsset(state, asset.id, { condition, custodian, location }), "Asset updated"); }}>
          <Field label="Custodian" required><input className={controlClass} value={custodian} onChange={(event) => setCustodian(event.target.value)} /></Field>
          <Field label="Location" required><input className={controlClass} value={location} onChange={(event) => setLocation(event.target.value)} /></Field>
          <Field label="Condition" required><select className={controlClass} value={condition} onChange={(event) => setCondition(event.target.value as AssetCondition)}><option>Good</option><option>Needs repair</option><option>Unserviceable</option></select></Field>
          <div className="flex items-end"><Button type="submit">Save asset</Button></div>
        </form>
      )}
    </div>
  );
}
