import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, type ArrayPath, type FieldArray, type FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { blankLine, formatBDT, lineTotal, linesTotal, type LineItem } from "@/lib/domain";

export const controlClass = "mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function Field({ label, error, required, children }: { label: string; error?: string | undefined; required?: boolean; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label} {required && <span className="text-destructive">*</span>}
      {children}
      {error && <span className="mt-1 block text-xs font-normal text-destructive">{error}</span>}
    </label>
  );
}

export function LineItemsEditor() {
  const { control, register, watch, formState } = useFormContext<{ lines: LineItem[] }>();
  const rows = useFieldArray({ control, name: "lines", keyName: "key" });
  const lines = watch("lines") ?? [];
  const lineErrors = formState.errors.lines;

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold">Line items</legend>
      {rows.fields.map((field, index) => {
        const rowError = Array.isArray(lineErrors) ? lineErrors[index] : undefined;
        return (
          <div key={field.key} className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-6">
            <label className="md:col-span-2 text-xs font-semibold">Description <span className="text-destructive">*</span>
              <input className={controlClass} {...register(`lines.${index}.description`)} />
              {rowError?.description && <span className="mt-1 block font-normal text-destructive">{rowError.description.message}</span>}
            </label>
            <label className="text-xs font-semibold">Qty <span className="text-destructive">*</span>
              <input type="number" min="0" step="1" className={controlClass} {...register(`lines.${index}.quantity`, { valueAsNumber: true })} />
            </label>
            <label className="text-xs font-semibold">Unit <span className="text-destructive">*</span>
              <input className={controlClass} {...register(`lines.${index}.unit`)} />
            </label>
            <label className="text-xs font-semibold">Unit price (BDT)
              <input type="number" min="0" step="0.01" className={controlClass} {...register(`lines.${index}.unitPrice`, { valueAsNumber: true })} />
            </label>
            <div className="flex items-end justify-between gap-2">
              <p className="pb-3 text-sm font-semibold">{formatBDT(lineTotal(lines[index] ?? { quantity: 0, unitPrice: 0 }))}</p>
              <Button type="button" variant="ghost" size="icon" aria-label="Remove line" onClick={() => rows.remove(index)} disabled={rows.fields.length === 1}><Trash2 className="size-4" /></Button>
            </div>
            <label className="md:col-span-6 text-xs font-semibold">Specification
              <input className={controlClass} {...register(`lines.${index}.specification`)} />
            </label>
            <label className="md:col-span-2 text-xs font-semibold">Category
              <select className={controlClass} {...register(`lines.${index}.category`)}>
                <option>Consumable</option>
                <option>Medicine</option>
                <option>Equipment</option>
                <option>Vehicle</option>
              </select>
            </label>
          </div>
        );
      })}
      {typeof lineErrors?.message === "string" && <p className="text-xs text-destructive">{lineErrors.message}</p>}
      <div className="flex items-center justify-between">
        <Button type="button" variant="secondary" onClick={() => rows.append(blankLine())}><Plus className="size-4" />Add line</Button>
        <p className="text-sm font-bold">Total {formatBDT(linesTotal(lines))}</p>
      </div>
    </fieldset>
  );
}

export function RowsEditor<T extends FieldValues>({ name, empty, children }: { name: ArrayPath<T>; empty: () => FieldArray<T, ArrayPath<T>>; children: (index: number, remove: () => void) => ReactNode }) {
  const { control } = useFormContext<T>();
  const rows = useFieldArray({ control, name, keyName: "key" });
  return (
    <div className="space-y-3">
      {rows.fields.map((field, index) => (
        <div key={field.key}>{children(index, () => rows.remove(index))}</div>
      ))}
      <Button type="button" variant="secondary" onClick={() => rows.append(empty())}><Plus className="size-4" />Add row</Button>
    </div>
  );
}
