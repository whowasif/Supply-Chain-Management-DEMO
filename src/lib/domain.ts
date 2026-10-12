import { formatBDT, type ProcurementRecord, type StatusTone } from "@/lib/procurement";
import { bandForValue, methodIsWeaker, OPEN_TENDER_FLOOR, roleLabel, TDS_RATE, VAT_RATE, type ApprovalRole } from "@/lib/policy";

export { formatBDT };

export const INTERNAL_ACTOR = "Nabila Khan";
export const SUPPLIER_ACCOUNT = "Bengal Medical Supplies Ltd.";
export const STORAGE_KEY = "procuria.demo.v2";

export const DEPARTMENTS = [
  "Humanitarian Response",
  "Health Programme",
  "Operations",
  "WASH",
  "Education",
  "ICT",
  "MEAL",
  "Programmes",
  "Administration",
] as const;

export const METHODS = ["RFQ", "Open tender", "Limited tender", "Direct"] as const;
export const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;
export const PROGRAMMES = ["Health", "WASH", "Humanitarian", "Education", "Livelihoods", "Operations"] as const;

export type Method = (typeof METHODS)[number];
export type Persona = ApprovalRole | "supplier";
export type ItemCategory = "Consumable" | "Medicine" | "Equipment" | "Vehicle";
export type AssetCondition = "Good" | "Needs repair" | "Unserviceable";
export type PaperKind = "Tender document" | "Opening minute" | "Challan" | "Evaluation minute" | "Corrigendum";

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  specification: string;
  category: ItemCategory;
};

export type PlanLine = {
  id: string;
  description: string;
  quarter: (typeof QUARTERS)[number];
  estimatedValue: number;
  method: Method;
};

export type Quote = {
  id: string;
  supplierName: string;
  unitPrice: number;
  leadTimeDays: number;
  validUntil: string;
};

export type Milestone = {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
};

export type RequisitionStatus = "Draft" | "Submitted" | "Returned" | "Approved" | "Rejected";

export type Project = {
  id: string;
  name: string;
  donor: string;
  budgetHead: string;
  department: string;
};

export type StoreLocation = {
  id: string;
  name: string;
  kind: "Central" | "Hospital" | "Field";
};

export type Requisition = {
  id: string;
  title: string;
  programme: string;
  department: string;
  requester: string;
  needBy: string;
  projectId: string;
  justification: string;
  method: Method;
  methodJustification: string;
  awaitingRole?: ApprovalRole;
  status: RequisitionStatus;
  returnComment?: string;
  lines: LineItem[];
  updatedAt: string;
};

export type Plan = {
  id: string;
  title: string;
  fiscalYear: string;
  programme: string;
  department: string;
  owner: string;
  budgetCeiling: number;
  status: "Draft" | "Active" | "Closed";
  lines: PlanLine[];
  updatedAt: string;
};

export type Survey = {
  id: string;
  title: string;
  requisitionId: string;
  department: string;
  owner: string;
  recommendation: string;
  status: "Draft" | "Completed";
  quotes: Quote[];
  updatedAt: string;
};

export type TenderStatus = "Draft" | "Published" | "Evaluation" | "Awarded" | "Closed";

export type Clarification = {
  id: string;
  question: string;
  answer: string;
  askedAt: string;
  answeredAt: string;
};

export type Tender = {
  id: string;
  title: string;
  method: Method;
  requisitionId: string;
  department: string;
  owner: string;
  publishDate: string;
  closingDate: string;
  eligibility: string;
  projectId: string;
  status: TenderStatus;
  lines: LineItem[];
  openingMinute: OpeningMinute | null;
  papers: Paper[];
  documentFee: number;
  tenderSecurity: number;
  clarifications: Clarification[];
  updatedAt: string;
};

export type OpeningMinute = {
  date: string;
  chair: string;
  members: string;
  note: string;
};

export type Paper = {
  id: string;
  kind: PaperKind;
  title: string;
  body: string;
  date: string;
};

export type Evaluation = {
  id: string;
  title: string;
  tenderId: string;
  bidder: string;
  technicalScore: number;
  financialScore: number;
  recommendation: string;
  committeeNote: string;
  status: "Draft" | "Awarded" | "Unsuccessful";
  department: string;
  owner: string;
  updatedAt: string;
};

export type Supplier = {
  id: string;
  legalName: string;
  tradeLicence: string;
  tin: string;
  bin: string;
  licenceExpiry: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  categories: string;
  district: string;
  contact: string;
  status: "Invited" | "Under review" | "Verified" | "Returned";
  returnComment: string;
  updatedAt: string;
};

export type PurchaseOrderStatus = "Draft" | "Issued" | "Partially received" | "Received" | "Closed";

export type PurchaseOrder = {
  id: string;
  title: string;
  sourceId: string;
  supplierId: string;
  supplierName: string;
  department: string;
  projectId: string;
  deliveryLocation: string;
  needBy: string;
  status: PurchaseOrderStatus;
  lines: LineItem[];
  updatedAt: string;
};

export type Contract = {
  id: string;
  title: string;
  supplierId: string;
  supplierName: string;
  purchaseOrderId: string;
  department: string;
  startDate: string;
  endDate: string;
  value: number;
  status: "Draft" | "Active" | "Expired";
  acceptance: "Pending" | "Accepted" | "Declined";
  performanceSecurity: string;
  milestones: Milestone[];
  updatedAt: string;
};

export type ReceiptLine = {
  lineId: string;
  description: string;
  ordered: number;
  previouslyReceived: number;
  receivedNow: number;
  batch: string;
  expiry: string;
};

export type GoodsReceipt = {
  id: string;
  purchaseOrderId: string;
  title: string;
  department: string;
  projectId: string;
  storeId: string;
  warehouse: string;
  quality: "Accepted" | "Accepted with remarks" | "Rejected";
  status: "Posted";
  challan: string;
  lines: ReceiptLine[];
  owner: string;
  updatedAt: string;
};

export type InventoryMovement = {
  id: string;
  item: string;
  storeId: string;
  warehouse: string;
  toStoreId: string;
  batch: string;
  expiry: string;
  projectId: string;
  movementType: "Receipt" | "Issue" | "Transfer";
  quantity: number;
  department: string;
  owner: string;
  status: "Posted";
  updatedAt: string;
  note: string;
};

export type StoreIssue = {
  id: string;
  storeId: string;
  destination: string;
  requestedBy: string;
  receivedBy: string;
  projectId: string;
  status: "Posted";
  lines: { item: string; batch: string; expiry: string; quantity: number; unit: string }[];
  updatedAt: string;
};

export type Asset = {
  id: string;
  tag: string;
  description: string;
  category: "Equipment" | "Vehicle";
  location: string;
  custodian: string;
  condition: AssetCondition;
  value: number;
  projectId: string;
  purchaseOrderId: string;
  updatedAt: string;
};

export type InvoiceStatus = "Draft" | "Submitted" | "Paid" | "Rejected";
export type InvoiceSource = "internal" | "supplier";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  title: string;
  supplierName: string;
  purchaseOrderId: string;
  receiptId: string;
  department: string;
  projectId: string;
  invoiceDate: string;
  mushakNumber: string;
  mushakDate: string;
  vatRate: number;
  tdsRate: number;
  status: InvoiceStatus;
  lines: LineItem[];
  source: InvoiceSource;
  returnComment?: string;
  updatedAt: string;
};

export type Bid = {
  id: string;
  tenderId: string;
  title: string;
  supplierName: string;
  validityDate: string;
  technicalNote: string;
  securityNote: string;
  declared: boolean;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Withdrawn";
  lines: LineItem[];
  updatedAt: string;
};

export type DeliveryConfirmation = {
  id: string;
  purchaseOrderId: string;
  title: string;
  supplierName: string;
  expectedDate: string;
  challan: string;
  status: "Confirmed";
  lines: { lineId: string; description: string; quantity: number }[];
  updatedAt: string;
};

export type AppNotification = {
  id: string;
  message: string;
  href: string;
  documentId: string;
  read: boolean;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  documentId: string;
  documentType: string;
  action: string;
  fromStatus: string;
  toStatus: string;
};

export type ProcurementState = {
  persona: Persona;
  projects: Project[];
  stores: StoreLocation[];
  requisitions: Requisition[];
  plans: Plan[];
  surveys: Survey[];
  tenders: Tender[];
  evaluations: Evaluation[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  contracts: Contract[];
  receipts: GoodsReceipt[];
  movements: InventoryMovement[];
  issues: StoreIssue[];
  assets: Asset[];
  invoices: Invoice[];
  bids: Bid[];
  deliveries: DeliveryConfirmation[];
  notifications: AppNotification[];
  audit: AuditEvent[];
  seq: number;
};

export type DomainResult = { ok: true; state: ProcurementState } | { ok: false; error: string };

type DraftOf<T, Drop extends keyof T = never> = Omit<T, Drop | "id"> & { id?: string };

export type FocusTarget = { module: string; id: string };

const fail = (error: string): DomainResult => ({ ok: false, error });
const ok = (state: ProcurementState): DomainResult => ({ ok: true, state });

export const lineTotal = (line: Pick<LineItem, "quantity" | "unitPrice">) => line.quantity * line.unitPrice;
export const linesTotal = (lines: Pick<LineItem, "quantity" | "unitPrice">[]) =>
  lines.reduce((sum, line) => sum + lineTotal(line), 0);

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(value: string) {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatCompactBDT(value: number) {
  if (value >= 10_000_000) return `৳ ${(value / 10_000_000).toFixed(2)} Cr`;
  if (value >= 100_000) return `৳ ${(value / 100_000).toFixed(2)} lakh`;
  return formatBDT(value);
}

export function toneFor(status: string): StatusTone {
  if (["Approved", "Verified", "Published", "Awarded", "Paid", "Received", "Active", "Posted", "Completed", "Confirmed"].includes(status)) return "success";
  if (["Submitted", "Under review", "Evaluation", "Partially received", "Invited", "Returned", "Closing soon"].includes(status)) return "warning";
  if (["Rejected", "Unsuccessful", "Expired", "Declined"].includes(status)) return "danger";
  if (["Issued", "Draft", "Withdrawn"].includes(status)) return status === "Issued" ? "info" : "neutral";
  return "info";
}

export function actorName(persona: Persona) {
  if (persona === "supplier") return SUPPLIER_ACCOUNT;
  if (persona === "programme-manager") return "Nusrat Jahan";
  if (persona === "procurement-committee") return "Procurement committee";
  if (persona === "executive-director") return "Executive Director";
  return INTERNAL_ACTOR;
}

export function personaTitle(persona: Persona) {
  if (persona === "supplier") return "Supplier account";
  return roleLabel(persona);
}

export function blankLine(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, unit: "Each", unitPrice: 0, specification: "", category: "Consumable" };
}

export function projectName(state: ProcurementState, projectId: string) {
  return state.projects.find((item) => item.id === projectId)?.name ?? projectId;
}

export function storeName(state: ProcurementState, storeId: string) {
  return state.stores.find((item) => item.id === storeId)?.name ?? storeId;
}

export function invoiceAmounts(lines: Pick<LineItem, "quantity" | "unitPrice">[]) {
  const subtotal = linesTotal(lines);
  const vat = Math.round(subtotal * VAT_RATE / 100);
  const tds = Math.round(subtotal * TDS_RATE / 100);
  return { subtotal, vat, tds, net: subtotal + vat - tds };
}

function allocate(state: ProcurementState, prefix: string) {
  const seq = state.seq + 1;
  return { state: { ...state, seq }, id: `${prefix}-2026-${String(seq).padStart(4, "0")}` };
}

function upsert<T extends { id: string }>(items: T[], item: T) {
  return items.some((entry) => entry.id === item.id) ? items.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...items];
}

function recordAudit(state: ProcurementState, event: Omit<AuditEvent, "id" | "at" | "actor">) {
  const allocated = allocate(state, "AUD");
  const entry: AuditEvent = { id: allocated.id, at: new Date().toISOString(), actor: actorName(state.persona), ...event };
  return { ...allocated.state, audit: [entry, ...allocated.state.audit] };
}

function notify(state: ProcurementState, message: string, href: string, documentId: string) {
  const allocated = allocate(state, "NTF");
  const item: AppNotification = { id: allocated.id, message, href, documentId, read: false, createdAt: new Date().toISOString() };
  return { ...allocated.state, notifications: [item, ...allocated.state.notifications] };
}

const seedLine = (id: string, description: string, quantity: number, unit: string, unitPrice: number, specification: string, category: ItemCategory = "Consumable"): LineItem => ({
  id, description, quantity, unit, unitPrice, specification, category,
});

export function createSeedState(): ProcurementState {
  const projects: Project[] = [
    { id: "PRJ-AMCGH", name: "AMCGH Hospital Pharmacy", donor: "Hospital fund", budgetHead: "HLT-PHARM-01", department: "Health Programme" },
    { id: "PRJ-DTC", name: "Drug Treatment Centre", donor: "Donor health grant", budgetHead: "HLT-DTC-04", department: "Health Programme" },
    { id: "PRJ-TVET", name: "Gazipur Training Centre", donor: "Skills development grant", budgetHead: "EDU-TVET-02", department: "Education" },
    { id: "PRJ-WASH", name: "Field WASH clinic", donor: "WASH consortium", budgetHead: "WASH-CLN-07", department: "WASH" },
  ];
  const stores: StoreLocation[] = [
    { id: "STR-CENTRAL", name: "Central Store, Dhanmondi", kind: "Central" },
    { id: "STR-AMCGH", name: "AMCGH Pharmacy, Uttara", kind: "Hospital" },
    { id: "STR-GAZIPUR", name: "Gazipur Training Centre Store", kind: "Field" },
  ];
  const requisitions: Requisition[] = [
    {
      id: "PR-2026-0180", title: "Training centre stationery", programme: "Education", department: "Education", requester: "Nusrat Jahan", needBy: "2026-10-25", projectId: "PRJ-TVET", justification: "Registers and pens for the current skills batch at Gazipur.", method: "Direct", methodJustification: "", awaitingRole: "programme-manager", status: "Submitted", updatedAt: "2026-10-10",
      lines: [seedLine("pr180-1", "Exercise register", 200, "Piece", 90, "80 pages")],
    },
    {
      id: "PR-2026-0142", title: "Solar systems for 12 field offices", programme: "Operations", department: "Operations", requester: "Mahmud Hasan", needBy: "2026-11-15", projectId: "PRJ-WASH", justification: "Field offices lose grid power for clinic cold-chain fridges.", method: "Open tender", methodJustification: "", awaitingRole: "executive-director", status: "Submitted", updatedAt: "2026-10-05",
      lines: [seedLine("pr142-1", "1.5 kW solar kit with battery", 12, "Set", 610000, "Panel, inverter, battery, installation", "Equipment")],
    },
  ];
  const plans: Plan[] = [
    {
      id: "APP-2026-HLT", title: "Health Programme Annual Procurement Plan", fiscalYear: "2026–27", programme: "Health", department: "Health Programme", owner: "Dr. Samira Haque", budgetCeiling: 68500000, status: "Active", updatedAt: "2026-01-15",
      lines: [
        { id: "app-hlt-1", description: "Essential medicines", quarter: "Q2", estimatedValue: 18000000, method: "Open tender" },
        { id: "app-hlt-2", description: "Clinic cold-chain equipment", quarter: "Q3", estimatedValue: 9600000, method: "Limited tender" },
      ],
    },
  ];
  const suppliers: Supplier[] = [
    { id: "SUP-0301", legalName: SUPPLIER_ACCOUNT, tradeLicence: "TRAD/DHK/2021/44821", tin: "339128476502", bin: "1234567890123", licenceExpiry: "2027-06-30", bankName: "Dutch-Bangla Bank", accountNumber: "1051234567890", routingNumber: "090261234", categories: "Medical supplies, hygiene kits", district: "Dhaka", contact: "tenders@bengalmedical.example", status: "Verified", returnComment: "", updatedAt: "2026-08-12" },
    { id: "SUP-0182", legalName: "MediTrade Bangladesh Ltd.", tradeLicence: "TRAD/DHK/2018/22011", tin: "228761904413", bin: "2234567890123", licenceExpiry: "2027-03-31", bankName: "BRAC Bank", accountNumber: "1502987654321", routingNumber: "060260284", categories: "Medical supplies", district: "Dhaka", contact: "sales@meditrade.example", status: "Verified", returnComment: "", updatedAt: "2026-09-18" },
    { id: "SUP-0114", legalName: "Bangla Stationers Ltd.", tradeLicence: "TRAD/DHK/2016/10228", tin: "119283746501", bin: "3234567890123", licenceExpiry: "2026-12-31", bankName: "City Bank", accountNumber: "2103344556677", routingNumber: "225260001", categories: "Office and education", district: "Dhaka", contact: "orders@banglastationers.example", status: "Verified", returnComment: "", updatedAt: "2026-08-02" },
  ];
  const tenders: Tender[] = [
    {
      id: "OTM-2026-0042", title: "Supply of dignity kits for coastal districts", method: "Open tender", requisitionId: "", department: "Humanitarian Response", owner: "Farzana Islam", publishDate: "2026-10-01", closingDate: "2026-10-20", eligibility: "Manufacturers or authorised distributors with a quality inspection report.", projectId: "PRJ-WASH", status: "Published", updatedAt: "2026-10-01",
      openingMinute: null,
      documentFee: 2000,
      tenderSecurity: 500000,
      clarifications: [{ id: "CLR-0042", question: "Are locally packed kits acceptable?", answer: "Yes, if the contents match the specification.", askedAt: "2026-10-02", answeredAt: "2026-10-03" }],
      papers: [
        { id: "PAP-0042", kind: "Tender document", title: "Dignity kit specification", body: "Sample tender paper. Kits follow the UNFPA contents list and are packed in Dhaka.", date: "2026-10-01" },
        { id: "PAP-0042-C", kind: "Corrigendum", title: "Pack size clarification", body: "Sample corrigendum. Each kit is packed as one carton.", date: "2026-10-04" },
      ],
      lines: [seedLine("t42-1", "Dignity kit", 12000, "Kit", 1450, "UNFPA-aligned contents")],
    },
    {
      id: "OTM-2026-0038", title: "ORS and zinc for AMCGH", method: "Limited tender", requisitionId: "", department: "Health Programme", owner: "Procurement committee", publishDate: "2026-09-01", closingDate: "2026-09-15", eligibility: "Verified medical suppliers with a valid trade licence.", projectId: "PRJ-AMCGH", status: "Awarded", updatedAt: "2026-09-18",
      openingMinute: { date: "2026-09-15", chair: "Procurement committee", members: "Procurement committee", note: "Sample opening minute. One bid was received and opened." },
      documentFee: 1000,
      tenderSecurity: 25000,
      clarifications: [],
      papers: [{ id: "PAP-0038", kind: "Tender document", title: "ORS and zinc specification", body: "Sample tender paper. WHO-listed ORS and dispersible zinc.", date: "2026-09-01" }],
      lines: [seedLine("t38-1", "ORS and zinc pack", 500, "Box", 180, "WHO-listed ORS with dispersible zinc", "Medicine")],
    },
  ];
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "PO-2026-0301", title: "Paracetamol for AMCGH pharmacy", sourceId: "", supplierId: "SUP-0301", supplierName: SUPPLIER_ACCOUNT, department: "Health Programme", projectId: "PRJ-AMCGH", deliveryLocation: "AMCGH Pharmacy, Uttara", needBy: "2026-10-20", status: "Received", updatedAt: "2026-10-08",
      lines: [seedLine("po301-1", "Paracetamol 500 mg tablets", 100, "Box", 82, "10x10 blister", "Medicine")],
    },
    {
      id: "PO-2026-0290", title: "Patient monitor for AMCGH", sourceId: "", supplierId: "SUP-0182", supplierName: "MediTrade Bangladesh Ltd.", department: "Health Programme", projectId: "PRJ-AMCGH", deliveryLocation: "AMCGH Pharmacy, Uttara", needBy: "2026-09-30", status: "Received", updatedAt: "2026-09-20",
      lines: [seedLine("po290-1", "Patient monitor", 1, "Each", 185000, "Bedside, with SpO2", "Equipment")],
    },
    {
      id: "PO-2026-0216", title: "Medical consumables — Q4", sourceId: "", supplierId: "SUP-0182", supplierName: "MediTrade Bangladesh Ltd.", department: "Health Programme", projectId: "PRJ-DTC", deliveryLocation: "Central Store, Dhanmondi", needBy: "2026-10-18", status: "Issued", updatedAt: "2026-10-01",
      lines: [seedLine("po216-1", "Examination gloves", 400, "Carton", 12000, "Nitrile, medium")],
    },
    {
      id: "PO-2026-0318", title: "ORS and zinc for AMCGH", sourceId: "OTM-2026-0038", supplierId: "SUP-0301", supplierName: SUPPLIER_ACCOUNT, department: "Health Programme", projectId: "PRJ-AMCGH", deliveryLocation: "AMCGH Pharmacy, Uttara", needBy: "2026-10-25", status: "Issued", updatedAt: "2026-09-20",
      lines: [seedLine("po318-1", "ORS and zinc pack", 500, "Box", 180, "WHO-listed ORS with dispersible zinc", "Medicine")],
    },
  ];
  const receipts: GoodsReceipt[] = [
    {
      id: "GRN-2026-0101", purchaseOrderId: "PO-2026-0301", title: "Paracetamol for AMCGH pharmacy", department: "Health Programme", projectId: "PRJ-AMCGH", storeId: "STR-AMCGH", warehouse: "AMCGH Pharmacy, Uttara", quality: "Accepted", status: "Posted", owner: "Nabila Khan", updatedAt: "2026-10-08",
      challan: "Supplier challan BMS-778. Two batches of paracetamol 500 mg. Cold chain is not required.",
      lines: [
        { lineId: "po301-1", description: "Paracetamol 500 mg tablets", ordered: 100, previouslyReceived: 0, receivedNow: 40, batch: "B-2411", expiry: "2026-12-15" },
        { lineId: "po301-1", description: "Paracetamol 500 mg tablets", ordered: 100, previouslyReceived: 0, receivedNow: 60, batch: "B-2506", expiry: "2027-06-30" },
      ],
    },
  ];
  const movements: InventoryMovement[] = [
    { id: "MOV-2026-0101", item: "Paracetamol 500 mg tablets", storeId: "STR-AMCGH", warehouse: "AMCGH Pharmacy, Uttara", toStoreId: "", batch: "B-2411", expiry: "2026-12-15", projectId: "PRJ-AMCGH", movementType: "Receipt", quantity: 40, department: "Health Programme", owner: "Nabila Khan", status: "Posted", updatedAt: "2026-10-08", note: "GRN-2026-0101" },
    { id: "MOV-2026-0102", item: "Paracetamol 500 mg tablets", storeId: "STR-AMCGH", warehouse: "AMCGH Pharmacy, Uttara", toStoreId: "", batch: "B-2506", expiry: "2027-06-30", projectId: "PRJ-AMCGH", movementType: "Receipt", quantity: 60, department: "Health Programme", owner: "Nabila Khan", status: "Posted", updatedAt: "2026-10-08", note: "GRN-2026-0101" },
    { id: "MOV-2026-0103", item: "Paracetamol 500 mg tablets", storeId: "STR-AMCGH", warehouse: "AMCGH Pharmacy, Uttara", toStoreId: "", batch: "B-2411", expiry: "2026-12-15", projectId: "PRJ-AMCGH", movementType: "Issue", quantity: 30, department: "Health Programme", owner: "Nabila Khan", status: "Posted", updatedAt: "2026-10-09", note: "ISV-2026-0007 Oncology ward" },
  ];
  const issues: StoreIssue[] = [
    {
      id: "ISV-2026-0007", storeId: "STR-AMCGH", destination: "Oncology ward", requestedBy: "Ward nurse station", receivedBy: "Oncology ward in-charge", projectId: "PRJ-AMCGH", status: "Posted", updatedAt: "2026-10-09",
      lines: [{ item: "Paracetamol 500 mg tablets", batch: "B-2411", expiry: "2026-12-15", quantity: 30, unit: "Box" }],
    },
  ];
  const assets: Asset[] = [
    { id: "AST-2026-0004", tag: "AST-2026-0004", description: "Patient monitor", category: "Equipment", location: "AMCGH Pharmacy, Uttara", custodian: "Hospital storekeeper", condition: "Good", value: 185000, projectId: "PRJ-AMCGH", purchaseOrderId: "PO-2026-0290", updatedAt: "2026-09-20" },
  ];
  const bids: Bid[] = [
    {
      id: "BID-2026-0014", tenderId: "OTM-2026-0042", title: "Supply of dignity kits for coastal districts", supplierName: SUPPLIER_ACCOUNT, validityDate: "2026-12-31", technicalNote: "Kits packed in Dhaka with a batch traceability sheet.", securityNote: "Pay order PO-77821, Dutch-Bangla Bank", declared: true, submittedAt: "2026-10-03T09:30:00.000Z", status: "Submitted", updatedAt: "2026-10-03",
      lines: [seedLine("bid14-1", "Dignity kit", 12000, "Kit", 1390, "UNFPA-aligned contents")],
    },
  ];
  const evaluations: Evaluation[] = [
    {
      id: "EVL-2026-0038", title: "ORS and zinc for AMCGH", tenderId: "OTM-2026-0038", bidder: SUPPLIER_ACCOUNT, technicalScore: 86, financialScore: 90, recommendation: "Single compliant bid within the estimate.", committeeNote: "Sample committee note for this demo.", status: "Awarded", department: "Health Programme", owner: "Procurement committee", updatedAt: "2026-09-18",
    },
  ];
  const contracts: Contract[] = [
    {
      id: "CON-2026-0038", title: "ORS and zinc for AMCGH", supplierId: "SUP-0301", supplierName: SUPPLIER_ACCOUNT, purchaseOrderId: "PO-2026-0318", department: "Health Programme", startDate: "2026-09-20", endDate: "2026-12-31", value: 90000, status: "Active", acceptance: "Pending", performanceSecurity: "Bank guarantee BG-441 for BDT 5,000. Sample security for this demo.", updatedAt: "2026-09-20",
      milestones: [{ id: "ms-0038", title: "Delivery of ORS and zinc", dueDate: "2026-10-25", amount: 90000 }],
    },
  ];
  const invoices: Invoice[] = [
    {
      id: "INV-2026-0101", invoiceNumber: "BMS-INV-1044", title: "Invoice · Paracetamol for AMCGH pharmacy", supplierName: SUPPLIER_ACCOUNT, purchaseOrderId: "PO-2026-0301", receiptId: "GRN-2026-0101", department: "Health Programme", projectId: "PRJ-AMCGH", invoiceDate: "2026-10-08", mushakNumber: "6.3-1044", mushakDate: "2026-10-08", vatRate: 15, tdsRate: 5, status: "Submitted", source: "supplier", updatedAt: "2026-10-08",
      lines: [seedLine("inv101-1", "Paracetamol 500 mg tablets", 100, "Box", 82, "10x10 blister", "Medicine")],
    },
  ];
  const notifications: AppNotification[] = [
    { id: "NTF-2026-0001", message: "Programme manager approval required for PR-2026-0180", href: "/approvals", documentId: "PR-2026-0180", read: false, createdAt: "2026-10-10T06:00:00.000Z" },
    { id: "NTF-2026-0002", message: "Executive Director approval required for PR-2026-0142", href: "/approvals", documentId: "PR-2026-0142", read: false, createdAt: "2026-10-10T04:00:00.000Z" },
    { id: "NTF-2026-0003", message: "Delivery due for PO-2026-0216", href: "/receiving", documentId: "PO-2026-0216", read: false, createdAt: "2026-10-09T08:00:00.000Z" },
  ];
  const audit: AuditEvent[] = [
    { id: "AUD-2026-0001", at: "2026-10-10T09:00:00.000Z", actor: "Nusrat Jahan", documentId: "PR-2026-0180", documentType: "requisition", action: "Submitted", fromStatus: "Draft", toStatus: "Submitted" },
    { id: "AUD-2026-0002", at: "2026-10-09T11:00:00.000Z", actor: "Nabila Khan", documentId: "ISV-2026-0007", documentType: "store issue", action: "Posted", fromStatus: "—", toStatus: "Posted" },
  ];
  return {
    persona: "programme-manager",
    projects, stores, requisitions, plans, surveys: [], tenders, evaluations, suppliers, purchaseOrders, contracts, receipts, movements, issues, assets, invoices, bids, deliveries: [], notifications, audit, seq: 500,
  };
}
export function normalizeState(state: ProcurementState): ProcurementState {
  return {
    ...state,
    suppliers: state.suppliers.map((item) => ({ ...item, bin: item.bin ?? "", licenceExpiry: item.licenceExpiry ?? "", bankName: item.bankName ?? "", accountNumber: item.accountNumber ?? "", routingNumber: item.routingNumber ?? "", returnComment: item.returnComment ?? "" })),
    tenders: state.tenders.map((item) => ({ ...item, documentFee: item.documentFee ?? 0, tenderSecurity: item.tenderSecurity ?? 0, clarifications: item.clarifications ?? [], papers: item.papers ?? [] })),
    bids: state.bids.map((item) => ({ ...item, securityNote: item.securityNote ?? "", submittedAt: item.submittedAt ?? "" })),
    contracts: state.contracts.map((item) => ({ ...item, acceptance: item.acceptance ?? "Pending", performanceSecurity: item.performanceSecurity ?? "" })),
    invoices: state.invoices.map((item) => ({ ...item, mushakNumber: item.mushakNumber ?? "", mushakDate: item.mushakDate ?? "" })),
    deliveries: state.deliveries.map((item) => ({ ...item, challan: item.challan ?? "" })),
  };
}

export function isProcurementState(value: unknown): value is ProcurementState {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ProcurementState>;
  const roles: Persona[] = ["programme-manager", "procurement-officer", "procurement-committee", "executive-director", "supplier"];
  return !!record.persona && roles.includes(record.persona) && Array.isArray(record.requisitions) && Array.isArray(record.purchaseOrders) && Array.isArray(record.projects) && Array.isArray(record.stores) && Array.isArray(record.issues) && Array.isArray(record.assets) && Array.isArray(record.audit) && typeof record.seq === "number";
}

export function setPersona(state: ProcurementState, persona: Persona): ProcurementState {
  return { ...state, persona };
}

export function saveRequisition(state: ProcurementState, input: DraftOf<Requisition, "status" | "updatedAt" | "returnComment" | "awaitingRole">, mode: "draft" | "submit"): DomainResult {
  const existing = input.id ? state.requisitions.find((item) => item.id === input.id) : undefined;
  if (input.id && !existing) return fail("Requisition was not found.");
  if (existing && existing.status !== "Draft" && existing.status !== "Returned") return fail("This requisition can only be edited while it is a draft or has been returned.");
  if (input.lines.length === 0) return fail("Add at least one line.");
  if (!state.projects.some((item) => item.id === input.projectId)) return fail("Choose a project, donor and budget head.");
  const band = bandForValue(linesTotal(input.lines));
  let method: Method = band.method;
  if (methodIsWeaker(input.method, band.method)) {
    if (!input.methodJustification.trim()) return fail(`Purchases of this value use ${band.method}. A less competitive method needs a written justification.`);
    method = input.method;
  }
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "PR");
    next = allocated.state;
    id = allocated.id;
  }
  if (mode === "submit" && band.method === "RFQ") {
    const quotes = next.surveys.filter((item) => item.requisitionId === id).flatMap((item) => item.quotes);
    if (quotes.length < 3) return fail("An RFQ at this value needs at least three supplier quotes on a market survey for this requisition.");
  }
  const status: RequisitionStatus = mode === "submit" ? "Submitted" : existing?.status === "Returned" ? "Returned" : "Draft";
  const requisition: Requisition = {
    id, title: input.title.trim(), programme: input.programme, department: input.department, requester: input.requester.trim(), needBy: input.needBy, projectId: input.projectId, justification: input.justification.trim(), method, methodJustification: input.methodJustification.trim(), status, lines: input.lines, updatedAt: todayIso(),
  };
  if (mode === "submit") requisition.awaitingRole = band.role;
  else if (existing?.awaitingRole) requisition.awaitingRole = existing.awaitingRole;
  if (existing?.returnComment && mode !== "submit") requisition.returnComment = existing.returnComment;
  next = { ...next, requisitions: upsert(next.requisitions, requisition) };
  next = recordAudit(next, { documentId: id, documentType: "requisition", action: mode === "submit" ? "Submitted" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  if (mode === "submit") next = notify(next, `${roleLabel(band.role)} approval required for ${id}`, "/approvals", id);
  return ok(next);
}

export function decideRequisition(state: ProcurementState, id: string, decision: "Approved" | "Rejected" | "Returned", comment?: string): DomainResult {
  const existing = state.requisitions.find((item) => item.id === id);
  if (!existing) return fail("Requisition was not found.");
  if (existing.status !== "Submitted") return fail("Only submitted requisitions can be approved, returned, or rejected.");
  if (!existing.awaitingRole || state.persona !== existing.awaitingRole) return fail(`This requisition is waiting for the ${existing.awaitingRole ? roleLabel(existing.awaitingRole) : "assigned approver"}.`);
  if (decision === "Returned" && !comment?.trim()) return fail("A comment is required when returning a requisition.");
  const updated: Requisition = { ...existing, status: decision, updatedAt: todayIso() };
  if (decision === "Returned" && comment?.trim()) updated.returnComment = comment.trim();
  let next = { ...state, requisitions: upsert(state.requisitions, updated) };
  next = recordAudit(next, { documentId: id, documentType: "requisition", action: decision, fromStatus: existing.status, toStatus: decision });
  next = notify(next, `${id} was ${decision.toLowerCase()}`, "/requisitions", id);
  return ok(next);
}

export function savePlan(state: ProcurementState, input: DraftOf<Plan, "status" | "updatedAt">, mode: "draft" | "activate"): DomainResult {
  const existing = input.id ? state.plans.find((item) => item.id === input.id) : undefined;
  if (input.lines.length === 0) return fail("Add at least one plan line.");
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "APP");
    next = allocated.state;
    id = allocated.id;
  }
  const status = mode === "activate" ? "Active" : existing?.status === "Active" ? "Active" : "Draft";
  const plan: Plan = { id, title: input.title.trim(), fiscalYear: input.fiscalYear.trim(), programme: input.programme, department: input.department, owner: input.owner.trim(), budgetCeiling: input.budgetCeiling, status, lines: input.lines, updatedAt: todayIso() };
  next = { ...next, plans: upsert(next.plans, plan) };
  next = recordAudit(next, { documentId: id, documentType: "plan", action: mode === "activate" ? "Activated" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  return ok(next);
}

export function saveSurvey(state: ProcurementState, input: DraftOf<Survey, "status" | "updatedAt">, mode: "draft" | "complete"): DomainResult {
  if (!state.requisitions.some((item) => item.id === input.requisitionId)) return fail("Choose a requisition for this survey.");
  if (input.quotes.length === 0) return fail("Add at least one supplier quote.");
  const existing = input.id ? state.surveys.find((item) => item.id === input.id) : undefined;
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "SRV");
    next = allocated.state;
    id = allocated.id;
  }
  const requisition = state.requisitions.find((item) => item.id === input.requisitionId);
  const status = mode === "complete" ? "Completed" : "Draft";
  const survey: Survey = { id, title: input.title.trim(), requisitionId: input.requisitionId, department: requisition?.department ?? input.department, owner: input.owner.trim(), recommendation: input.recommendation.trim(), status, quotes: input.quotes, updatedAt: todayIso() };
  next = { ...next, surveys: upsert(next.surveys, survey) };
  next = recordAudit(next, { documentId: id, documentType: "survey", action: mode === "complete" ? "Completed" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  return ok(next);
}

export function saveTender(state: ProcurementState, input: DraftOf<Tender, "status" | "updatedAt" | "papers" | "openingMinute" | "documentFee" | "tenderSecurity" | "clarifications"> & { documentFee?: number; tenderSecurity?: number }, mode: "draft" | "publish"): DomainResult {
  const existing = input.id ? state.tenders.find((item) => item.id === input.id) : undefined;
  if (existing && existing.status !== "Draft") return fail("Only draft tenders can be edited.");
  if (input.lines.length === 0) return fail("Add at least one lot.");
  if (mode === "publish" && input.closingDate < input.publishDate) return fail("The closing date must be on or after the publish date.");
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "OTM");
    next = allocated.state;
    id = allocated.id;
  }
  const status: TenderStatus = mode === "publish" ? "Published" : "Draft";
  const tender: Tender = {
    id, title: input.title.trim(), method: input.method, requisitionId: input.requisitionId, department: input.department, owner: input.owner.trim(), publishDate: input.publishDate, closingDate: input.closingDate, eligibility: input.eligibility.trim(), projectId: input.projectId, status, lines: input.lines, openingMinute: existing?.openingMinute ?? null, papers: existing?.papers ?? [], documentFee: input.documentFee ?? existing?.documentFee ?? 0, tenderSecurity: input.tenderSecurity ?? existing?.tenderSecurity ?? 0, clarifications: existing?.clarifications ?? [], updatedAt: todayIso(),
  };
  next = { ...next, tenders: upsert(next.tenders, tender) };
  next = recordAudit(next, { documentId: id, documentType: "tender", action: mode === "publish" ? "Published" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  if (mode === "publish") next = notify(next, `${id} is published`, "/vendor/tenders", id);
  return ok(next);
}

export function saveOpeningMinute(state: ProcurementState, tenderId: string, minute: OpeningMinute): DomainResult {
  const tender = state.tenders.find((item) => item.id === tenderId);
  if (!tender) return fail("Tender was not found.");
  if (!minute.date || !minute.chair.trim() || !minute.members.trim() || !minute.note.trim()) return fail("Enter the date, chair, members and minute.");
  const updated: Tender = { ...tender, openingMinute: { date: minute.date, chair: minute.chair.trim(), members: minute.members.trim(), note: minute.note.trim() }, updatedAt: todayIso() };
  let next = { ...state, tenders: upsert(state.tenders, updated) };
  next = recordAudit(next, { documentId: tenderId, documentType: "tender", action: "Opening minute", fromStatus: tender.status, toStatus: tender.status });
  return ok(next);
}

export function saveTenderPaper(state: ProcurementState, tenderId: string, paper: Omit<Paper, "id"> & { id?: string }): DomainResult {
  const tender = state.tenders.find((item) => item.id === tenderId);
  if (!tender) return fail("Tender was not found.");
  if (!paper.title.trim() || !paper.body.trim()) return fail("Enter a title and the paper text.");
  const nextPaper: Paper = { id: paper.id ?? `PAP-${crypto.randomUUID().slice(0, 8)}`, kind: paper.kind, title: paper.title.trim(), body: paper.body.trim(), date: paper.date || todayIso() };
  const papers = paper.id ? tender.papers.map((item) => item.id === paper.id ? nextPaper : item) : [nextPaper, ...tender.papers];
  let next = { ...state, tenders: upsert(state.tenders, { ...tender, papers, updatedAt: todayIso() }) };
  next = recordAudit(next, { documentId: tenderId, documentType: "tender", action: `Paper · ${paper.kind}`, fromStatus: tender.status, toStatus: tender.status });
  return ok(next);
}

function tenderStillOpen(tender: Tender) {
  return (tender.status === "Published" || tender.status === "Evaluation") && tender.closingDate >= todayIso();
}

export function askClarification(state: ProcurementState, tenderId: string, question: string): DomainResult {
  if (state.persona !== "supplier") return fail("Only a supplier can ask a clarification.");
  const tender = state.tenders.find((item) => item.id === tenderId);
  if (!tender) return fail("Tender was not found.");
  if (!tenderStillOpen(tender)) return fail("Clarifications can be asked only while the tender is open.");
  if (!question.trim()) return fail("Enter the question.");
  const clarification: Clarification = { id: `CLR-${crypto.randomUUID().slice(0, 8)}`, question: question.trim(), answer: "", askedAt: todayIso(), answeredAt: "" };
  let next = { ...state, tenders: upsert(state.tenders, { ...tender, clarifications: [clarification, ...tender.clarifications], updatedAt: todayIso() }) };
  next = recordAudit(next, { documentId: tenderId, documentType: "tender", action: "Clarification asked", fromStatus: tender.status, toStatus: tender.status });
  next = notify(next, `${SUPPLIER_ACCOUNT} asked a clarification on ${tenderId}`, "/tenders", tenderId);
  return ok(next);
}

export function answerClarification(state: ProcurementState, tenderId: string, clarificationId: string, answer: string): DomainResult {
  if (state.persona === "supplier") return fail("The buyer answers clarifications.");
  const tender = state.tenders.find((item) => item.id === tenderId);
  if (!tender) return fail("Tender was not found.");
  const existing = tender.clarifications.find((item) => item.id === clarificationId);
  if (!existing) return fail("Clarification was not found.");
  if (!answer.trim()) return fail("Enter the answer.");
  const clarifications = tender.clarifications.map((item) => item.id === clarificationId ? { ...item, answer: answer.trim(), answeredAt: todayIso() } : item);
  let next = { ...state, tenders: upsert(state.tenders, { ...tender, clarifications, updatedAt: todayIso() }) };
  next = recordAudit(next, { documentId: tenderId, documentType: "tender", action: "Clarification answered", fromStatus: tender.status, toStatus: tender.status });
  next = notify(next, `A clarification on ${tenderId} has been answered`, "/vendor/tenders", tenderId);
  return ok(next);
}

export function saveEvaluation(state: ProcurementState, input: DraftOf<Evaluation, "status" | "updatedAt" | "department">, result?: "Awarded" | "Unsuccessful"): DomainResult {
  const tender = state.tenders.find((item) => item.id === input.tenderId);
  if (!tender) return fail("Choose a tender to evaluate.");
  if (tender.status === "Draft") return fail("Publish the tender before recording an evaluation.");
  if (result === "Awarded" && linesTotal(tender.lines) > OPEN_TENDER_FLOOR && !input.committeeNote.trim()) return fail("Record the committee minute before awarding a purchase above the open-tender ceiling.");
  const existing = input.id ? state.evaluations.find((item) => item.id === input.id) : undefined;
  if (existing && existing.status !== "Draft") return fail("A recorded evaluation result cannot be edited.");
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "EVL");
    next = allocated.state;
    id = allocated.id;
  }
  const status = result ?? "Draft";
  const evaluation: Evaluation = { id, title: input.title.trim() || tender.title, tenderId: input.tenderId, bidder: input.bidder.trim(), technicalScore: input.technicalScore, financialScore: input.financialScore, recommendation: input.recommendation.trim(), committeeNote: input.committeeNote.trim(), status, department: tender.department, owner: input.owner.trim(), updatedAt: todayIso() };
  next = { ...next, evaluations: upsert(next.evaluations, evaluation) };
  if (result === "Awarded") {
    next = { ...next, tenders: next.tenders.map((item) => item.id === tender.id ? { ...item, status: "Awarded", updatedAt: todayIso() } : item) };
  } else if (!result && tender.status === "Published") {
    next = { ...next, tenders: next.tenders.map((item) => item.id === tender.id ? { ...item, status: "Evaluation", updatedAt: todayIso() } : item) };
  }
  next = recordAudit(next, { documentId: id, documentType: "evaluation", action: result ? `Recorded ${result}` : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  return ok(next);
}

export function createPoFromAward(state: ProcurementState, evaluationId: string): DomainResult {
  const evaluation = state.evaluations.find((item) => item.id === evaluationId);
  if (!evaluation || evaluation.status !== "Awarded") return fail("Only an awarded evaluation can be turned into a purchase order.");
  const tender = state.tenders.find((item) => item.id === evaluation.tenderId);
  if (!tender) return fail("The awarded tender was not found.");
  if (state.purchaseOrders.some((item) => item.sourceId === tender.id)) return fail("A purchase order already exists for this tender.");
  const supplier = state.suppliers.find((item) => item.legalName === evaluation.bidder);
  const allocated = allocate(state, "PO");
  const purchaseOrder: PurchaseOrder = {
    id: allocated.id, title: tender.title, sourceId: tender.id, supplierId: supplier?.id ?? "", supplierName: evaluation.bidder, department: tender.department, projectId: tender.projectId, deliveryLocation: state.stores[0]?.name ?? "Central store", needBy: tender.closingDate, status: "Draft", updatedAt: todayIso(),
    lines: tender.lines.map((line) => ({ ...line, id: crypto.randomUUID() })),
  };
  let next = { ...allocated.state, purchaseOrders: upsert(allocated.state.purchaseOrders, purchaseOrder) };
  next = recordAudit(next, { documentId: allocated.id, documentType: "purchase order", action: "Created from award", fromStatus: "Awarded", toStatus: "Draft" });
  return ok(next);
}

export function saveSupplier(state: ProcurementState, input: DraftOf<Supplier, "status" | "updatedAt" | "returnComment"> & { returnComment?: string }, status: Supplier["status"]): DomainResult {
  if (status === "Returned" && !input.returnComment?.trim()) return fail("A comment is required when returning a supplier.");
  const existing = input.id ? state.suppliers.find((item) => item.id === input.id) : undefined;
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "SUP");
    next = allocated.state;
    id = allocated.id;
  }
  const supplier: Supplier = { id, legalName: input.legalName.trim(), tradeLicence: input.tradeLicence.trim(), tin: input.tin.trim(), bin: input.bin.trim(), licenceExpiry: input.licenceExpiry, bankName: input.bankName.trim(), accountNumber: input.accountNumber.trim(), routingNumber: input.routingNumber.trim(), categories: input.categories.trim(), district: input.district.trim(), contact: input.contact.trim(), status, returnComment: status === "Returned" ? (input.returnComment ?? "").trim() : "", updatedAt: todayIso() };
  next = { ...next, suppliers: upsert(next.suppliers, supplier) };
  next = recordAudit(next, { documentId: id, documentType: "supplier", action: status, fromStatus: existing?.status ?? "New", toStatus: status });
  if (status === "Verified" || status === "Returned") next = notify(next, `${supplier.legalName} is ${status === "Verified" ? "verified" : "returned for correction"}`, "/vendor/company", id);
  return ok(next);
}

export function saveSupplierProfile(state: ProcurementState, input: Pick<Supplier, "tradeLicence" | "tin" | "bin" | "licenceExpiry" | "bankName" | "accountNumber" | "routingNumber" | "categories" | "district" | "contact">): DomainResult {
  if (state.persona !== "supplier") return fail("Only the supplier account can update this company file.");
  const existing = state.suppliers.find((item) => item.legalName === SUPPLIER_ACCOUNT);
  if (!existing) return fail("The supplier account was not found.");
  if (!/^\d{13}$/.test(input.bin.trim())) return fail("Enter the 13-digit BIN.");
  if (!input.tradeLicence.trim() || !input.tin.trim() || !input.licenceExpiry || !input.bankName.trim() || !input.accountNumber.trim() || !input.routingNumber.trim()) return fail("Complete the licence, TIN, bank account and routing number.");
  const supplier: Supplier = { ...existing, tradeLicence: input.tradeLicence.trim(), tin: input.tin.trim(), bin: input.bin.trim(), licenceExpiry: input.licenceExpiry, bankName: input.bankName.trim(), accountNumber: input.accountNumber.trim(), routingNumber: input.routingNumber.trim(), categories: input.categories.trim(), district: input.district.trim(), contact: input.contact.trim(), status: "Under review", returnComment: "", updatedAt: todayIso() };
  let next = { ...state, suppliers: upsert(state.suppliers, supplier) };
  next = recordAudit(next, { documentId: existing.id, documentType: "supplier", action: "Submitted for review", fromStatus: existing.status, toStatus: "Under review" });
  next = notify(next, `${SUPPLIER_ACCOUNT} submitted its company file for review`, "/suppliers", existing.id);
  return ok(next);
}

export function savePurchaseOrder(state: ProcurementState, input: DraftOf<PurchaseOrder, "status" | "updatedAt">, mode: "draft" | "issue"): DomainResult {
  const existing = input.id ? state.purchaseOrders.find((item) => item.id === input.id) : undefined;
  if (existing && existing.status !== "Draft") return fail("Only draft purchase orders can be edited.");
  if (input.lines.length === 0) return fail("Add at least one line.");
  if (!input.supplierName.trim()) return fail("Choose a supplier.");
  if (!state.projects.some((item) => item.id === input.projectId)) return fail("Choose a project, donor and budget head.");
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "PO");
    next = allocated.state;
    id = allocated.id;
  }
  const status: PurchaseOrderStatus = mode === "issue" ? "Issued" : "Draft";
  const purchaseOrder: PurchaseOrder = { id, title: input.title.trim(), sourceId: input.sourceId, supplierId: input.supplierId, supplierName: input.supplierName, department: input.department, projectId: input.projectId, deliveryLocation: input.deliveryLocation.trim(), needBy: input.needBy, status, lines: input.lines, updatedAt: todayIso() };
  next = { ...next, purchaseOrders: upsert(next.purchaseOrders, purchaseOrder) };
  next = recordAudit(next, { documentId: id, documentType: "purchase order", action: mode === "issue" ? "Issued" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  if (mode === "issue") next = notify(next, `${id} has been issued`, "/vendor/deliveries", id);
  return ok(next);
}

export function saveContract(state: ProcurementState, input: DraftOf<Contract, "status" | "updatedAt" | "acceptance" | "performanceSecurity"> & { performanceSecurity?: string }, mode: "draft" | "activate"): DomainResult {
  if (input.endDate < input.startDate) return fail("The contract end date must be on or after the start date.");
  const existing = input.id ? state.contracts.find((item) => item.id === input.id) : undefined;
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "CON");
    next = allocated.state;
    id = allocated.id;
  }
  const status = mode === "activate" ? "Active" : "Draft";
  const contract: Contract = { id, title: input.title.trim(), supplierId: input.supplierId, supplierName: input.supplierName, purchaseOrderId: input.purchaseOrderId, department: input.department, startDate: input.startDate, endDate: input.endDate, value: input.value, status, acceptance: existing?.acceptance ?? "Pending", performanceSecurity: (input.performanceSecurity ?? existing?.performanceSecurity ?? "").trim(), milestones: input.milestones, updatedAt: todayIso() };
  next = { ...next, contracts: upsert(next.contracts, contract) };
  next = recordAudit(next, { documentId: id, documentType: "contract", action: mode === "activate" ? "Activated" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  return ok(next);
}

export function respondToContract(state: ProcurementState, contractId: string, decision: "Accepted" | "Declined"): DomainResult {
  if (state.persona !== "supplier") return fail("Only the supplier can accept or decline a contract.");
  const contract = state.contracts.find((item) => item.id === contractId);
  if (!contract || contract.supplierName !== SUPPLIER_ACCOUNT) return fail("This contract belongs to another supplier.");
  if (contract.acceptance !== "Pending") return fail("This contract has already been answered.");
  if (decision === "Accepted" && contract.status !== "Active") return fail("Only an active contract can be accepted.");
  const updated: Contract = { ...contract, acceptance: decision, updatedAt: todayIso() };
  let next = { ...state, contracts: upsert(state.contracts, updated) };
  next = recordAudit(next, { documentId: contract.id, documentType: "contract", action: decision, fromStatus: "Pending", toStatus: decision });
  next = notify(next, `${SUPPLIER_ACCOUNT} ${decision === "Accepted" ? "accepted" : "declined"} ${contract.id}`, "/contracts", contract.id);
  return ok(next);
}

export function billMilestone(state: ProcurementState, contractId: string, milestoneId: string): DomainResult {
  if (state.persona !== "supplier") return fail("Only the supplier can bill a milestone.");
  const contract = state.contracts.find((item) => item.id === contractId);
  if (!contract || contract.supplierName !== SUPPLIER_ACCOUNT) return fail("This contract belongs to another supplier.");
  if (contract.acceptance !== "Accepted") return fail("Accept the contract before billing a milestone.");
  const milestone = contract.milestones.find((item) => item.id === milestoneId);
  if (!milestone) return fail("Milestone was not found.");
  const order = state.purchaseOrders.find((item) => item.id === contract.purchaseOrderId);
  if (!order) return fail("This contract has no purchase order to bill against.");
  const title = `Milestone · ${milestone.title}`;
  if (state.invoices.some((item) => item.purchaseOrderId === order.id && item.title === title)) return fail("A bill for this milestone already exists.");
  return saveInvoice(state, {
    invoiceNumber: `MS-${contract.id}`,
    title,
    supplierName: contract.supplierName,
    purchaseOrderId: order.id,
    receiptId: "",
    department: contract.department,
    projectId: order.projectId,
    invoiceDate: todayIso(),
    mushakNumber: "",
    mushakDate: "",
    lines: [{ id: crypto.randomUUID(), description: milestone.title, quantity: 1, unit: "Milestone", unitPrice: milestone.amount, specification: contract.title, category: "Consumable" }],
  }, "draft");
}

export function quantityReceived(state: ProcurementState, purchaseOrderId: string, lineId: string) {
  return state.receipts
    .filter((receipt) => receipt.purchaseOrderId === purchaseOrderId && receipt.quality !== "Rejected")
    .flatMap((receipt) => receipt.lines)
    .filter((line) => line.lineId === lineId)
    .reduce((sum, line) => sum + line.receivedNow, 0);
}

export function postGoodsReceipt(state: ProcurementState, input: { purchaseOrderId: string; storeId: string; quality: GoodsReceipt["quality"]; challan?: string; lines: { lineId: string; receivedNow: number; batch?: string; expiry?: string }[] }): DomainResult {
  const purchaseOrder = state.purchaseOrders.find((item) => item.id === input.purchaseOrderId);
  if (!purchaseOrder) return fail("Choose a purchase order.");
  if (purchaseOrder.status === "Draft" || purchaseOrder.status === "Closed") return fail("Goods can only be received against an issued purchase order.");
  const store = state.stores.find((item) => item.id === input.storeId);
  if (!store) return fail("Choose the receiving store.");
  if (input.lines.every((line) => line.receivedNow <= 0)) return fail("Enter a quantity received for at least one line.");
  const running = new Map<string, number>();
  const lines: ReceiptLine[] = [];
  for (const entry of input.lines) {
    const source = purchaseOrder.lines.find((line) => line.id === entry.lineId);
    if (!source) return fail("A receipt line does not belong to this purchase order.");
    if (entry.receivedNow < 0) return fail("Received quantity cannot be negative.");
    if (entry.receivedNow > 0 && source.category === "Medicine" && (!entry.batch?.trim() || !entry.expiry)) return fail(`Enter a batch number and expiry date for ${source.description}.`);
    const previouslyReceived = quantityReceived(state, purchaseOrder.id, source.id);
    const alreadyInThisReceipt = running.get(source.id) ?? 0;
    if (input.quality !== "Rejected" && previouslyReceived + alreadyInThisReceipt + entry.receivedNow > source.quantity) {
      return fail(`${source.description} would exceed the ordered quantity of ${source.quantity} ${source.unit}. ${previouslyReceived} already received.`);
    }
    running.set(source.id, alreadyInThisReceipt + entry.receivedNow);
    lines.push({ lineId: source.id, description: source.description, ordered: source.quantity, previouslyReceived, receivedNow: entry.receivedNow, batch: entry.batch?.trim() ?? "", expiry: entry.expiry ?? "" });
  }
  const allocated = allocate(state, "GRN");
  const receipt: GoodsReceipt = { id: allocated.id, purchaseOrderId: purchaseOrder.id, title: purchaseOrder.title, department: purchaseOrder.department, projectId: purchaseOrder.projectId, storeId: store.id, warehouse: store.name, quality: input.quality, status: "Posted", challan: input.challan?.trim() ?? "", lines, owner: actorName(state.persona), updatedAt: todayIso() };
  let next: ProcurementState = { ...allocated.state, receipts: [receipt, ...allocated.state.receipts] };
  if (input.quality !== "Rejected") {
    const movements = lines.filter((line) => line.receivedNow > 0).map((line) => {
      const movementId = allocate(next, "MOV");
      next = movementId.state;
      const movement: InventoryMovement = { id: movementId.id, item: line.description, storeId: store.id, warehouse: store.name, toStoreId: "", batch: line.batch, expiry: line.expiry, projectId: purchaseOrder.projectId, movementType: "Receipt", quantity: line.receivedNow, department: purchaseOrder.department, owner: actorName(state.persona), status: "Posted", updatedAt: todayIso(), note: `GRN ${receipt.id}` };
      return movement;
    });
    const createdAssets: Asset[] = [];
    for (const line of lines) {
      if (line.receivedNow <= 0) continue;
      const source = purchaseOrder.lines.find((item) => item.id === line.lineId);
      if (!source || (source.category !== "Equipment" && source.category !== "Vehicle")) continue;
      const assetId = allocate(next, "AST");
      next = assetId.state;
      createdAssets.push({ id: assetId.id, tag: assetId.id, description: source.description, category: source.category, location: store.name, custodian: actorName(state.persona), condition: "Good", value: line.receivedNow * source.unitPrice, projectId: purchaseOrder.projectId, purchaseOrderId: purchaseOrder.id, updatedAt: todayIso() });
    }
    next = { ...next, movements: [...movements, ...next.movements], assets: [...createdAssets, ...next.assets] };
    const refreshed = next.purchaseOrders.map((item) => {
      if (item.id !== purchaseOrder.id) return item;
      const allReceived = item.lines.every((line) => quantityReceived(next, item.id, line.id) >= line.quantity);
      const anyReceived = item.lines.some((line) => quantityReceived(next, item.id, line.id) > 0);
      const status: PurchaseOrderStatus = allReceived ? "Received" : anyReceived ? "Partially received" : item.status;
      return { ...item, status, updatedAt: todayIso() };
    });
    next = { ...next, purchaseOrders: refreshed };
  }
  const postedOrder = next.purchaseOrders.find((item) => item.id === purchaseOrder.id);
  next = recordAudit(next, { documentId: receipt.id, documentType: "goods receipt", action: "Posted", fromStatus: purchaseOrder.status, toStatus: postedOrder?.status ?? purchaseOrder.status });
  return ok(next);
}

export function updateAsset(state: ProcurementState, id: string, patch: { condition: AssetCondition; custodian: string; location: string }): DomainResult {
  const existing = state.assets.find((item) => item.id === id);
  if (!existing) return fail("Asset was not found.");
  if (!patch.custodian.trim() || !patch.location.trim()) return fail("Enter the custodian and location.");
  const updated: Asset = { ...existing, condition: patch.condition, custodian: patch.custodian.trim(), location: patch.location.trim(), updatedAt: todayIso() };
  let next = { ...state, assets: upsert(state.assets, updated) };
  next = recordAudit(next, { documentId: id, documentType: "asset", action: "Updated", fromStatus: existing.condition, toStatus: patch.condition });
  return ok(next);
}

export function postMovement(state: ProcurementState, input: { item: string; storeId: string; toStoreId?: string; batch?: string; expiry?: string; projectId: string; movementType: InventoryMovement["movementType"]; quantity: number; department: string; note: string }): DomainResult {
  if (input.movementType === "Transfer") {
    return transferStock(state, { item: input.item, quantity: input.quantity, fromStoreId: input.storeId, toStoreId: input.toStoreId ?? "", batch: input.batch ?? "", expiry: input.expiry ?? "", projectId: input.projectId, department: input.department });
  }
  if (!input.item.trim() || input.quantity <= 0) return fail("Enter an item and a quantity greater than zero.");
  const store = state.stores.find((item) => item.id === input.storeId);
  if (!store) return fail("Choose a store.");
  if (input.movementType === "Issue") {
    const onHand = stockOf(state, input.item.trim(), store.id, input.batch ?? "", input.projectId);
    if (input.quantity > onHand) return fail(`Only ${onHand} ${input.item.trim()} are on hand at ${store.name}.`);
    if (input.expiry && input.expiry < todayIso()) return fail("Expired stock cannot be issued.");
  }
  const allocated = allocate(state, "MOV");
  const movement: InventoryMovement = { id: allocated.id, item: input.item.trim(), storeId: store.id, warehouse: store.name, toStoreId: "", batch: input.batch?.trim() ?? "", expiry: input.expiry ?? "", projectId: input.projectId, movementType: input.movementType, quantity: input.quantity, department: input.department, owner: actorName(state.persona), status: "Posted", updatedAt: todayIso(), note: input.note.trim() };
  let next = { ...allocated.state, movements: [movement, ...allocated.state.movements] };
  next = recordAudit(next, { documentId: movement.id, documentType: "inventory", action: input.movementType, fromStatus: "—", toStatus: "Posted" });
  return ok(next);
}

export function transferStock(state: ProcurementState, input: { item: string; quantity: number; fromStoreId: string; toStoreId: string; batch: string; expiry: string; projectId: string; department: string }): DomainResult {
  if (!input.item.trim() || input.quantity <= 0) return fail("Enter an item and a quantity greater than zero.");
  const from = state.stores.find((item) => item.id === input.fromStoreId);
  const to = state.stores.find((item) => item.id === input.toStoreId);
  if (!from || !to) return fail("Choose the store to transfer from and the store to transfer to.");
  if (from.id === to.id) return fail("Choose a different receiving store.");
  const onHand = stockOf(state, input.item.trim(), from.id, input.batch, input.projectId);
  if (input.quantity > onHand) return fail(`Only ${onHand} ${input.item.trim()} (${input.batch || "no batch"}) are on hand at ${from.name}.`);
  const allocated = allocate(state, "MOV");
  const movement: InventoryMovement = { id: allocated.id, item: input.item.trim(), storeId: from.id, warehouse: from.name, toStoreId: to.id, batch: input.batch, expiry: input.expiry, projectId: input.projectId, movementType: "Transfer", quantity: input.quantity, department: input.department, owner: actorName(state.persona), status: "Posted", updatedAt: todayIso(), note: `Transfer to ${to.name}` };
  let next = { ...allocated.state, movements: [movement, ...allocated.state.movements] };
  next = recordAudit(next, { documentId: movement.id, documentType: "inventory", action: "Transfer", fromStatus: from.name, toStatus: to.name });
  return ok(next);
}

export function postStoreIssue(state: ProcurementState, input: { storeId: string; destination: string; requestedBy: string; receivedBy: string; projectId: string; lines: { item: string; quantity: number; unit: string; batch?: string; expiry?: string }[] }): DomainResult {
  const store = state.stores.find((item) => item.id === input.storeId);
  if (!store) return fail("Choose the issuing store.");
  if (!input.destination.trim() || !input.requestedBy.trim() || !input.receivedBy.trim()) return fail("Enter who requested the goods, who received them, and where they are going.");
  if (!state.projects.some((item) => item.id === input.projectId)) return fail("Choose a project, donor and budget head.");
  const requested = input.lines.filter((line) => line.quantity > 0);
  if (requested.length === 0) return fail("Enter a quantity for at least one line.");
  let next = state;
  const posted: StoreIssue["lines"] = [];
  for (const line of requested) {
    const batch = line.batch?.trim() ? { batch: line.batch.trim(), expiry: line.expiry ?? "" } : fefoBatch(next, store.id, line.item, input.projectId);
    if (!batch) return fail(`No usable stock of ${line.item} at ${store.name}.`);
    if (batch.expiry && batch.expiry < todayIso()) return fail(`${line.item} batch ${batch.batch} is expired and cannot be issued.`);
    const onHand = stockOf(next, line.item, store.id, batch.batch, input.projectId);
    if (line.quantity > onHand) return fail(`Only ${onHand} ${line.item} from batch ${batch.batch || "—"} are on hand. The earliest expiry is suggested first.`);
    const movementId = allocate(next, "MOV");
    next = movementId.state;
    const movement: InventoryMovement = { id: movementId.id, item: line.item, storeId: store.id, warehouse: store.name, toStoreId: "", batch: batch.batch, expiry: batch.expiry, projectId: input.projectId, movementType: "Issue", quantity: line.quantity, department: state.projects.find((item) => item.id === input.projectId)?.department ?? "", owner: actorName(state.persona), status: "Posted", updatedAt: todayIso(), note: input.destination.trim() };
    next = { ...next, movements: [movement, ...next.movements] };
    posted.push({ item: line.item, batch: batch.batch, expiry: batch.expiry, quantity: line.quantity, unit: line.unit });
  }
  const voucherId = allocate(next, "ISV");
  next = voucherId.state;
  const issue: StoreIssue = { id: voucherId.id, storeId: store.id, destination: input.destination.trim(), requestedBy: input.requestedBy.trim(), receivedBy: input.receivedBy.trim(), projectId: input.projectId, status: "Posted", lines: posted, updatedAt: todayIso() };
  next = { ...next, issues: [issue, ...next.issues] };
  next = recordAudit(next, { documentId: issue.id, documentType: "store issue", action: "Posted", fromStatus: "—", toStatus: "Posted" });
  return ok(next);
}

export function saveInvoice(state: ProcurementState, input: DraftOf<Invoice, "status" | "updatedAt" | "returnComment" | "source" | "vatRate" | "tdsRate">, mode: "draft" | "submit" | "pay" | "reject" | "return", comment?: string): DomainResult {
  const existing = input.id ? state.invoices.find((item) => item.id === input.id) : undefined;
  if (existing && existing.status !== "Draft" && mode !== "pay" && mode !== "reject" && mode !== "return") return fail("This invoice can only be edited while it is a draft.");
  if ((mode === "draft" || mode === "submit") && input.lines.length === 0) return fail("Add at least one invoice line.");
  if (mode === "return" && !comment?.trim()) return fail("A comment is required when returning an invoice.");
  if (mode === "pay" && existing?.status !== "Submitted") return fail("Only a submitted invoice can be marked paid.");
  if ((mode === "reject" || mode === "return") && existing?.status !== "Submitted") return fail("Only a submitted invoice can be returned or rejected.");
  const sourcePreview: InvoiceSource = existing?.source ?? (state.persona === "supplier" ? "supplier" : "internal");
  if (mode === "submit" && sourcePreview === "supplier") {
    if (!input.mushakNumber.trim()) return fail("Enter the Mushak 6.3 number.");
    if (input.mushakDate !== input.invoiceDate) return fail("The Mushak 6.3 date must match the invoice date.");
  }
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "INV");
    next = allocated.state;
    id = allocated.id;
  }
  const status: InvoiceStatus = mode === "submit" ? "Submitted" : mode === "pay" ? "Paid" : mode === "reject" ? "Rejected" : mode === "return" ? "Draft" : "Draft";
  const source: InvoiceSource = existing?.source ?? (state.persona === "supplier" ? "supplier" : "internal");
  const keepCommercial = mode === "pay" || mode === "reject" || mode === "return";
  const invoice: Invoice = { id, invoiceNumber: (existing?.invoiceNumber ?? input.invoiceNumber).trim(), title: (existing?.title ?? input.title).trim(), supplierName: existing?.supplierName ?? input.supplierName, purchaseOrderId: existing?.purchaseOrderId ?? input.purchaseOrderId, receiptId: existing?.receiptId ?? input.receiptId, department: existing?.department ?? input.department, projectId: existing?.projectId ?? input.projectId, invoiceDate: keepCommercial ? existing?.invoiceDate ?? input.invoiceDate : input.invoiceDate, mushakNumber: (keepCommercial ? existing?.mushakNumber ?? "" : input.mushakNumber).trim(), mushakDate: keepCommercial ? existing?.mushakDate ?? "" : input.mushakDate, vatRate: VAT_RATE, tdsRate: TDS_RATE, status, lines: keepCommercial ? existing?.lines ?? input.lines : input.lines, source, updatedAt: todayIso() };
  if (mode === "return" && comment?.trim()) invoice.returnComment = comment.trim();
  next = { ...next, invoices: upsert(next.invoices, invoice) };
  next = recordAudit(next, { documentId: id, documentType: "invoice", action: mode, fromStatus: existing?.status ?? "New", toStatus: status });
  if (mode === "submit") next = notify(next, `Invoice ${invoice.invoiceNumber} submitted for ${id}`, "/payments", id);
  return ok(next);
}

export function saveBid(state: ProcurementState, input: DraftOf<Bid, "status" | "updatedAt" | "supplierName" | "title" | "submittedAt" | "securityNote"> & { securityNote?: string }, mode: "draft" | "submit"): DomainResult {
  const tender = state.tenders.find((item) => item.id === input.tenderId);
  if (!tender || (tender.status !== "Published" && tender.status !== "Evaluation")) return fail("Bids can only be prepared for an open tender.");
  if (mode === "submit" && tender.closingDate < todayIso()) return fail("This tender has closed.");
  const existing = input.id ? state.bids.find((item) => item.id === input.id) : undefined;
  if (existing && existing.status !== "Draft") return fail("A submitted bid cannot be edited.");
  if (existing && existing.supplierName !== SUPPLIER_ACCOUNT) return fail("This bid belongs to another supplier.");
  if (mode === "submit" && !input.declared) return fail("Confirm the supplier declaration before submitting.");
  if (mode === "submit" && !input.securityNote?.trim()) return fail("Enter the tender security reference.");
  if (mode === "submit" && state.suppliers.find((item) => item.legalName === SUPPLIER_ACCOUNT)?.status !== "Verified") return fail("The company file must be verified before a bid can be submitted.");
  if (input.lines.length === 0) return fail("Price at least one line.");
  const duplicate = state.bids.find((item) => item.tenderId === input.tenderId && item.supplierName === SUPPLIER_ACCOUNT && item.id !== existing?.id && item.status === "Submitted");
  if (duplicate && mode === "submit") return fail("A bid has already been submitted for this tender.");
  let next = state;
  let id = existing?.id;
  if (!id) {
    const allocated = allocate(next, "BID");
    next = allocated.state;
    id = allocated.id;
  }
  const status = mode === "submit" ? "Submitted" : "Draft";
  const bid: Bid = { id, tenderId: input.tenderId, title: tender.title, supplierName: SUPPLIER_ACCOUNT, validityDate: input.validityDate, technicalNote: input.technicalNote.trim(), securityNote: (input.securityNote ?? existing?.securityNote ?? "").trim(), declared: input.declared, submittedAt: mode === "submit" ? new Date().toISOString() : existing?.submittedAt ?? "", status, lines: input.lines, updatedAt: todayIso() };
  next = { ...next, bids: upsert(next.bids, bid) };
  if (mode === "submit" && tender.status === "Published") {
    next = { ...next, tenders: next.tenders.map((item) => item.id === tender.id ? { ...item, status: "Evaluation", updatedAt: todayIso() } : item) };
  }
  next = recordAudit(next, { documentId: id, documentType: "bid", action: mode === "submit" ? "Submitted" : "Saved", fromStatus: existing?.status ?? "New", toStatus: status });
  if (mode === "submit") next = notify(next, `${SUPPLIER_ACCOUNT} submitted a bid for ${tender.id}`, "/evaluations", id);
  return ok(next);
}

function bidCanChange(state: ProcurementState, bidId: string): { ok: true; bid: Bid; tender: Tender } | { ok: false; error: string } {
  const bid = state.bids.find((item) => item.id === bidId);
  if (!bid || bid.supplierName !== SUPPLIER_ACCOUNT) return { ok: false, error: "This bid belongs to another supplier." };
  if (bid.status !== "Submitted") return { ok: false, error: "Only a submitted bid can be changed." };
  const tender = state.tenders.find((item) => item.id === bid.tenderId);
  if (!tender || !tenderStillOpen(tender)) return { ok: false, error: "A bid can only be changed before the tender closes." };
  return { ok: true, bid, tender };
}

export function withdrawBid(state: ProcurementState, bidId: string): DomainResult {
  const ready = bidCanChange(state, bidId);
  if (!ready.ok) return ready;
  const updated: Bid = { ...ready.bid, status: "Withdrawn", updatedAt: todayIso() };
  let next = { ...state, bids: upsert(state.bids, updated) };
  next = recordAudit(next, { documentId: ready.bid.id, documentType: "bid", action: "Withdrawn", fromStatus: "Submitted", toStatus: "Withdrawn" });
  next = notify(next, `${SUPPLIER_ACCOUNT} withdrew its bid for ${ready.tender.id}`, "/evaluations", ready.bid.id);
  return ok(next);
}

export function replaceBid(state: ProcurementState, bidId: string): DomainResult {
  const ready = bidCanChange(state, bidId);
  if (!ready.ok) return ready;
  const updated: Bid = { ...ready.bid, status: "Draft", submittedAt: "", updatedAt: todayIso() };
  let next = { ...state, bids: upsert(state.bids, updated) };
  next = recordAudit(next, { documentId: ready.bid.id, documentType: "bid", action: "Replaced", fromStatus: "Submitted", toStatus: "Draft" });
  return ok(next);
}

export function bidResult(state: ProcurementState, bid: Bid) {
  const matches = state.evaluations.filter((item) => item.tenderId === bid.tenderId && item.bidder === bid.supplierName);
  return matches.find((item) => item.status === "Awarded")?.status ?? matches.find((item) => item.status === "Unsuccessful")?.status ?? null;
}

export function confirmDelivery(state: ProcurementState, input: { purchaseOrderId: string; expectedDate: string; challan: string; lines: { lineId: string; quantity: number }[] }): DomainResult {
  const purchaseOrder = state.purchaseOrders.find((item) => item.id === input.purchaseOrderId);
  if (!purchaseOrder) return fail("Choose a purchase order.");
  if (purchaseOrder.supplierName !== SUPPLIER_ACCOUNT) return fail("This order belongs to another supplier.");
  if (purchaseOrder.status !== "Issued" && purchaseOrder.status !== "Partially received") return fail("Delivery can be confirmed for issued orders that are not yet fully received.");
  if (!input.expectedDate) return fail("Enter the expected delivery date.");
  if (!input.challan.trim()) return fail("Enter the challan number.");
  const lines = input.lines.filter((line) => line.quantity > 0).map((line) => {
    const source = purchaseOrder.lines.find((item) => item.id === line.lineId);
    return { lineId: line.lineId, description: source?.description ?? line.lineId, quantity: line.quantity };
  });
  if (lines.length === 0) return fail("Enter a quantity for at least one line.");
  const allocated = allocate(state, "DEL");
  const delivery: DeliveryConfirmation = { id: allocated.id, purchaseOrderId: purchaseOrder.id, title: purchaseOrder.title, supplierName: SUPPLIER_ACCOUNT, expectedDate: input.expectedDate, challan: input.challan.trim(), status: "Confirmed", lines, updatedAt: todayIso() };
  let next = { ...allocated.state, deliveries: [delivery, ...allocated.state.deliveries] };
  next = recordAudit(next, { documentId: delivery.id, documentType: "delivery", action: "Confirmed", fromStatus: purchaseOrder.status, toStatus: "Confirmed" });
  next = notify(next, `${SUPPLIER_ACCOUNT} confirmed delivery for ${purchaseOrder.id}`, "/receiving", purchaseOrder.id);
  return ok(next);
}

export function markNotificationRead(state: ProcurementState, id: string): ProcurementState {
  return { ...state, notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item) };
}

export function markAllNotificationsRead(state: ProcurementState): ProcurementState {
  return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
}

function movementDelta(movement: InventoryMovement, storeId: string) {
  if (movement.movementType === "Receipt" && movement.storeId === storeId) return movement.quantity;
  if (movement.movementType === "Issue" && movement.storeId === storeId) return -movement.quantity;
  if (movement.movementType === "Transfer" && movement.storeId === storeId) return -movement.quantity;
  if (movement.movementType === "Transfer" && movement.toStoreId === storeId) return movement.quantity;
  return 0;
}

export function stockOf(state: ProcurementState, item: string, storeId: string, batch = "", projectId = "") {
  return state.movements
    .filter((movement) => movement.item === item && (batch === "" || movement.batch === batch) && (projectId === "" || movement.projectId === projectId))
    .reduce((sum, movement) => sum + movementDelta(movement, storeId), 0);
}

export type StockPosition = { id: string; item: string; storeId: string; storeName: string; batch: string; expiry: string; projectId: string; onHand: number };

export function stockPositions(state: ProcurementState): StockPosition[] {
  const totals = new Map<string, StockPosition>();
  for (const movement of state.movements) {
    const touch = movement.movementType === "Transfer" ? [movement.storeId, movement.toStoreId] : [movement.storeId];
    for (const storeId of touch) {
      if (!storeId) continue;
      const key = `${movement.item}||${storeId}||${movement.batch}||${movement.projectId}`;
      const current = totals.get(key) ?? { id: key, item: movement.item, storeId, storeName: storeName(state, storeId), batch: movement.batch, expiry: movement.expiry, projectId: movement.projectId, onHand: 0 };
      current.onHand += movementDelta(movement, storeId);
      totals.set(key, current);
    }
  }
  return [...totals.values()].filter((item) => item.onHand !== 0);
}

export function fefoBatch(state: ProcurementState, storeId: string, item: string, projectId: string) {
  const today = todayIso();
  const batches = stockPositions(state)
    .filter((row) => row.storeId === storeId && row.item === item && row.projectId === projectId && row.onHand > 0 && (!row.expiry || row.expiry >= today))
    .sort((a, b) => (a.expiry || "9999-12-31").localeCompare(b.expiry || "9999-12-31"));
  const first = batches[0];
  return first ? { batch: first.batch, expiry: first.expiry } : undefined;
}

export type MatchRow = { description: string; unit: string; ordered: number; received: number; invoiced: number };

export function threeWayMatch(state: ProcurementState, purchaseOrderId: string): MatchRow[] {
  const purchaseOrder = state.purchaseOrders.find((item) => item.id === purchaseOrderId);
  if (!purchaseOrder) return [];
  return purchaseOrder.lines.map((line) => {
    const invoiced = state.invoices
      .filter((invoice) => invoice.purchaseOrderId === purchaseOrderId && invoice.status !== "Draft" && invoice.status !== "Rejected")
      .flatMap((invoice) => invoice.lines)
      .filter((item) => item.id === line.id)
      .reduce((sum, item) => sum + item.quantity, 0);
    return { description: line.description, unit: line.unit, ordered: line.quantity, received: quantityReceived(state, purchaseOrderId, line.id), invoiced };
  });
}

export type ApprovalItem = { kind: "requisition"; record: Requisition } | { kind: "invoice"; record: Invoice };

export function approvalQueue(state: ProcurementState): ApprovalItem[] {
  return [
    ...state.requisitions.filter((item) => item.status === "Submitted").map((record) => ({ kind: "requisition" as const, record })),
    ...state.invoices.filter((item) => item.status === "Submitted").map((record) => ({ kind: "invoice" as const, record })),
  ];
}

const record = (id: string, title: string, department: string, owner: string, value: number, date: string, status: string, method?: string): ProcurementRecord => {
  const base: ProcurementRecord = { id, title, department, owner, value, date: formatDisplayDate(date), status, tone: toneFor(status) };
  if (method) base.method = method;
  return base;
};

export function recordsFor(state: ProcurementState, module: string): ProcurementRecord[] {
  switch (module) {
    case "requisitions":
      return state.requisitions.map((item) => record(item.id, item.title, item.department, item.requester, linesTotal(item.lines), item.needBy, item.status, item.method));
    case "plans":
      return state.plans.map((item) => record(item.id, item.title, item.department, item.owner, item.budgetCeiling, item.updatedAt, item.status));
    case "surveys":
      return state.surveys.map((item) => record(item.id, item.title, item.department, item.owner, item.quotes.reduce((sum, quote) => sum + quote.unitPrice, 0), item.updatedAt, item.status));
    case "tenders":
      return state.tenders.map((item) => record(item.id, item.title, item.department, item.owner, linesTotal(item.lines), item.closingDate, item.status, item.method));
    case "evaluations":
      return state.evaluations.map((item) => record(item.id, item.title, item.department, item.bidder, item.technicalScore + item.financialScore, item.updatedAt, item.status));
    case "suppliers":
      return state.suppliers.map((item) => record(item.id, item.legalName, item.categories, item.district, 0, item.updatedAt, item.status));
    case "purchase-orders":
      return state.purchaseOrders.map((item) => record(item.id, item.title, item.department, item.supplierName, linesTotal(item.lines), item.needBy, item.status));
    case "contracts":
      return state.contracts.map((item) => record(item.id, item.title, item.department, item.supplierName, item.value, item.endDate, item.status));
    case "receiving":
      return state.receipts.map((item) => record(item.id, item.title, item.warehouse, item.owner, item.lines.reduce((sum, line) => sum + line.receivedNow, 0), item.updatedAt, item.quality));
    case "inventory":
      return state.movements.map((item) => record(item.id, item.item, item.warehouse, item.owner, item.quantity, item.updatedAt, item.movementType));
    case "issues":
      return state.issues.map((item) => record(item.id, item.destination, storeName(state, item.storeId), item.receivedBy, item.lines.reduce((sum, line) => sum + line.quantity, 0), item.updatedAt, item.status));
    case "assets":
      return state.assets.map((item) => record(item.id, item.description, item.location, item.custodian, item.value, item.updatedAt, item.condition));
    case "payments":
      return state.invoices.map((item) => record(item.id, item.title, item.department, item.supplierName, invoiceAmounts(item.lines).net, item.invoiceDate, item.status));
    case "reports": {
      const departments = [...new Set(state.purchaseOrders.map((item) => item.department))];
      return departments.map((department) => {
        const committed = state.purchaseOrders.filter((item) => item.department === department && item.status !== "Draft").reduce((sum, item) => sum + linesTotal(item.lines), 0);
        return record(`RPT-${department}`, `${department} committed spend`, department, "Live register", committed, todayIso(), "Live");
      });
    }
    case "audit":
      return state.audit.map((item) => record(item.id, `${item.action} · ${item.documentId}`, item.documentType, item.actor, 0, item.at, item.toStatus));
    case "vendor-tenders":
      return state.tenders.filter((item) => item.status === "Published" || item.status === "Evaluation").map((item) => record(item.id, item.title, item.department, item.owner, linesTotal(item.lines), item.closingDate, item.status, item.method));
    case "vendor-bids":
      return state.bids.filter((item) => item.supplierName === SUPPLIER_ACCOUNT).map((item) => record(item.id, item.title, item.tenderId, SUPPLIER_ACCOUNT, linesTotal(item.lines), item.validityDate, item.status));
    case "vendor-orders":
      return state.purchaseOrders.filter((item) => item.supplierName === SUPPLIER_ACCOUNT && item.status !== "Draft").map((item) => record(item.id, item.title, item.department, item.deliveryLocation, linesTotal(item.lines), item.needBy, item.status));
    default:
      return [];
  }
}

export type SearchHit = { id: string; label: string; detail: string; to: string; focus?: FocusTarget };

const MODULE_PATHS: Record<string, string> = {
  requisitions: "/requisitions",
  plans: "/plans",
  surveys: "/surveys",
  tenders: "/tenders",
  evaluations: "/evaluations",
  suppliers: "/suppliers",
  "purchase-orders": "/purchase-orders",
  contracts: "/contracts",
  receiving: "/receiving",
  inventory: "/inventory",
  issues: "/issues",
  assets: "/assets",
  payments: "/payments",
  reports: "/reports",
  audit: "/audit",
};

export function searchHits(state: ProcurementState, query: string): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const [module, path] of Object.entries(MODULE_PATHS)) {
    for (const item of recordsFor(state, module)) {
      if (`${item.id} ${item.title} ${item.department}`.toLowerCase().includes(needle)) {
        hits.push({ id: `${module}-${item.id}`, label: item.title, detail: `${item.id} · ${module}`, to: path, focus: { module, id: item.id } });
      }
    }
  }
  return hits.slice(0, 12);
}

export function committedSpend(state: ProcurementState) {
  return state.purchaseOrders.filter((item) => item.status !== "Draft").reduce((sum, item) => sum + linesTotal(item.lines), 0);
}

export function planCeiling(state: ProcurementState) {
  return state.plans.filter((item) => item.status === "Active").reduce((sum, item) => sum + item.budgetCeiling, 0);
}

export function purchaseRegister(state: ProcurementState) {
  return state.purchaseOrders.filter((item) => item.status !== "Draft").map((item) => {
    const project = state.projects.find((entry) => entry.id === item.projectId);
    return { id: item.id, title: item.title, project: project?.name ?? "—", donor: project?.donor ?? "—", budgetHead: project?.budgetHead ?? "—", supplier: item.supplierName, value: linesTotal(item.lines), date: item.needBy, status: item.status };
  });
}

export function stockLedger(state: ProcurementState) {
  return state.movements.map((item) => ({
    id: item.id, date: item.updatedAt, item: item.item, store: item.warehouse, batch: item.batch || "—", expiry: item.expiry || "—", project: projectName(state, item.projectId), type: item.movementType === "Transfer" ? `Transfer to ${storeName(state, item.toStoreId)}` : item.movementType, quantity: item.movementType === "Issue" || item.movementType === "Transfer" ? -item.quantity : item.quantity,
  }));
}

export function expiringSoon(state: ProcurementState, days = 90) {
  const limit = new Date(`${todayIso()}T00:00:00`);
  limit.setDate(limit.getDate() + days);
  const limitIso = limit.toISOString().slice(0, 10);
  return stockPositions(state).filter((item) => item.expiry && item.expiry <= limitIso && item.onHand > 0);
}

export function pendingDeliveries(state: ProcurementState) {
  return state.purchaseOrders.filter((item) => item.status === "Issued" || item.status === "Partially received");
}
