import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Field, LineItemsEditor, RowsEditor, controlClass } from "@/components/forms/form-fields";
import { DEPARTMENTS, SUPPLIER_ACCOUNT, blankLine, confirmDelivery, formatBDT, invoiceAmounts, postGoodsReceipt, postMovement, quantityReceived, saveBid, saveContract, saveInvoice, savePurchaseOrder, saveSupplier, threeWayMatch, todayIso, type Bid, type Contract, type GoodsReceipt, type Invoice, type PurchaseOrder, type Supplier } from "@/lib/domain";
import { DEMO_POLICY_NOTE, TDS_RATE, VAT_RATE } from "@/lib/policy";
import { bidSchema, contractSchema, invoiceSchema, movementSchema, purchaseOrderSchema, supplierSchema, type BidFormValues, type ContractFormValues, type InvoiceFormValues, type MovementFormValues, type PurchaseOrderFormValues, type SupplierFormValues } from "@/lib/schemas";
import { useProcurement } from "@/lib/store";

export function SupplierEditor({ existing, onDone }: { existing?: Supplier | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const status = useRef<Supplier["status"]>(existing?.status ?? "Invited");
  const [returnComment, setReturnComment] = useState(existing?.returnComment ?? "");
  const form = useForm<SupplierFormValues>({ resolver: zodResolver(supplierSchema), defaultValues: existing ?? { legalName: "", tradeLicence: "", tin: "", bin: "", licenceExpiry: "", bankName: "", accountNumber: "", routingNumber: "", categories: "", district: "Dhaka", contact: "" } });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id, returnComment } : { ...values, returnComment };
        if (commit(saveSupplier(state, payload, status.current), `Supplier saved as ${status.current}`)) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Legal name" required error={form.formState.errors.legalName?.message}><input className={controlClass} {...form.register("legalName")} /></Field>
          <Field label="Trade licence" required error={form.formState.errors.tradeLicence?.message}><input className={controlClass} {...form.register("tradeLicence")} /></Field>
          <Field label="Licence expiry" required error={form.formState.errors.licenceExpiry?.message}><input type="date" className={controlClass} {...form.register("licenceExpiry")} /></Field>
          <Field label="TIN" required error={form.formState.errors.tin?.message}><input className={controlClass} {...form.register("tin")} /></Field>
          <Field label="BIN (13 digits)" required error={form.formState.errors.bin?.message}><input className={controlClass} {...form.register("bin")} /></Field>
          <Field label="Bank" required error={form.formState.errors.bankName?.message}><input className={controlClass} {...form.register("bankName")} /></Field>
          <Field label="Account number" required error={form.formState.errors.accountNumber?.message}><input className={controlClass} {...form.register("accountNumber")} /></Field>
          <Field label="Routing number" required error={form.formState.errors.routingNumber?.message}><input className={controlClass} {...form.register("routingNumber")} /></Field>
          <Field label="District" required><input className={controlClass} {...form.register("district")} /></Field>
          <Field label="Categories" required><input className={controlClass} {...form.register("categories")} /></Field>
          <Field label="Contact" required><input className={controlClass} {...form.register("contact")} /></Field>
        </div>
        <Field label="Return comment"><textarea className={`${controlClass} h-20 py-2`} value={returnComment} onChange={(event) => setReturnComment(event.target.value)} placeholder="Required when returning the company file" /></Field>
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { status.current = "Invited"; }}>Invite</Button>
          <Button type="submit" variant="secondary" onClick={() => { status.current = "Returned"; }}>Return for correction</Button>
          <Button type="submit" onClick={() => { status.current = "Verified"; }}>Mark verified</Button>
        </div>
      </form>
    </Form>
  );
}

export function PurchaseOrderEditor({ existing, onDone }: { existing?: PurchaseOrder | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "issue">("draft");
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: existing ?? { title: "", sourceId: "", supplierId: "", supplierName: "", department: "Health Programme", projectId: state.projects[0]?.id ?? "", deliveryLocation: state.stores[0]?.name ?? "", needBy: "", lines: [blankLine()] },
  });
  const applySource = (id: string) => {
    form.setValue("sourceId", id);
    const tender = state.tenders.find((item) => item.id === id);
    const requisition = state.requisitions.find((item) => item.id === id);
    if (tender) {
      form.setValue("title", tender.title);
      form.setValue("department", tender.department);
      form.setValue("projectId", tender.projectId);
      form.setValue("lines", tender.lines.map((line) => ({ ...line, id: crypto.randomUUID() })));
      const award = state.evaluations.find((item) => item.tenderId === tender.id && item.status === "Awarded");
      if (award) {
        const supplier = state.suppliers.find((item) => item.legalName === award.bidder);
        form.setValue("supplierName", award.bidder);
        form.setValue("supplierId", supplier?.id ?? "");
      }
    } else if (requisition) {
      form.setValue("title", requisition.title);
      form.setValue("department", requisition.department);
      form.setValue("projectId", requisition.projectId);
      form.setValue("lines", requisition.lines.map((line) => ({ ...line, id: crypto.randomUUID() })));
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(savePurchaseOrder(state, payload, intent.current), intent.current === "issue" ? "Purchase order issued" : "Purchase order saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Awarded tender or approved requisition"><select className={controlClass} value={form.watch("sourceId")} onChange={(event) => applySource(event.target.value)}><option value="">None</option>{state.tenders.filter((item) => item.status === "Awarded").map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}{state.requisitions.filter((item) => item.status === "Approved").map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Title" required><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Supplier" required error={form.formState.errors.supplierName?.message}><select className={controlClass} value={form.watch("supplierName")} onChange={(event) => { const supplier = state.suppliers.find((item) => item.legalName === event.target.value); form.setValue("supplierName", event.target.value); form.setValue("supplierId", supplier?.id ?? ""); }}><option value="">Select</option>{state.suppliers.map((item) => <option key={item.id}>{item.legalName}</option>)}</select></Field>
          <Field label="Department"><select className={controlClass} {...form.register("department")}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Project" required><select className={controlClass} {...form.register("projectId")}>{state.projects.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.budgetHead}</option>)}</select></Field>
          <Field label="Delivery location" required><input className={controlClass} {...form.register("deliveryLocation")} /></Field>
          <Field label="Need-by date" required><input type="date" className={controlClass} {...form.register("needBy")} /></Field>
        </div>
        <LineItemsEditor />
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "issue"; }}>Issue PO</Button>
        </div>
      </form>
    </Form>
  );
}

export function ContractEditor({ existing, onDone }: { existing?: Contract | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "activate">("draft");
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: existing ?? { title: "", supplierId: "", supplierName: "", purchaseOrderId: "", department: "Health Programme", startDate: todayIso(), endDate: "", value: 0, performanceSecurity: "", milestones: [{ id: crypto.randomUUID(), title: "", dueDate: "", amount: 0 }] },
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(saveContract(state, payload, intent.current), intent.current === "activate" ? "Contract activated" : "Contract saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Supplier" required><select className={controlClass} value={form.watch("supplierName")} onChange={(event) => { const supplier = state.suppliers.find((item) => item.legalName === event.target.value); form.setValue("supplierName", event.target.value); form.setValue("supplierId", supplier?.id ?? ""); }}><option value="">Select</option>{state.suppliers.map((item) => <option key={item.id}>{item.legalName}</option>)}</select></Field>
          <Field label="Purchase order"><select className={controlClass} {...form.register("purchaseOrderId")}><option value="">None</option>{state.purchaseOrders.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Department"><select className={controlClass} {...form.register("department")}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Start" required><input type="date" className={controlClass} {...form.register("startDate")} /></Field>
          <Field label="End" required><input type="date" className={controlClass} {...form.register("endDate")} /></Field>
          <Field label="Contract value (BDT)" required><input type="number" min="0" className={controlClass} {...form.register("value", { valueAsNumber: true })} /></Field>
          <Field label="Performance security"><input className={controlClass} {...form.register("performanceSecurity")} placeholder="Bank guarantee or pay-order reference" /></Field>
        </div>
        <RowsEditor<ContractFormValues> name="milestones" empty={() => ({ id: crypto.randomUUID(), title: "", dueDate: "", amount: 0 })}>
          {(index, remove) => (
            <div className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-3">
              <Field label="Milestone"><input className={controlClass} {...form.register(`milestones.${index}.title`)} /></Field>
              <Field label="Due"><input type="date" className={controlClass} {...form.register(`milestones.${index}.dueDate`)} /></Field>
              <div className="flex items-end gap-2"><Field label="Amount"><input type="number" min="0" className={controlClass} {...form.register(`milestones.${index}.amount`, { valueAsNumber: true })} /></Field><Button type="button" variant="ghost" onClick={remove}>Remove</Button></div>
            </div>
          )}
        </RowsEditor>
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "activate"; }}>Activate contract</Button>
        </div>
      </form>
    </Form>
  );
}

export function ReceiptEditor({ onDone }: { onDone: () => void }) {
  const { state, commit } = useProcurement();
  const orders = state.purchaseOrders.filter((item) => item.status === "Issued" || item.status === "Partially received");
  const [purchaseOrderId, setPurchaseOrderId] = useState(orders[0]?.id ?? "");
  const [storeId, setStoreId] = useState(state.stores[0]?.id ?? "");
  const [quality, setQuality] = useState<GoodsReceipt["quality"]>("Accepted");
  const [challan, setChallan] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [batches, setBatches] = useState<Record<string, string>>({});
  const [expiries, setExpiries] = useState<Record<string, string>>({});
  const purchaseOrder = orders.find((item) => item.id === purchaseOrderId);
  return (
    <form className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      if (!purchaseOrder) return;
      const saved = commit(postGoodsReceipt(state, { purchaseOrderId: purchaseOrder.id, storeId, quality, challan, lines: purchaseOrder.lines.map((line) => ({ lineId: line.id, receivedNow: quantities[line.id] ?? 0, batch: batches[line.id] ?? "", expiry: expiries[line.id] ?? "" })) }), "Goods receipt posted");
      if (saved) onDone();
    }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Purchase order" required><select className={controlClass} value={purchaseOrderId} onChange={(event) => setPurchaseOrderId(event.target.value)}>{orders.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}{orders.length === 0 && <option value="">No issued orders</option>}</select></Field>
        <Field label="Store" required><select className={controlClass} value={storeId} onChange={(event) => setStoreId(event.target.value)}>{state.stores.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
        <Field label="Quality result" required><select className={controlClass} value={quality} onChange={(event) => setQuality(event.target.value as GoodsReceipt["quality"])}><option>Accepted</option><option>Accepted with remarks</option><option>Rejected</option></select></Field>
        <Field label="Supplier challan"><input className={controlClass} value={challan} onChange={(event) => setChallan(event.target.value)} placeholder="Challan number and note" /></Field>
      </div>
      {purchaseOrder?.lines.map((line) => {
        const already = quantityReceived(state, purchaseOrder.id, line.id);
        const remaining = Math.max(line.quantity - already, 0);
        return (
          <div key={line.id} className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-4">
            <p className="md:col-span-4 text-sm">{line.description}<span className="block text-xs text-muted-foreground">Ordered {line.quantity} · received {already} · remaining {remaining} · {line.category}</span></p>
            <label className="text-xs font-semibold">Quantity received<input aria-label={`Quantity received for ${line.description}`} type="number" min="0" max={remaining} className={controlClass} value={quantities[line.id] ?? ""} placeholder="0" onChange={(event) => setQuantities((current) => ({ ...current, [line.id]: Number(event.target.value) }))} /></label>
            <label className="text-xs font-semibold">Batch<input className={controlClass} value={batches[line.id] ?? ""} onChange={(event) => setBatches((current) => ({ ...current, [line.id]: event.target.value }))} /></label>
            <label className="text-xs font-semibold">Expiry<input type="date" className={controlClass} value={expiries[line.id] ?? ""} onChange={(event) => setExpiries((current) => ({ ...current, [line.id]: event.target.value }))} /></label>
          </div>
        );
      })}
      <div className="flex justify-end"><Button type="submit" disabled={!purchaseOrder}>Post GRN</Button></div>
    </form>
  );
}

export function MovementEditor({ onDone }: { onDone: () => void }) {
  const { state, commit } = useProcurement();
  const form = useForm<MovementFormValues>({ resolver: zodResolver(movementSchema), defaultValues: { item: "", storeId: state.stores[0]?.id ?? "", toStoreId: "", batch: "", expiry: "", projectId: state.projects[0]?.id ?? "", movementType: "Transfer", quantity: 1, department: "Health Programme", note: "" } });
  const movementType = form.watch("movementType");
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => { if (commit(postMovement(state, values), values.movementType === "Transfer" ? "Stock transferred" : "Stock movement posted")) onDone(); })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Item" required><input className={controlClass} {...form.register("item")} /></Field>
          <Field label="From store" required><select className={controlClass} {...form.register("storeId")}>{state.stores.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
          {movementType === "Transfer" && <Field label="To store" required><select className={controlClass} {...form.register("toStoreId")}><option value="">Select</option>{state.stores.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>}
          <Field label="Type" required><select className={controlClass} {...form.register("movementType")}><option>Receipt</option><option>Issue</option><option>Transfer</option></select></Field>
          <Field label="Batch"><input className={controlClass} {...form.register("batch")} /></Field>
          <Field label="Expiry"><input type="date" className={controlClass} {...form.register("expiry")} /></Field>
          <Field label="Project" required><select className={controlClass} {...form.register("projectId")}>{state.projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
          <Field label="Quantity" required><input type="number" min="1" className={controlClass} {...form.register("quantity", { valueAsNumber: true })} /></Field>
          <Field label="Department"><select className={controlClass} {...form.register("department")}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Note"><input className={controlClass} {...form.register("note")} /></Field>
        </div>
        <div className="flex justify-end"><Button type="submit">{movementType === "Transfer" ? "Transfer stock" : "Post movement"}</Button></div>
      </form>
    </Form>
  );
}

export function InvoiceEditor({ existing, purchaseOrderId: presetOrderId, onDone }: { existing?: Invoice | undefined; purchaseOrderId?: string | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "submit">("draft");
  const orders = state.purchaseOrders.filter((item) => item.status !== "Draft" && (state.persona !== "supplier" || item.supplierName === SUPPLIER_ACCOUNT));
  const preset = orders.find((item) => item.id === presetOrderId);
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: existing ?? {
      invoiceNumber: "",
      title: preset ? `Invoice · ${preset.title}` : "",
      supplierName: preset?.supplierName ?? (state.persona === "supplier" ? SUPPLIER_ACCOUNT : ""),
      purchaseOrderId: preset?.id ?? "",
      receiptId: preset ? state.receipts.find((item) => item.purchaseOrderId === preset.id)?.id ?? "" : "",
      department: preset?.department ?? "Health Programme",
      projectId: preset?.projectId ?? "",
      invoiceDate: todayIso(),
      mushakNumber: "",
      mushakDate: "",
      lines: preset ? preset.lines.map((line) => ({ ...line })) : [blankLine()],
    },
  });
  const purchaseOrderId = form.watch("purchaseOrderId");
  const match = threeWayMatch(state, purchaseOrderId);
  const applyOrder = (id: string) => {
    const order = state.purchaseOrders.find((item) => item.id === id);
    form.setValue("purchaseOrderId", id);
    if (!order) return;
    form.setValue("supplierName", order.supplierName);
    form.setValue("department", order.department);
    form.setValue("projectId", order.projectId);
    form.setValue("title", `Invoice · ${order.title}`);
    form.setValue("lines", order.lines.map((line) => ({ ...line })));
    form.setValue("receiptId", state.receipts.find((item) => item.purchaseOrderId === id)?.id ?? "");
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(saveInvoice(state, payload, intent.current), intent.current === "submit" ? "Invoice submitted" : "Invoice draft saved")) onDone();
      })}>
        {existing?.returnComment && <p className="rounded-md bg-warning-soft px-3 py-2 text-sm">Returned: {existing.returnComment}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Invoice number" required><input className={controlClass} {...form.register("invoiceNumber")} /></Field>
          <Field label="Invoice date" required><input type="date" className={controlClass} {...form.register("invoiceDate")} /></Field>
          <Field label="Mushak 6.3 number"><input className={controlClass} {...form.register("mushakNumber")} /></Field>
          <Field label="Mushak 6.3 date"><input type="date" className={controlClass} {...form.register("mushakDate")} /></Field>
          <Field label="Purchase order" required><select className={controlClass} value={purchaseOrderId} onChange={(event) => applyOrder(event.target.value)}><option value="">Select</option>{orders.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Goods receipt"><select className={controlClass} {...form.register("receiptId")}><option value="">None</option>{state.receipts.filter((item) => item.purchaseOrderId === purchaseOrderId).map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select></Field>
          <Field label="Supplier" required><input className={controlClass} {...form.register("supplierName")} /></Field>
        </div>
        <p className="text-sm text-muted-foreground">{DEMO_POLICY_NOTE} VAT {VAT_RATE}% is added and tax deducted at source {TDS_RATE}% is withheld. Net payable {formatBDT(invoiceAmounts(form.watch("lines") ?? []).net)}. For a supplier invoice, the Mushak 6.3 date must match the invoice date.</p>
        {match.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground"><tr><th className="px-3 py-2">Line</th><th className="px-3 py-2">Ordered</th><th className="px-3 py-2">Received</th><th className="px-3 py-2">Invoiced</th></tr></thead>
              <tbody>{match.map((row) => <tr key={row.description} className="border-t border-border"><td className="px-3 py-2">{row.description}</td><td className="px-3 py-2">{row.ordered} {row.unit}</td><td className="px-3 py-2">{row.received}</td><td className="px-3 py-2">{row.invoiced}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        <LineItemsEditor />
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "submit"; }}>Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export function BidEditor({ existing, tenderId, onDone }: { existing?: Bid | undefined; tenderId?: string | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "submit">("draft");
  const openTenders = state.tenders.filter((item) => item.status === "Published" || item.status === "Evaluation");
  const initialTender = existing?.tenderId ?? tenderId ?? openTenders[0]?.id ?? "";
  const seedLines = state.tenders.find((item) => item.id === initialTender)?.lines.map((line) => ({ ...line, id: crypto.randomUUID(), unitPrice: 0 })) ?? [blankLine()];
  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: existing ? { tenderId: existing.tenderId, validityDate: existing.validityDate, technicalNote: existing.technicalNote, securityNote: existing.securityNote, declared: existing.declared, lines: existing.lines } : { tenderId: initialTender, validityDate: "", technicalNote: "", securityNote: "", declared: false, lines: seedLines },
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(saveBid(state, payload, intent.current), intent.current === "submit" ? "Bid submitted" : "Bid draft saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tender" required><select className={controlClass} {...form.register("tenderId")}>{openTenders.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Offer valid until" required error={form.formState.errors.validityDate?.message}><input type="date" className={controlClass} {...form.register("validityDate")} /></Field>
        </div>
        <Field label="Technical note" required error={form.formState.errors.technicalNote?.message}><textarea className={`${controlClass} h-24 py-2`} {...form.register("technicalNote")} /></Field>
        <Field label="Tender security reference"><input className={controlClass} {...form.register("securityNote")} placeholder="Pay order or bank guarantee number" /></Field>
        <LineItemsEditor />
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" {...form.register("declared")} />I confirm this offer is firm, the goods match the specification, and the supplier accepts the tender conditions.</label>
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "submit"; }}>Submit bid</Button>
        </div>
      </form>
    </Form>
  );
}

export function DeliveryEditor({ purchaseOrderId, onDone }: { purchaseOrderId?: string | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const orders = state.purchaseOrders.filter((item) => item.supplierName === SUPPLIER_ACCOUNT && (item.status === "Issued" || item.status === "Partially received"));
  const [selected, setSelected] = useState(purchaseOrderId ?? orders[0]?.id ?? "");
  const [expectedDate, setExpectedDate] = useState("");
  const [challan, setChallan] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const order = orders.find((item) => item.id === selected);
  return (
    <form className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      if (!order) return;
      const saved = commit(confirmDelivery(state, { purchaseOrderId: order.id, expectedDate, challan, lines: order.lines.map((line) => ({ lineId: line.id, quantity: quantities[line.id] ?? line.quantity })) }), "Delivery confirmed");
      if (saved) onDone();
    }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Purchase order" required><select className={controlClass} value={selected} onChange={(event) => setSelected(event.target.value)}>{orders.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}{orders.length === 0 && <option value="">No open orders</option>}</select></Field>
        <Field label="Expected arrival" required><input type="date" required className={controlClass} value={expectedDate} onChange={(event) => setExpectedDate(event.target.value)} /></Field>
        <Field label="Challan number" required><input required className={controlClass} value={challan} onChange={(event) => setChallan(event.target.value)} /></Field>
      </div>
      {order?.lines.map((line) => (
        <label key={line.id} className="grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-3 text-sm">
          <span>{line.description}<span className="block text-xs text-muted-foreground">Ordered {line.quantity} {line.unit}</span></span>
          <input aria-label={`Delivery quantity for ${line.description}`} type="number" min="0" className={controlClass} value={quantities[line.id] ?? line.quantity} onChange={(event) => setQuantities((current) => ({ ...current, [line.id]: Number(event.target.value) }))} />
        </label>
      ))}
      <div className="flex justify-end"><Button type="submit" disabled={!order}>Confirm delivery</Button></div>
    </form>
  );
}
