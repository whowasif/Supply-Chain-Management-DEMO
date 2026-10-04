# Enterprise E-Procurement & Supply Chain System

## Goal
Build a polished, presentation-ready frontend for a Bangladesh-based NGO procurement operation, covering the full internal procurement lifecycle and a distinct supplier portal. Use credible local data, role-aware navigation, responsive layouts, and reusable enterprise controls. The first release will use structured mock services so a real backend can replace them later.

## Product structure
- Create a shared authenticated application shell with a compact desktop sidebar, mobile navigation, organization switcher, global search, notifications, and user menu.
- Add an internal dashboard with spend and budget summaries, pending approval queue, active tenders, delivery deadlines, supplier metrics, recent activity, and procurement pipeline.
- Add dedicated routes for requisitions, procurement plans, market surveys, tenders, evaluations, suppliers, purchase orders, contracts, receiving, inventory, invoices/payments, reports, notifications, and audit logs.
- Add a separate supplier portal experience with tender discovery, bid status, awarded contracts, purchase orders, delivery obligations, invoices, and payment tracking.
- Provide useful detail views and core interactions: filtering, sorting, pagination, contextual actions, status transitions, approval dialog, creation form, mobile table alternatives, empty/error/loading states, and success feedback.

## Visual direction
- Use a restrained government/NGO enterprise style: deep teal navigation, crisp neutral work surfaces, strong navy typography, green success, amber warning, and red destructive states.
- Favor dense but readable information hierarchy, squared 6px surfaces, restrained shadows, compact charts, and consistent 44px controls.
- Use a Bengali institutional context without decorative clichés: BDT currency, Dhaka-based projects, realistic departments, suppliers, procurement IDs, and dates.
- Keep motion limited to navigation, overlays, and state changes, with reduced-motion support.

## Architecture
- Organize reusable shell, page-header, metric, status, table, filter, dialog, skeleton, empty, and error components separately from pages.
- Keep domain types, realistic mock records, formatting helpers, and asynchronous mock service functions outside UI components.
- Use TanStack routes for every major module and detail view, with unique metadata on each content route.
- Model role visibility and permissions in one centralized policy layer; clearly treat frontend checks as presentation only until a secure backend is connected.
- Keep all styling in a semantic Tailwind v4 token system and use accessible Radix/shadcn-style primitives for menus, dialogs, tooltips, and selects.

## Verification
- Validate key workflows in the browser: dashboard navigation, search/filtering, approval action, requisition creation, tender detail, and switching to the supplier portal.
- Check desktop and mobile layouts, including table-to-card behavior and menu usability.
- Check keyboard access, labels, focus treatment, heading structure, contrast, tap targets, loading/empty/error states, and preview build health.

## Scope boundary
- This milestone delivers a comprehensive interactive frontend with mock data. Real authentication, persistent records, document storage, notifications, and backend authorization remain ready for later Lovable Cloud integration rather than being simulated as secure production services.
