import { z } from "zod";
import { METHODS, QUARTERS } from "@/lib/domain";

const categories = ["Consumable", "Medicine", "Equipment", "Vehicle"] as const;

export const lineSchema = z.object({
  id: z.string().min(1),
  description: z.string().trim().min(1, "Description is required"),
  quantity: z.number({ invalid_type_error: "Enter a quantity" }).positive("Quantity must be greater than zero"),
  unit: z.string().trim().min(1, "Unit is required"),
  unitPrice: z.number({ invalid_type_error: "Enter a unit price" }).min(0, "Unit price cannot be negative"),
  specification: z.string(),
  category: z.enum(categories),
});

export const requisitionSchema = z.object({
  title: z.string().trim().min(3, "Enter a title"),
  programme: z.string().min(1, "Choose a programme"),
  department: z.string().min(1, "Choose a department"),
  requester: z.string().trim().min(1, "Enter the requester"),
  needBy: z.string().min(1, "Choose a need-by date"),
  projectId: z.string().min(1, "Choose a project"),
  justification: z.string().trim().min(10, "Add a justification of at least 10 characters"),
  method: z.enum(METHODS),
  methodJustification: z.string(),
  lines: z.array(lineSchema).min(1, "Add at least one line"),
});

export const planLineSchema = z.object({
  id: z.string().min(1),
  description: z.string().trim().min(1, "Description is required"),
  quarter: z.enum(QUARTERS),
  estimatedValue: z.number({ invalid_type_error: "Enter a value" }).nonnegative(),
  method: z.enum(METHODS),
});

export const planSchema = z.object({
  title: z.string().trim().min(3, "Enter a title"),
  fiscalYear: z.string().trim().min(1, "Enter the fiscal year"),
  programme: z.string().min(1),
  department: z.string().min(1),
  owner: z.string().trim().min(1, "Enter the owner"),
  budgetCeiling: z.number({ invalid_type_error: "Enter the budget ceiling" }).positive("Budget ceiling must be greater than zero"),
  lines: z.array(planLineSchema).min(1, "Add at least one plan line"),
});

export const quoteSchema = z.object({
  id: z.string().min(1),
  supplierName: z.string().trim().min(1, "Supplier is required"),
  unitPrice: z.number({ invalid_type_error: "Enter a price" }).nonnegative(),
  leadTimeDays: z.number({ invalid_type_error: "Enter lead time" }).positive(),
  validUntil: z.string().min(1, "Enter a validity date"),
});

export const surveySchema = z.object({
  title: z.string().trim().min(3),
  requisitionId: z.string().min(1, "Choose a requisition"),
  owner: z.string().trim().min(1),
  recommendation: z.string().trim().min(1, "Enter a recommendation"),
  quotes: z.array(quoteSchema).min(1, "Add at least one quote"),
});

export const tenderSchema = z.object({
  title: z.string().trim().min(3),
  method: z.enum(METHODS),
  requisitionId: z.string(),
  department: z.string().min(1),
  owner: z.string().trim().min(1),
  publishDate: z.string().min(1, "Enter a publish date"),
  closingDate: z.string().min(1, "Enter a closing date"),
  eligibility: z.string().trim().min(10, "Describe who may bid"),
  projectId: z.string(),
  documentFee: z.number().nonnegative(),
  tenderSecurity: z.number().nonnegative(),
  lines: z.array(lineSchema).min(1, "Add at least one lot"),
});

export const evaluationSchema = z.object({
  title: z.string().trim().min(3),
  tenderId: z.string().min(1, "Choose a tender"),
  bidder: z.string().trim().min(1, "Enter the bidder"),
  technicalScore: z.number().min(0).max(100),
  financialScore: z.number().min(0).max(100),
  recommendation: z.string().trim().min(1, "Enter a recommendation"),
  committeeNote: z.string().trim().min(1, "Enter the committee note"),
  owner: z.string().trim().min(1),
});

export const supplierSchema = z.object({
  legalName: z.string().trim().min(2),
  tradeLicence: z.string().trim().min(2, "Enter the trade licence"),
  tin: z.string().trim().min(2, "Enter the TIN"),
  bin: z.string().trim().regex(/^\d{13}$/, "Enter the 13-digit BIN"),
  licenceExpiry: z.string().min(1, "Enter the licence expiry"),
  bankName: z.string().trim().min(2, "Enter the bank name"),
  accountNumber: z.string().trim().min(2, "Enter the account number"),
  routingNumber: z.string().trim().min(2, "Enter the routing number"),
  categories: z.string().trim().min(2),
  district: z.string().trim().min(2),
  contact: z.string().trim().min(3),
});

export const purchaseOrderSchema = z.object({
  title: z.string().trim().min(3),
  sourceId: z.string(),
  supplierId: z.string(),
  supplierName: z.string().trim().min(1, "Choose a supplier"),
  department: z.string().min(1),
  projectId: z.string().min(1, "Choose a project"),
  deliveryLocation: z.string().trim().min(2, "Enter the delivery location"),
  needBy: z.string().min(1, "Enter the need-by date"),
  lines: z.array(lineSchema).min(1),
});

export const milestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Milestone title is required"),
  dueDate: z.string().min(1, "Enter a due date"),
  amount: z.number().nonnegative(),
});

export const contractSchema = z.object({
  title: z.string().trim().min(3),
  supplierId: z.string(),
  supplierName: z.string().trim().min(1, "Choose a supplier"),
  purchaseOrderId: z.string(),
  department: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  value: z.number().positive("Enter the contract value"),
  performanceSecurity: z.string(),
  milestones: z.array(milestoneSchema),
});

export const movementSchema = z.object({
  item: z.string().trim().min(1, "Enter the item"),
  storeId: z.string().min(1, "Choose a store"),
  toStoreId: z.string(),
  batch: z.string(),
  expiry: z.string(),
  projectId: z.string().min(1, "Choose a project"),
  movementType: z.enum(["Receipt", "Issue", "Transfer"]),
  quantity: z.number().positive(),
  department: z.string().min(1),
  note: z.string(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1, "Enter the invoice number"),
  title: z.string().trim().min(3),
  supplierName: z.string().trim().min(1),
  purchaseOrderId: z.string().min(1, "Choose a purchase order"),
  receiptId: z.string(),
  department: z.string().min(1),
  projectId: z.string(),
  invoiceDate: z.string().min(1),
  mushakNumber: z.string(),
  mushakDate: z.string(),
  lines: z.array(lineSchema).min(1),
});

export const bidSchema = z.object({
  tenderId: z.string().min(1),
  validityDate: z.string().min(1, "Enter the validity date"),
  technicalNote: z.string().trim().min(10, "Describe how the goods or services will be delivered"),
  securityNote: z.string(),
  declared: z.boolean(),
  lines: z.array(lineSchema).min(1),
});

export type RequisitionFormValues = z.infer<typeof requisitionSchema>;
export type PlanFormValues = z.infer<typeof planSchema>;
export type SurveyFormValues = z.infer<typeof surveySchema>;
export type TenderFormValues = z.infer<typeof tenderSchema>;
export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;
export type ContractFormValues = z.infer<typeof contractSchema>;
export type MovementFormValues = z.infer<typeof movementSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type BidFormValues = z.infer<typeof bidSchema>;
