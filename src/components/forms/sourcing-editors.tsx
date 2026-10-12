import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Field, LineItemsEditor, RowsEditor, controlClass } from "@/components/forms/form-fields";
import { DEPARTMENTS, INTERNAL_ACTOR, METHODS, PROGRAMMES, QUARTERS, blankLine, linesTotal, saveEvaluation, savePlan, saveRequisition, saveSurvey, saveTender, todayIso, type Evaluation, type Plan, type Requisition, type Survey, type Tender } from "@/lib/domain";
import { DEMO_POLICY_NOTE, bandForValue, methodIsWeaker, roleLabel } from "@/lib/policy";
import { evaluationSchema, planSchema, requisitionSchema, surveySchema, tenderSchema, type EvaluationFormValues, type PlanFormValues, type RequisitionFormValues, type SurveyFormValues, type TenderFormValues } from "@/lib/schemas";
import { useProcurement } from "@/lib/store";

export function RequisitionEditor({ existing, onDone }: { existing?: Requisition | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "submit">("draft");
  const form = useForm<RequisitionFormValues>({
    resolver: zodResolver(requisitionSchema),
    defaultValues: existing ?? { title: "", programme: "Education", department: "Education", requester: INTERNAL_ACTOR, needBy: "", projectId: state.projects[0]?.id ?? "", justification: "", method: "Direct", methodJustification: "", lines: [blankLine()] },
  });
  const lines = form.watch("lines");
  const method = form.watch("method");
  const band = bandForValue(linesTotal(lines ?? []));
  const weaker = methodIsWeaker(method, band.method);
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(saveRequisition(state, payload, intent.current), intent.current === "submit" ? "Requisition submitted for approval" : "Requisition draft saved")) onDone();
      })}>
        {existing?.returnComment && <p className="rounded-md bg-warning-soft px-3 py-2 text-sm text-warning-foreground">Returned: {existing.returnComment}</p>}
        <p className="rounded-md bg-muted px-3 py-2 text-sm">{DEMO_POLICY_NOTE} This value uses <strong>{band.method}</strong> and waits for the <strong>{roleLabel(band.role)}</strong>.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required error={form.formState.errors.title?.message}><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Requester" required error={form.formState.errors.requester?.message}><input className={controlClass} {...form.register("requester")} /></Field>
          <Field label="Programme" required><select className={controlClass} {...form.register("programme")}>{PROGRAMMES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Department" required><select className={controlClass} {...form.register("department")}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Need-by date" required error={form.formState.errors.needBy?.message}><input type="date" className={controlClass} {...form.register("needBy")} /></Field>
          <Field label="Project" required error={form.formState.errors.projectId?.message}><select className={controlClass} {...form.register("projectId")}>{state.projects.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.donor} · {item.budgetHead}</option>)}</select></Field>
          <Field label="Method" required><select className={controlClass} {...form.register("method")}>{METHODS.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        {weaker && <Field label="Why a less competitive method?" required><textarea className={`${controlClass} h-20 py-2`} {...form.register("methodJustification")} /></Field>}
        <Field label="Justification" required error={form.formState.errors.justification?.message}><textarea className={`${controlClass} h-24 py-2`} {...form.register("justification")} /></Field>
        <LineItemsEditor />
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "submit"; }}>Submit for approval</Button>
        </div>
      </form>
    </Form>
  );
}

export function PlanEditor({ existing, onDone }: { existing?: Plan | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "activate">("draft");
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: existing ?? { title: "", fiscalYear: "2026–27", programme: "Health", department: "Health Programme", owner: INTERNAL_ACTOR, budgetCeiling: 0, lines: [{ id: crypto.randomUUID(), description: "", quarter: "Q1", estimatedValue: 0, method: "Open tender" }] },
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(savePlan(state, payload, intent.current), intent.current === "activate" ? "Plan activated" : "Plan saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required error={form.formState.errors.title?.message}><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Fiscal year" required error={form.formState.errors.fiscalYear?.message}><input className={controlClass} {...form.register("fiscalYear")} /></Field>
          <Field label="Programme" required><select className={controlClass} {...form.register("programme")}>{PROGRAMMES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Department" required><select className={controlClass} {...form.register("department")}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Owner" required error={form.formState.errors.owner?.message}><input className={controlClass} {...form.register("owner")} /></Field>
          <Field label="Budget ceiling (BDT)" required error={form.formState.errors.budgetCeiling?.message}><input type="number" min="0" className={controlClass} {...form.register("budgetCeiling", { valueAsNumber: true })} /></Field>
        </div>
        <RowsEditor<PlanFormValues> name="lines" empty={() => ({ id: crypto.randomUUID(), description: "", quarter: "Q1", estimatedValue: 0, method: "Open tender" })}>
          {(index, remove) => (
            <div className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-4">
              <Field label="Description" required><input className={controlClass} {...form.register(`lines.${index}.description`)} /></Field>
              <Field label="Quarter"><select className={controlClass} {...form.register(`lines.${index}.quarter`)}>{QUARTERS.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="Estimated value"><input type="number" min="0" className={controlClass} {...form.register(`lines.${index}.estimatedValue`, { valueAsNumber: true })} /></Field>
              <div className="flex items-end gap-2"><Field label="Method"><select className={controlClass} {...form.register(`lines.${index}.method`)}>{METHODS.map((item) => <option key={item}>{item}</option>)}</select></Field><Button type="button" variant="ghost" onClick={remove}>Remove</Button></div>
            </div>
          )}
        </RowsEditor>
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "activate"; }}>Activate plan</Button>
        </div>
      </form>
    </Form>
  );
}

export function SurveyEditor({ existing, onDone }: { existing?: Survey | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "complete">("draft");
  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: existing ? { title: existing.title, requisitionId: existing.requisitionId, owner: existing.owner, recommendation: existing.recommendation, quotes: existing.quotes } : { title: "", requisitionId: "", owner: INTERNAL_ACTOR, recommendation: "", quotes: [{ id: crypto.randomUUID(), supplierName: "", unitPrice: 0, leadTimeDays: 7, validUntil: "" }] },
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const requisition = state.requisitions.find((item) => item.id === values.requisitionId);
        const payload = { ...values, department: requisition?.department ?? "", ...(existing ? { id: existing.id } : {}) };
        if (commit(saveSurvey(state, payload, intent.current), intent.current === "complete" ? "Survey completed" : "Survey saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required error={form.formState.errors.title?.message}><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Requisition" required error={form.formState.errors.requisitionId?.message}><select className={controlClass} {...form.register("requisitionId")}><option value="">Select</option>{state.requisitions.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Owner" required><input className={controlClass} {...form.register("owner")} /></Field>
        </div>
        <Field label="Recommendation" required error={form.formState.errors.recommendation?.message}><textarea className={`${controlClass} h-20 py-2`} {...form.register("recommendation")} /></Field>
        <RowsEditor<SurveyFormValues> name="quotes" empty={() => ({ id: crypto.randomUUID(), supplierName: "", unitPrice: 0, leadTimeDays: 7, validUntil: "" })}>
          {(index, remove) => (
            <div className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-4">
              <Field label="Supplier" required><input className={controlClass} {...form.register(`quotes.${index}.supplierName`)} /></Field>
              <Field label="Unit price"><input type="number" min="0" className={controlClass} {...form.register(`quotes.${index}.unitPrice`, { valueAsNumber: true })} /></Field>
              <Field label="Lead time (days)"><input type="number" min="1" className={controlClass} {...form.register(`quotes.${index}.leadTimeDays`, { valueAsNumber: true })} /></Field>
              <div className="flex items-end gap-2"><Field label="Valid until"><input type="date" className={controlClass} {...form.register(`quotes.${index}.validUntil`)} /></Field><Button type="button" variant="ghost" onClick={remove}>Remove</Button></div>
            </div>
          )}
        </RowsEditor>
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "complete"; }}>Complete survey</Button>
        </div>
      </form>
    </Form>
  );
}

export function TenderEditor({ existing, onDone }: { existing?: Tender | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"draft" | "publish">("draft");
  const form = useForm<TenderFormValues>({
    resolver: zodResolver(tenderSchema),
    defaultValues: existing ? { title: existing.title, method: existing.method, requisitionId: existing.requisitionId, department: existing.department, owner: existing.owner, publishDate: existing.publishDate, closingDate: existing.closingDate, eligibility: existing.eligibility, projectId: existing.projectId, documentFee: existing.documentFee, tenderSecurity: existing.tenderSecurity, lines: existing.lines } : { title: "", method: "Open tender", requisitionId: "", department: "Health Programme", owner: INTERNAL_ACTOR, publishDate: todayIso(), closingDate: "", eligibility: "", projectId: state.projects[0]?.id ?? "", documentFee: 0, tenderSecurity: 0, lines: [blankLine()] },
  });
  const copyRequisition = (id: string) => {
    form.setValue("requisitionId", id);
    const source = state.requisitions.find((item) => item.id === id);
    if (!source) return;
    form.setValue("title", source.title);
    form.setValue("department", source.department);
    form.setValue("method", source.method);
    form.setValue("projectId", source.projectId);
    form.setValue("lines", source.lines.map((line) => ({ ...line, id: crypto.randomUUID() })));
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(saveTender(state, payload, intent.current), intent.current === "publish" ? "Tender published" : "Tender draft saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Linked requisition"><select className={controlClass} value={form.watch("requisitionId")} onChange={(event) => copyRequisition(event.target.value)}><option value="">None</option>{state.requisitions.filter((item) => item.status === "Approved" || item.id === existing?.requisitionId).map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Title" required error={form.formState.errors.title?.message}><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Method" required><select className={controlClass} {...form.register("method")}>{METHODS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Department" required><select className={controlClass} {...form.register("department")}>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Owner" required><input className={controlClass} {...form.register("owner")} /></Field>
          <Field label="Project"><select className={controlClass} {...form.register("projectId")}>{state.projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
          <Field label="Publish date" required><input type="date" className={controlClass} {...form.register("publishDate")} /></Field>
          <Field label="Closing date" required error={form.formState.errors.closingDate?.message}><input type="date" className={controlClass} {...form.register("closingDate")} /></Field>
          <Field label="Document fee (BDT)"><input type="number" min="0" className={controlClass} {...form.register("documentFee", { valueAsNumber: true })} /></Field>
          <Field label="Tender security (BDT)"><input type="number" min="0" className={controlClass} {...form.register("tenderSecurity", { valueAsNumber: true })} /></Field>
        </div>
        <Field label="Eligibility" required error={form.formState.errors.eligibility?.message}><textarea className={`${controlClass} h-20 py-2`} {...form.register("eligibility")} /></Field>
        <LineItemsEditor />
        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "draft"; }}>Save draft</Button>
          <Button type="submit" onClick={() => { intent.current = "publish"; }}>Publish</Button>
        </div>
      </form>
    </Form>
  );
}

export function EvaluationEditor({ existing, onDone }: { existing?: Evaluation | undefined; onDone: () => void }) {
  const { state, commit } = useProcurement();
  const intent = useRef<"Awarded" | "Unsuccessful" | undefined>(undefined);
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: existing ?? { title: "", tenderId: "", bidder: "", technicalScore: 0, financialScore: 0, recommendation: "", committeeNote: "", owner: INTERNAL_ACTOR },
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => {
        const payload = existing ? { ...values, id: existing.id } : values;
        if (commit(saveEvaluation(state, payload, intent.current), intent.current ? `Evaluation recorded as ${intent.current}` : "Evaluation saved")) onDone();
      })}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tender" required error={form.formState.errors.tenderId?.message}><select className={controlClass} {...form.register("tenderId")}><option value="">Select</option>{state.tenders.filter((item) => item.status !== "Draft").map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}</select></Field>
          <Field label="Title" required><input className={controlClass} {...form.register("title")} /></Field>
          <Field label="Bidder" required error={form.formState.errors.bidder?.message}><input className={controlClass} {...form.register("bidder")} list="supplier-names" /></Field>
          <Field label="Committee owner" required><input className={controlClass} {...form.register("owner")} /></Field>
          <Field label="Technical score (0–100)" required><input type="number" min="0" max="100" className={controlClass} {...form.register("technicalScore", { valueAsNumber: true })} /></Field>
          <Field label="Financial score (0–100)" required><input type="number" min="0" max="100" className={controlClass} {...form.register("financialScore", { valueAsNumber: true })} /></Field>
        </div>
        <datalist id="supplier-names">{state.suppliers.map((item) => <option key={item.id} value={item.legalName} />)}</datalist>
        <Field label="Recommendation" required><textarea className={`${controlClass} h-16 py-2`} {...form.register("recommendation")} /></Field>
        <Field label="Committee note" required><textarea className={`${controlClass} h-16 py-2`} {...form.register("committeeNote")} /></Field>
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="submit" variant="secondary" onClick={() => { intent.current = undefined; }}>Save draft</Button>
          <Button type="submit" variant="secondary" onClick={() => { intent.current = "Unsuccessful"; }}>Record unsuccessful</Button>
          <Button type="submit" onClick={() => { intent.current = "Awarded"; }}>Record awarded</Button>
        </div>
      </form>
    </Form>
  );
}
