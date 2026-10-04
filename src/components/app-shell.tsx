import { Link, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import { navigationGroups } from "@/lib/procurement";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = Icons as unknown as Record<string, ComponentType<{ className?: string }>>;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const vendor = pathname.startsWith("/vendor");
  const nav = vendor ? [{ label: "Supplier portal", items: [{ label: "Overview", to: "/vendor", icon: "LayoutDashboard" }, { label: "Available tenders", to: "/vendor/tenders", icon: "FileSearch" }, { label: "My bids", to: "/vendor/bids", icon: "Send" }, { label: "Orders & invoices", to: "/vendor/orders", icon: "ReceiptText" }] }] : navigationGroups;
  return <div className="min-h-dvh bg-background">
    {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMobileOpen(false)} />}
    <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5"><div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sm font-black text-sidebar-primary-foreground">PR</div><div className="min-w-0"><p className="truncate text-sm font-bold">Procuria</p><p className="truncate text-[11px] text-sidebar-muted">Bangladesh Country Office</p></div></div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">{nav.map((group) => <div key={group.label} className="mb-5"><p className="px-3 pb-2 text-[10px] font-bold uppercase text-sidebar-muted">{group.label}</p><ul className="space-y-1">{group.items.map((item) => { const Icon = iconMap[item.icon] ?? Icons.Circle; const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`); return <li key={item.to}><Link to={item.to} onClick={() => setMobileOpen(false)} className={cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground")}><Icon className="size-[18px] shrink-0" /><span className="min-w-0 flex-1 truncate">{item.label}</span>{"count" in item && <span className="rounded-full bg-sidebar-badge px-2 py-0.5 text-[11px] font-bold text-sidebar-foreground">{item.count}</span>}</Link></li>; })}</ul></div>)}</nav>
      <div className="border-t border-sidebar-border p-3"><Link to={vendor ? "/" : "/vendor"} className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"><Icons.ArrowLeftRight className="size-[18px]" />{vendor ? "Internal portal" : "Supplier portal"}</Link></div>
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-20 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6"><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Icons.Menu className="size-5" /></Button><div className="hidden min-w-0 sm:block"><p className="truncate text-sm font-semibold text-foreground">{vendor ? "Supplier workspace" : "Internal procurement workspace"}</p><p className="text-xs text-muted-foreground">FY 2026–27</p></div><div className="col-start-3 flex items-center gap-1"><Button variant="ghost" size="icon" aria-label="Search"><Icons.Search className="size-5" /></Button><Link to="/notifications" aria-label="Notifications" className="relative grid size-11 place-items-center rounded-md text-muted-foreground hover:bg-muted"><Icons.Bell className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" /></Link><div className="ml-2 hidden items-center gap-3 border-l border-border pl-4 sm:flex"><div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-bold text-primary">NK</div><div><p className="text-xs font-semibold text-foreground">Nabila Khan</p><p className="text-[11px] text-muted-foreground">Procurement Manager</p></div></div></div></header>
      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  </div>;
}