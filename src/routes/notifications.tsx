import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, CheckCircle2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/procurement-ui";
import { formatDisplayDate, markAllNotificationsRead, markNotificationRead } from "@/lib/domain";
import { useProcurement } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Procuria" }, { name: "description", content: "Procurement alerts, deadlines and action reminders." }] }),
  component: Notifications,
});

function Notifications() {
  const { state, replace, setFocus } = useProcurement();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Deadlines, approvals and procurement updates requiring your attention." action={<Button variant="secondary" onClick={() => replace(markAllNotificationsRead(state))}>Mark all read</Button>} />
      <div className="rounded-md border border-border bg-card shadow-card">
        <ul className="divide-y divide-border">
          {state.notifications.map((item) => (
            <li key={item.id} className="flex gap-4 p-5">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">{item.read ? <CheckCircle2 className="size-5" /> : <Bell className="size-5" />}</div>
              <div className="min-w-0 flex-1">
                <button type="button" className="text-left text-sm font-semibold hover:underline" onClick={() => { replace(markNotificationRead(state, item.id)); const module = moduleFor(item.href); if (module !== "approvals") setFocus({ module, id: item.documentId }); void navigate({ to: item.href as never }); }}>{item.message}</button>
                <p className="mt-1 text-xs text-muted-foreground">{formatDisplayDate(item.createdAt)} · {item.read ? "Read" : "Unread"}</p>
              </div>
              {!item.read && <Button variant="ghost" size="sm" onClick={() => replace(markNotificationRead(state, item.id))}>Mark read</Button>}
            </li>
          ))}
          {state.notifications.length === 0 && <li className="p-6 text-sm text-muted-foreground">No notifications.</li>}
        </ul>
      </div>
      <Link to="/" className="sr-only">Home</Link>
    </div>
  );
}

function moduleFor(href: string) {
  if (href === "/vendor/tenders") return "vendor-tenders";
  if (href === "/vendor/bids") return "vendor-bids";
  if (href === "/vendor/orders" || href === "/vendor/deliveries") return "vendor-deliveries";
  if (href === "/vendor/invoices") return "vendor-invoices";
  if (href === "/vendor/company") return "vendor-company";
  if (href === "/approvals") return "approvals";
  return href.replace(/^\//, "") || "requisitions";
}
