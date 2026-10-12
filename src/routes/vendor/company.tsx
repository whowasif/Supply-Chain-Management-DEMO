import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Field, controlClass } from "@/components/forms/form-fields";
import { PageHeader } from "@/components/procurement-ui";
import { SUPPLIER_ACCOUNT, formatDisplayDate, saveSupplierProfile } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/vendor/company")({
  head: () => ({ meta: [{ title: "My company — Procuria" }, { name: "description", content: "Supplier company file, licence, BIN and bank account." }] }),
  component: VendorCompany,
});

function VendorCompany() {
  const { state, commit } = useProcurement();
  const company = state.suppliers.find((item) => item.legalName === SUPPLIER_ACCOUNT);
  const [form, setForm] = useState({
    tradeLicence: company?.tradeLicence ?? "",
    tin: company?.tin ?? "",
    bin: company?.bin ?? "",
    licenceExpiry: company?.licenceExpiry ?? "",
    bankName: company?.bankName ?? "",
    accountNumber: company?.accountNumber ?? "",
    routingNumber: company?.routingNumber ?? "",
    categories: company?.categories ?? "",
    district: company?.district ?? "",
    contact: company?.contact ?? "",
  });
  if (!company) return <PageHeader title="My company" description="The supplier account was not found." />;
  const set = (key: keyof typeof form) => (event: { target: { value: string } }) => setForm((current) => ({ ...current, [key]: event.target.value }));
  return (
    <div className="space-y-6">
      <PageHeader title="My company" description={`${company.legalName} · ${company.status}. A change is sent back for review, and a bid can be submitted only while the file is verified.`} />
      {company.returnComment && <p className="rounded-md bg-warning-soft px-3 py-2 text-sm">Returned: {company.returnComment}</p>}
      <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); commit(saveSupplierProfile(state, form), "Company file submitted for review"); }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Legal name"><input className={controlClass} value={company.legalName} readOnly /></Field>
          <Field label="Status"><input className={controlClass} value={company.status} readOnly /></Field>
          <Field label="Trade licence" required><input className={controlClass} value={form.tradeLicence} onChange={set("tradeLicence")} /></Field>
          <Field label="Licence expiry" required><input type="date" className={controlClass} value={form.licenceExpiry} onChange={set("licenceExpiry")} /></Field>
          <Field label="TIN" required><input className={controlClass} value={form.tin} onChange={set("tin")} /></Field>
          <Field label="BIN (13 digits)" required><input className={controlClass} value={form.bin} onChange={set("bin")} /></Field>
          <Field label="Bank" required><input className={controlClass} value={form.bankName} onChange={set("bankName")} /></Field>
          <Field label="Account number" required><input className={controlClass} value={form.accountNumber} onChange={set("accountNumber")} /></Field>
          <Field label="Routing number" required><input className={controlClass} value={form.routingNumber} onChange={set("routingNumber")} /></Field>
          <Field label="District" required><input className={controlClass} value={form.district} onChange={set("district")} /></Field>
          <Field label="Categories" required><input className={controlClass} value={form.categories} onChange={set("categories")} /></Field>
          <Field label="Contact" required><input className={controlClass} value={form.contact} onChange={set("contact")} /></Field>
        </div>
        <p className="text-xs text-muted-foreground">Last updated {formatDisplayDate(company.updatedAt)}. Trade licence, TIN and BIN are recorded as text in this demo.</p>
        <div className="flex justify-end"><Button type="submit">Submit for review</Button></div>
      </form>
    </div>
  );
}
