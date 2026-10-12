import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { actorName, approvalQueue, personaTitle, searchHits, setPersona, type Persona } from "@/lib/domain";
import { useI18n } from "@/lib/i18n";
import { navigationGroups } from "@/lib/procurement";
import { useProcurement } from "@/lib/store";
import { cn } from "@/lib/utils";

const iconMap = Icons as unknown as Record<string, ComponentType<{ className?: string }>>;

const supplierNav = [{ label: "Supplier portal", items: [{ label: "Overview", to: "/vendor", icon: "LayoutDashboard" }, { label: "My company", to: "/vendor/company", icon: "Building2" }, { label: "Available tenders", to: "/vendor/tenders", icon: "FileSearch" }, { label: "My bids", to: "/vendor/bids", icon: "Send" }, { label: "Awards and contracts", to: "/vendor/awards", icon: "FileSignature" }, { label: "Deliveries", to: "/vendor/deliveries", icon: "PackageCheck" }, { label: "Invoices and payments", to: "/vendor/invoices", icon: "ReceiptText" }, { label: "Notices", to: "/vendor/notices", icon: "Megaphone" }] }];

const TABS_KEY = "procuria.tabs.v1";

const sectionLabels: Record<string, string> = { "/notifications": "Notifications" };
for (const group of navigationGroups) {
  for (const item of group.items) sectionLabels[item.to] = item.label;
}
for (const item of supplierNav[0]?.items ?? []) sectionLabels[item.to] = item.label;

type SectionTab = { id: string; path: string };
type WorkspaceTabs = { internal: SectionTab[]; supplier: SectionTab[]; activeInternal: string; activeSupplier: string };

function isSupplierPath(path: string) {
  return path.startsWith("/vendor");
}

function tabId() {
  return crypto.randomUUID();
}

function asTabs(value: unknown, supplier: boolean): SectionTab[] {
  if (!Array.isArray(value)) return [];
  const tabs: SectionTab[] = [];
  for (const item of value) {
    if (typeof item === "string" && sectionLabels[item] !== undefined && isSupplierPath(item) === supplier) {
      tabs.push({ id: tabId(), path: item });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const path = "path" in item ? item.path : undefined;
    const id = "id" in item ? item.id : undefined;
    if (typeof path === "string" && typeof id === "string" && sectionLabels[path] !== undefined && isSupplierPath(path) === supplier) tabs.push({ id, path });
  }
  return tabs;
}

function tabsForPath(pathname: string): WorkspaceTabs {
  const supplier = isSupplierPath(pathname);
  const internal = { id: "tab-internal", path: supplier ? "/" : pathname };
  const supplierTab = { id: "tab-supplier", path: supplier ? pathname : "/vendor" };
  return { internal: [internal], supplier: [supplierTab], activeInternal: internal.id, activeSupplier: supplierTab.id };
}

function withPath(tabs: SectionTab[], pathname: string) {
  return tabs.some((tab) => tab.path === pathname) ? tabs : [...tabs, { id: tabId(), path: pathname }];
}

function activeIdFor(tabs: SectionTab[], savedId: unknown, pathname: string) {
  return tabs.find((tab) => tab.id === savedId && tab.path === pathname)?.id ?? tabs.find((tab) => tab.path === pathname)?.id ?? tabs[0]?.id ?? "";
}

function readTabs(pathname: string): WorkspaceTabs {
  const base = tabsForPath(pathname);
  const supplier = isSupplierPath(pathname);
  try {
    const parsed = JSON.parse(sessionStorage.getItem(TABS_KEY) ?? "") as Partial<WorkspaceTabs>;
    let internal = asTabs(parsed.internal, false);
    let supplierTabs = asTabs(parsed.supplier, true);
    if (!internal.length) internal = [{ id: tabId(), path: "/" }];
    if (!supplierTabs.length) supplierTabs = [{ id: tabId(), path: "/vendor" }];
    if (!supplier) internal = withPath(internal, pathname);
    else supplierTabs = withPath(supplierTabs, pathname);
    return {
      internal,
      supplier: supplierTabs,
      activeInternal: supplier ? (internal.find((tab) => tab.id === parsed.activeInternal)?.id ?? internal[0]?.id ?? "") : activeIdFor(internal, parsed.activeInternal, pathname),
      activeSupplier: supplier ? activeIdFor(supplierTabs, parsed.activeSupplier, pathname) : (supplierTabs.find((tab) => tab.id === parsed.activeSupplier)?.id ?? supplierTabs[0]?.id ?? ""),
    };
  } catch {
    return base;
  }
}

function copyIndex(list: SectionTab[], tab: SectionTab) {
  const same = list.filter((item) => item.path === tab.path);
  if (same.length < 2) return 0;
  return same.findIndex((item) => item.id === tab.id) + 1;
}

function pathFor(list: SectionTab[], activeId: string, fallback: string) {
  return list.find((tab) => tab.id === activeId)?.path ?? list[0]?.path ?? fallback;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const navigate = useNavigate();
  const { state, replace, setFocus } = useProcurement();
  const { language, setLanguage, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tabs, setTabs] = useState<WorkspaceTabs>(() => tabsForPath(pathname));
  const [tabsReady, setTabsReady] = useState(false);
  const skipPathSync = useRef(false);
  const vendor = pathname.startsWith("/vendor");
  const openTabs = vendor ? tabs.supplier : tabs.internal;
  const activeId = vendor ? tabs.activeSupplier : tabs.activeInternal;
  useEffect(() => {
    if (vendor && state.persona !== "supplier") replace(setPersona(state, "supplier"));
    if (!vendor && state.persona === "supplier") replace(setPersona(state, "procurement-officer"));
  }, [vendor, state, replace]);
  useEffect(() => {
    setTabs(readTabs(pathname));
    setTabsReady(true);
    // The saved strip is restored once. Later route changes update it below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!tabsReady) return;
    if (skipPathSync.current) {
      skipPathSync.current = false;
      return;
    }
    setTabs((current) => {
      const list = vendor ? current.supplier : current.internal;
      const active = list.find((tab) => tab.id === (vendor ? current.activeSupplier : current.activeInternal));
      if (active?.path === pathname) return current;
      const existing = [...list].reverse().find((tab) => tab.path === pathname);
      if (existing) return vendor ? { ...current, activeSupplier: existing.id } : { ...current, activeInternal: existing.id };
      const tab = { id: tabId(), path: pathname };
      return vendor ? { ...current, supplier: [...list, tab], activeSupplier: tab.id } : { ...current, internal: [...list, tab], activeInternal: tab.id };
    });
  }, [pathname, tabsReady, vendor]);
  useEffect(() => {
    if (!tabsReady) return;
    sessionStorage.setItem(TABS_KEY, JSON.stringify(tabs));
  }, [tabs, tabsReady]);

  const openSection = (path: string) => {
    const tab = { id: tabId(), path };
    if (path !== pathname) skipPathSync.current = true;
    setTabs((current) => isSupplierPath(path)
      ? { ...current, supplier: [...current.supplier, tab], activeSupplier: tab.id }
      : { ...current, internal: [...current.internal, tab], activeInternal: tab.id });
  };

  const selectTab = (tab: SectionTab) => {
    if (tab.path !== pathname) skipPathSync.current = true;
    setTabs((current) => isSupplierPath(tab.path) ? { ...current, activeSupplier: tab.id } : { ...current, activeInternal: tab.id });
    if (tab.path !== pathname) void navigate({ to: tab.path as never });
  };

  const closeTab = (id: string) => {
    const list = vendor ? tabs.supplier : tabs.internal;
    if (list.length <= 1) return;
    const index = list.findIndex((tab) => tab.id === id);
    if (index < 0) return;
    const nextList = list.filter((tab) => tab.id !== id);
    const fallback = nextList[Math.min(index, nextList.length - 1)];
    if (!fallback) return;
    const closingActive = activeId === id;
    setTabs((current) => vendor
      ? { ...current, supplier: nextList, activeSupplier: closingActive ? fallback.id : current.activeSupplier }
      : { ...current, internal: nextList, activeInternal: closingActive ? fallback.id : current.activeInternal });
    if (closingActive && fallback.path !== pathname) {
      skipPathSync.current = true;
      void navigate({ to: fallback.path as never });
    }
  };
  const nav = vendor ? supplierNav : navigationGroups;
  const unread = state.notifications.filter((item) => !item.read).length;
  const hits = searchHits(state, query);
  const pages = nav.flatMap((group) => group.items).filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  const switchPersona = (persona: Persona) => {
    replace(setPersona(state, persona));
    const goingVendor = persona === "supplier";
    if (goingVendor === vendor) return;
    skipPathSync.current = true;
    void navigate({ to: (goingVendor ? pathFor(tabs.supplier, tabs.activeSupplier, "/vendor") : pathFor(tabs.internal, tabs.activeInternal, "/")) as never });
  };

  return (
    <div className="min-h-dvh bg-background">
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sm font-black text-sidebar-primary-foreground">PR</div>
          <div className="min-w-0"><p className="truncate text-sm font-bold">Procuria</p><p className="truncate text-[11px] text-sidebar-muted">Bangladesh Country Office</p></div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
          {nav.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase text-sidebar-muted">{t(group.label)}</p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] ?? Icons.Circle;
                  const active = item.to === "/" || item.to === "/vendor" ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
                  const badge = item.to === "/approvals" ? approvalQueue(state).length : "count" in item ? item.count : undefined;
                  return (
                    <li key={item.to}>
                      <Link to={item.to} {...(item.to === "/" || item.to === "/vendor" ? { activeOptions: { exact: true } } : {})} onClick={() => { openSection(item.to); setMobileOpen(false); }} className={cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground")}>
                        <Icon className="size-[18px] shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{t(item.label)}</span>
                        {"count" in item || item.to === "/approvals" ? badge ? <span className="rounded-full bg-sidebar-badge px-2 py-0.5 text-[11px] font-bold text-sidebar-foreground">{badge}</span> : null : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link to={(vendor ? pathFor(tabs.internal, tabs.activeInternal, "/") : pathFor(tabs.supplier, tabs.activeSupplier, "/vendor")) as never} onClick={() => { skipPathSync.current = true; replace(setPersona(state, vendor ? "procurement-officer" : "supplier")); }} className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground">
            <Icons.ArrowLeftRight className="size-[18px]" />{vendor ? "Internal portal" : t("Supplier portal")}
          </Link>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Icons.Menu className="size-5" /></Button>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-foreground">{vendor ? "Supplier workspace" : "Internal procurement workspace"}</p>
            <p className="text-xs text-muted-foreground">FY 2026–27</p>
          </div>
          <div className="col-start-3 flex items-center gap-1">
            <Button variant="ghost" size="sm" aria-label="Language" onClick={() => setLanguage(language === "en" ? "bn" : "en")}>{language === "en" ? "বাংলা" : "English"}</Button>
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Icons.Search className="size-5" /></Button>
            <Link to="/notifications" aria-label="Notifications" onClick={() => openSection("/notifications")} className="relative grid size-11 place-items-center rounded-md text-muted-foreground hover:bg-muted">
              <Icons.Bell className="size-5" />
              {unread > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="ml-2 hidden items-center gap-3 border-l border-border pl-4 sm:flex">
                  <div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-bold text-primary">{vendor ? "BM" : state.persona === "programme-manager" ? "NJ" : state.persona === "procurement-committee" ? "PC" : state.persona === "executive-director" ? "ED" : "NK"}</div>
                  <div className="text-left"><p className="text-xs font-semibold text-foreground">{actorName(state.persona)}</p><p className="text-[11px] text-muted-foreground">{vendor ? "Supplier account" : personaTitle(state.persona)}</p></div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => switchPersona("programme-manager")}>Nusrat Jahan · Programme manager</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchPersona("procurement-officer")}>Nabila Khan · Procurement officer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchPersona("procurement-committee")}>Procurement committee</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchPersona("executive-director")}>Executive Director</DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchPersona("supplier")}>Bengal Medical Supplies · Supplier</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <nav aria-label="Open sections" className="sticky top-16 z-20 flex gap-1 overflow-x-auto border-b border-border bg-muted/70 px-2">
          {openTabs.map((tab) => {
            const selected = tab.id === activeId;
            const index = copyIndex(openTabs, tab);
            const label = `${t(sectionLabels[tab.path] ?? "Page")}${index ? ` ${index}` : ""}`;
            return (
              <div key={tab.id} className={cn("flex h-11 shrink-0 items-center rounded-t-md border border-transparent", selected ? "border-border border-b-background bg-background text-foreground" : "text-muted-foreground")}>
                <button type="button" className="h-11 max-w-48 truncate px-3 text-sm font-medium" aria-current={selected ? "page" : undefined} onClick={() => selectTab(tab)}>{label}</button>
                {openTabs.length > 1 && <button type="button" aria-label={`Close ${label}`} className="mr-1 grid size-7 place-items-center rounded-md hover:bg-muted" onClick={() => closeTab(tab.id)}><Icons.X className="size-3.5" /></button>}
              </div>
            );
          })}
        </nav>
        <main key={activeId} className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>Find a page or a document by title or reference.</DialogDescription>
          </DialogHeader>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search requisitions, tenders, suppliers…" className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <ul className="max-h-80 space-y-1 overflow-y-auto">
            {query.trim().length >= 2 && pages.map((item) => (
              <li key={item.to}><Link to={item.to} className="block rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => { openSection(item.to); setSearchOpen(false); }}>{t(item.label)}<span className="ml-2 text-xs text-muted-foreground">Page</span></Link></li>
            ))}
            {hits.map((hit) => (
              <li key={hit.id}>
                <button type="button" className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted" onClick={() => { openSection(hit.to); if (hit.focus) setFocus(hit.focus); if (hit.to !== pathname) skipPathSync.current = true; void navigate({ to: hit.to as never }); setSearchOpen(false); setQuery(""); }}>
                  <span className="font-semibold">{hit.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{hit.detail}</span>
                </button>
              </li>
            ))}
            {query.trim().length >= 2 && pages.length === 0 && hits.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</li>}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
