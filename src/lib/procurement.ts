export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export type ProcurementRecord = {
  id: string;
  title: string;
  department: string;
  owner: string;
  value: number;
  date: string;
  status: string;
  tone: StatusTone;
  method?: string;
};

export const approvals: ProcurementRecord[] = [
  { id: "PR-2026-0148", title: "Emergency hygiene kits for flood response", department: "Humanitarian Response", owner: "Nusrat Jahan", value: 4850000, date: "06 Oct 2026", status: "Management approval", tone: "warning" },
  { id: "PR-2026-0142", title: "Solar systems for 12 field offices", department: "Operations", owner: "Mahmud Hasan", value: 7320000, date: "05 Oct 2026", status: "Finance review", tone: "info" },
  { id: "RFQ-2026-0087", title: "IT equipment for Dhaka programme office", department: "ICT", owner: "Tasnim Rahman", value: 2165000, date: "04 Oct 2026", status: "Procurement review", tone: "warning" },
  { id: "CON-2026-0031", title: "Community clinic construction — Kurigram", department: "Health Programme", owner: "Arif Hossain", value: 12400000, date: "02 Oct 2026", status: "Contract approval", tone: "info" },
];

export const tenders: ProcurementRecord[] = [
  { id: "OTM-2026-0042", title: "Supply of dignity kits for coastal districts", department: "Humanitarian Response", owner: "Farzana Islam", value: 18500000, date: "12 Oct 2026", status: "Published", tone: "success", method: "Open Tender" },
  { id: "RFP-2026-0019", title: "Baseline survey for livelihoods programme", department: "MEAL", owner: "Rakibul Karim", value: 3800000, date: "09 Oct 2026", status: "Evaluation", tone: "info", method: "RFP" },
  { id: "RFQ-2026-0091", title: "Winter blankets for northern districts", department: "Programmes", owner: "Sabrina Sultana", value: 6450000, date: "07 Oct 2026", status: "Closing soon", tone: "warning", method: "RFQ" },
  { id: "LTM-2026-0014", title: "Vehicle maintenance framework agreement", department: "Administration", owner: "Imran Ahmed", value: 2700000, date: "18 Oct 2026", status: "Draft", tone: "neutral", method: "Limited Tender" },
  { id: "OTM-2026-0038", title: "Construction of WASH facilities — Cox's Bazar", department: "WASH", owner: "Shafiq Alam", value: 24800000, date: "22 Oct 2026", status: "Published", tone: "success", method: "Open Tender" },
];

export const purchaseOrders: ProcurementRecord[] = [
  { id: "PO-2026-0216", title: "Medical consumables — Q4", department: "Health Programme", owner: "MediTrade Bangladesh Ltd.", value: 5650000, date: "08 Oct 2026", status: "Awaiting delivery", tone: "warning" },
  { id: "PO-2026-0209", title: "School learning materials", department: "Education", owner: "Bangla Stationers Ltd.", value: 3240000, date: "14 Oct 2026", status: "Partially received", tone: "info" },
  { id: "PO-2026-0197", title: "Field office furniture", department: "Operations", owner: "Navana Furniture Ltd.", value: 1890000, date: "28 Sep 2026", status: "Completed", tone: "success" },
];

export const suppliers: ProcurementRecord[] = [
  { id: "SUP-0182", title: "MediTrade Bangladesh Ltd.", department: "Medical supplies", owner: "Dhaka", value: 8, date: "Verified 18 Sep 2026", status: "Verified", tone: "success" },
  { id: "SUP-0114", title: "Bangla Stationers Ltd.", department: "Office & education", owner: "Dhaka", value: 12, date: "Verified 02 Aug 2026", status: "Verified", tone: "success" },
  { id: "SUP-0237", title: "Northern Relief Traders", department: "Emergency supplies", owner: "Rangpur", value: 3, date: "Submitted 29 Sep 2026", status: "Under review", tone: "warning" },
  { id: "SUP-0089", title: "GreenTech Solar Bangladesh", department: "Energy & electrical", owner: "Chattogram", value: 6, date: "Verified 15 Jul 2026", status: "Verified", tone: "success" },
];

export const moduleRecords: Record<string, ProcurementRecord[]> = {
  requisitions: approvals,
  plans: [
    { id: "APP-2026-HLT", title: "Health Programme Annual Procurement Plan", department: "Health Programme", owner: "Dr. Samira Haque", value: 68500000, date: "Jan–Dec 2026", status: "72% utilized", tone: "success" },
    { id: "APP-2026-WASH", title: "WASH Programme Procurement Plan", department: "WASH", owner: "Shafiq Alam", value: 44200000, date: "Jan–Dec 2026", status: "58% utilized", tone: "info" },
  ],
  surveys: tenders.slice(1, 4), evaluations: tenders.slice(0, 3), suppliers,
  "purchase-orders": purchaseOrders, contracts: purchaseOrders.slice(0, 2), receiving: purchaseOrders,
  inventory: purchaseOrders.slice(1), payments: purchaseOrders, reports: tenders, audit: approvals,
};

export const formatBDT = (value: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(value);

export const navigationGroups = [
  { label: "Workspace", items: [{ label: "Dashboard", to: "/", icon: "LayoutDashboard" }, { label: "Approvals", to: "/approvals", icon: "BadgeCheck", count: 7 }] },
  { label: "Procurement", items: [{ label: "Requisitions", to: "/requisitions", icon: "ClipboardList" }, { label: "Plans", to: "/plans", icon: "CalendarRange" }, { label: "Market surveys", to: "/surveys", icon: "ChartNoAxesCombined" }, { label: "Tenders", to: "/tenders", icon: "FileSearch" }, { label: "Evaluations", to: "/evaluations", icon: "Scale" }] },
  { label: "Supply chain", items: [{ label: "Suppliers", to: "/suppliers", icon: "Building2" }, { label: "Purchase orders", to: "/purchase-orders", icon: "ShoppingCart" }, { label: "Contracts", to: "/contracts", icon: "FileSignature" }, { label: "Receiving", to: "/receiving", icon: "PackageCheck" }, { label: "Inventory", to: "/inventory", icon: "Warehouse" }, { label: "Invoices & payments", to: "/payments", icon: "ReceiptText" }] },
  { label: "Oversight", items: [{ label: "Reports", to: "/reports", icon: "BarChart3" }, { label: "Audit trail", to: "/audit", icon: "ScrollText" }] },
] as const;

export const moduleDefinitions = {
  requisitions: { title: "Purchase requisitions", description: "Create, review and track procurement requirements across programmes.", singular: "requisition", action: "New requisition" },
  plans: { title: "Procurement plans", description: "Monitor annual and project procurement plans against approved budgets.", singular: "plan", action: "New plan" },
  surveys: { title: "Market surveys", description: "Compare quotations, historical prices and supplier offers.", singular: "survey", action: "New survey" },
  tenders: { title: "Tender management", description: "Manage sourcing events from draft through publication and award.", singular: "tender", action: "Create tender" },
  evaluations: { title: "Tender evaluations", description: "Coordinate compliant technical and financial evaluation workflows.", singular: "evaluation", action: "Start evaluation" },
  suppliers: { title: "Suppliers", description: "Verify, classify and monitor supplier performance and compliance.", singular: "supplier", action: "Invite supplier" },
  "purchase-orders": { title: "Purchase orders", description: "Track commitments, delivery schedules and order fulfilment.", singular: "purchase order", action: "Create PO" },
  contracts: { title: "Contracts", description: "Manage contract values, milestones, deliverables and renewals.", singular: "contract", action: "New contract" },
  receiving: { title: "Delivery & receiving", description: "Record deliveries, quality inspections and goods received notes.", singular: "delivery", action: "Record receipt" },
  inventory: { title: "Inventory", description: "Monitor stock levels, movements, issues and warehouse locations.", singular: "stock item", action: "New movement" },
  payments: { title: "Invoices & payments", description: "Verify supplier invoices against purchase orders and receipts.", singular: "invoice", action: "Record invoice" },
  reports: { title: "Reports & analytics", description: "Analyze expenditure, cycle time, savings and budget utilization.", singular: "report", action: "Export report" },
  audit: { title: "Audit trail", description: "Review a complete history of procurement actions and changes.", singular: "event", action: "Export log" },
};