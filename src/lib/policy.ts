export const DEMO_POLICY_NOTE = "Sample limits for this demo. Replace them with Ahsania Mission’s procurement manual.";
export const VAT_RATE = 15;
export const TDS_RATE = 5;
export const OPEN_TENDER_FLOOR = 2_500_000;

export type ApprovalRole = "programme-manager" | "procurement-officer" | "procurement-committee" | "executive-director";

export type PolicyMethod = "RFQ" | "Open tender" | "Limited tender" | "Direct";

export type PolicyBand = {
  label: string;
  max: number | null;
  method: PolicyMethod;
  role: ApprovalRole;
};

export const POLICY_BANDS: PolicyBand[] = [
  { label: "Direct purchase", max: 25_000, method: "Direct", role: "programme-manager" },
  { label: "Quotation (RFQ)", max: 500_000, method: "RFQ", role: "procurement-officer" },
  { label: "Limited tender", max: OPEN_TENDER_FLOOR, method: "Limited tender", role: "procurement-committee" },
  { label: "Open tender", max: null, method: "Open tender", role: "executive-director" },
];

const METHOD_RANK: Record<PolicyMethod, number> = { Direct: 0, RFQ: 1, "Limited tender": 2, "Open tender": 3 };

export function bandForValue(value: number): PolicyBand {
  return POLICY_BANDS.find((band) => band.max === null || value <= band.max) ?? POLICY_BANDS[POLICY_BANDS.length - 1]!;
}

export function methodIsWeaker(chosen: PolicyMethod, required: PolicyMethod) {
  return METHOD_RANK[chosen] < METHOD_RANK[required];
}

export const ROLE_LABEL: Record<ApprovalRole, string> = {
  "programme-manager": "Programme manager",
  "procurement-officer": "Procurement officer",
  "procurement-committee": "Procurement committee",
  "executive-director": "Executive Director",
};

export function roleLabel(role: ApprovalRole) {
  return ROLE_LABEL[role];
}
