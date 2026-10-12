import { Search, SlidersHorizontal, Download, ChevronLeft, ChevronRight, Inbox, X, ChevronUp, ChevronDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { formatBDT, type ProcurementRecord, type StatusTone } from "@/lib/procurement";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  const { t } = useI18n();
  return <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div className="min-w-0"><h1 className="text-2xl font-bold text-foreground">{t(title)}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

const toneClass: Record<StatusTone, string> = { success: "bg-success-soft text-success", warning: "bg-warning-soft text-warning-foreground", danger: "bg-danger-soft text-destructive", info: "bg-info-soft text-info", neutral: "bg-muted text-muted-foreground" };
export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: StatusTone }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[tone])}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{children}</span>;
}

export function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return <article className="rounded-md border border-border bg-card p-5 shadow-card"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold text-card-foreground">{value}</p></div><div className="grid size-10 place-items-center rounded-md bg-accent text-primary">{icon}</div></div><p className="mt-3 text-xs text-muted-foreground">{detail}</p></article>;
}

type SortKey = "id" | "title" | "department" | "value" | "date" | "status";

function downloadCsv(records: ProcurementRecord[]) {
  const header = ["Reference", "Description", "Department", "Value", "Date", "Status"];
  const lines = [header, ...records.map((item) => [item.id, item.title, item.department, String(item.value), item.date, item.status])];
  const csv = lines.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "procuria-export.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function RecordsTable({ records, emptyLabel = "records", onOpen }: { records: ProcurementRecord[]; emptyLabel?: string; onOpen?: (item: ProcurementRecord) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const statuses = Array.from(new Set(records.map((item) => item.status)));
  const filtered = useMemo(() => {
    const rows = records.filter((item) => `${item.id} ${item.title} ${item.department}`.toLowerCase().includes(query.toLowerCase()) && (status === "All statuses" || item.status === status));
    return [...rows].sort((left, right) => {
      const a = left[sortKey];
      const b = right[sortKey];
      const compared = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
      return sortAsc ? compared : -compared;
    });
  }, [records, query, status, sortKey, sortAsc]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const sortBy = (key: SortKey) => {
    if (sortKey === key) setSortAsc((value) => !value);
    else { setSortKey(key); setSortAsc(true); }
    setPage(0);
  };
  const columns: Array<[SortKey, string]> = [["id", "Reference"], ["title", "Description"], ["department", "Department / supplier"], ["value", "Value"], ["date", "Due / updated"], ["status", "Status"]];
  return <div className="overflow-hidden rounded-md border border-border bg-card shadow-card">
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-sm"><span className="sr-only">Search records</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Search by ID, title or department" className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />{query && <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-1 top-0 grid size-11 place-items-center text-muted-foreground"><X className="size-4" /></button>}</label>
      <div className="flex gap-2"><label className="relative"><span className="sr-only">Filter by status</span><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} className="h-11 rounded-md border border-input bg-background pl-9 pr-8 text-sm text-foreground"><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><Button variant="secondary" size="icon" aria-label="Export records" onClick={() => downloadCsv(filtered)}><Download className="size-4" /></Button></div>
    </div>
    {visible.length ? <><div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-muted/70 text-xs uppercase text-muted-foreground"><tr>{columns.map(([key, label]) => <th key={key} className="px-5 py-3 font-semibold"><button type="button" className="inline-flex items-center gap-1" onClick={() => sortBy(key)}>{label}{sortKey === key ? (sortAsc ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : null}</button></th>)}</tr></thead><tbody>{visible.map((item) => <tr key={item.id} onClick={() => onOpen?.(item)} className={cn("border-t border-border", onOpen && "cursor-pointer hover:bg-muted/40")}><td className="px-5 py-4 font-semibold text-primary">{item.id}</td><td className="max-w-sm px-5 py-4 font-medium text-foreground">{item.title}</td><td className="px-5 py-4 text-muted-foreground">{item.department}</td><td className="px-5 py-4 font-medium text-foreground">{formatBDT(item.value)}</td><td className="px-5 py-4 text-muted-foreground">{item.date}</td><td className="px-5 py-4"><StatusBadge tone={item.tone}>{item.status}</StatusBadge></td></tr>)}</tbody></table></div><div className="divide-y divide-border md:hidden">{visible.map((item) => <button key={item.id} onClick={() => onOpen?.(item)} className="block min-h-11 w-full p-4 text-left"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-primary">{item.id}</span><StatusBadge tone={item.tone}>{item.status}</StatusBadge></div><p className="mt-2 font-medium text-foreground">{item.title}</p><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{item.department}</span><span>{formatBDT(item.value)}</span></div></button>)}</div></> : <div className="grid min-h-72 place-items-center p-8 text-center"><div><Inbox className="mx-auto size-10 text-muted-foreground" /><h2 className="mt-3 font-semibold text-foreground">No {emptyLabel} found</h2><p className="mt-1 text-sm text-muted-foreground">Try changing your search or filter.</p></div></div>}
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground"><span>Showing {visible.length} of {filtered.length}</span><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPage((value) => value + 1)}><ChevronRight className="size-4" /></Button></div></div>
  </div>;
}
