import { describe, expect, it } from "vitest";
import { askClarification, confirmDelivery, createPoFromAward, createSeedState, decideRequisition, invoiceAmounts, postGoodsReceipt, postStoreIssue, respondToContract, saveBid, saveEvaluation, saveInvoice, savePurchaseOrder, saveRequisition, saveTender, setPersona, stockOf, todayIso, transferStock, withdrawBid, type LineItem, type ProcurementState } from "@/lib/domain";

const line = (quantity: number, unitPrice = 100, category: LineItem["category"] = "Consumable"): LineItem => ({ id: "line-1", description: "Gloves", quantity, unit: "Carton", unitPrice, specification: "Nitrile", category });

function must<T extends { ok: true; state: ProcurementState } | { ok: false; error: string }>(result: T): ProcurementState {
  if (!result.ok) throw new Error(result.error);
  return result.state;
}

describe("procurement workflow", () => {
  it("submits a requisition and requires a comment when it is returned", () => {
    let state = createSeedState();
    state = must(saveRequisition(state, {
      title: "Clinic thermometers",
      programme: "Health",
      department: "Health Programme",
      requester: "Nabila Khan",
      needBy: "2026-11-01",
      projectId: "PRJ-TVET",
      justification: "Quarterly replenishment of clinic diagnostic tools.",
      method: "RFQ",
      methodJustification: "",
      lines: [line(20)],
    }, "draft"));
    const draft = state.requisitions.find((item) => item.title === "Clinic thermometers");
    expect(draft?.status).toBe("Draft");
    if (!draft) return;
    state = must(saveRequisition(state, { ...draft }, "submit"));
    expect(state.requisitions.find((item) => item.id === draft.id)?.status).toBe("Submitted");
    expect(decideRequisition(state, draft.id, "Returned").ok).toBe(false);
    state = must(decideRequisition(state, draft.id, "Returned", "Attach three quotations."));
    expect(state.requisitions.find((item) => item.id === draft.id)?.status).toBe("Returned");
    const returned = state.requisitions.find((item) => item.id === draft.id);
    if (!returned) return;
    state = must(saveRequisition(state, { ...returned }, "submit"));
    state = must(decideRequisition(state, draft.id, "Approved"));
    const approved = state.requisitions.find((item) => item.id === draft.id);
    expect(approved?.status).toBe("Approved");
    if (!approved) return;
    expect(saveRequisition(state, { ...approved }, "draft").ok).toBe(false);
    expect(state.audit.some((event) => event.documentId === draft.id && event.action === "Approved")).toBe(true);
  });

  it("copies awarded tender lines onto a draft purchase order", () => {
    let state = createSeedState();
    state = must(saveTender(state, {
      title: "Blanket supply",
      method: "Open tender",
      requisitionId: "",
      department: "Programmes",
      owner: "Nabila Khan",
      publishDate: "2026-10-01",
      closingDate: "2026-10-20",
      eligibility: "Manufacturers with a quality inspection report.",
      projectId: "PRJ-WASH",
      lines: [line(100)],
    }, "publish"));
    const tender = state.tenders.find((item) => item.title === "Blanket supply");
    expect(tender?.status).toBe("Published");
    if (!tender) return;
    state = must(saveEvaluation(state, {
      title: tender.title,
      tenderId: tender.id,
      bidder: "MediTrade Bangladesh Ltd.",
      technicalScore: 80,
      financialScore: 75,
      recommendation: "Lowest compliant bid.",
      committeeNote: "Committee met on 10 Oct.",
      owner: "Nabila Khan",
    }, "Awarded"));
    const evaluation = state.evaluations.find((item) => item.tenderId === tender.id);
    expect(state.tenders.find((item) => item.id === tender.id)?.status).toBe("Awarded");
    if (!evaluation) return;
    state = must(createPoFromAward(state, evaluation.id));
    const order = state.purchaseOrders.find((item) => item.sourceId === tender.id);
    expect(order?.status).toBe("Draft");
    expect(order?.lines.map((item) => item.description)).toEqual(["Gloves"]);
    expect(order?.supplierName).toBe("MediTrade Bangladesh Ltd.");
    expect(createPoFromAward(state, evaluation.id).ok).toBe(false);
  });

  it("rejects a goods receipt that exceeds the ordered quantity", () => {
    let state = createSeedState();
    state = must(savePurchaseOrder(state, {
      title: "Glove call-off",
      sourceId: "",
      supplierId: "SUP-0182",
      supplierName: "MediTrade Bangladesh Ltd.",
      department: "Health Programme",
      projectId: "PRJ-DTC",
      deliveryLocation: "Central Store, Dhanmondi",
      needBy: "2026-11-01",
      lines: [line(10)],
    }, "issue"));
    const order = state.purchaseOrders.find((item) => item.title === "Glove call-off");
    if (!order) throw new Error("order missing");
    const lineId = order.lines[0]?.id;
    if (!lineId) throw new Error("line missing");
    state = must(postGoodsReceipt(state, { purchaseOrderId: order.id, storeId: "STR-CENTRAL", quality: "Accepted", lines: [{ lineId, receivedNow: 4 }] }));
    expect(state.purchaseOrders.find((item) => item.id === order.id)?.status).toBe("Partially received");
    const over = postGoodsReceipt(state, { purchaseOrderId: order.id, storeId: "STR-CENTRAL", quality: "Accepted", lines: [{ lineId, receivedNow: 7 }] });
    expect(over.ok).toBe(false);
    state = must(postGoodsReceipt(state, { purchaseOrderId: order.id, storeId: "STR-CENTRAL", quality: "Accepted", lines: [{ lineId, receivedNow: 6 }] }));
    expect(state.purchaseOrders.find((item) => item.id === order.id)?.status).toBe("Received");
  });

  it("picks the value band, method and approver, and refuses the wrong role", () => {
    let state = createSeedState();
    const blocked = decideRequisition(state, "PR-2026-0142", "Approved");
    expect(blocked.ok).toBe(false);
    state = setPersona(state, "executive-director");
    state = must(decideRequisition(state, "PR-2026-0142", "Approved"));
    expect(state.requisitions.find((item) => item.id === "PR-2026-0142")?.status).toBe("Approved");

    state = must(saveRequisition(state, {
      title: "Field solar kits",
      programme: "WASH",
      department: "Operations",
      requester: "Mahmud Hasan",
      needBy: "2026-12-01",
      projectId: "PRJ-WASH",
      justification: "Twelve field offices need a power source.",
      method: "Direct",
      methodJustification: "The supplier is the only local installer.",
      lines: [line(12, 300_000, "Equipment")],
    }, "submit"));
    const solar = state.requisitions.find((item) => item.title === "Field solar kits");
    expect(solar?.method).toBe("Direct");
    expect(solar?.awaitingRole).toBe("executive-director");
    expect(saveRequisition(createSeedState(), {
      title: "Unjustified direct buy",
      programme: "WASH",
      department: "Operations",
      requester: "Mahmud Hasan",
      needBy: "2026-12-01",
      projectId: "PRJ-WASH",
      justification: "A large purchase without a written reason for skipping competition.",
      method: "Direct",
      methodJustification: "",
      lines: [line(12, 300_000, "Equipment")],
    }, "draft").ok).toBe(false);
    const rfq = saveRequisition(createSeedState(), {
      title: "Printed registers",
      programme: "Education",
      department: "Education",
      requester: "Nusrat Jahan",
      needBy: "2026-11-01",
      projectId: "PRJ-TVET",
      justification: "Training materials for the next quarter.",
      method: "RFQ",
      methodJustification: "",
      lines: [line(400, 1_000)],
    }, "submit");
    expect(rfq.ok).toBe(false);
  });

  it("refuses an issue above the earliest batch and moves stock on transfer", () => {
    let state = createSeedState();
    const item = "Paracetamol 500 mg tablets";
    expect(postStoreIssue(state, { storeId: "STR-AMCGH", destination: "Oncology ward", requestedBy: "Ward", receivedBy: "Nurse", projectId: "PRJ-AMCGH", lines: [{ item, quantity: 11, unit: "Box" }] }).ok).toBe(false);
    state = must(postStoreIssue(state, { storeId: "STR-AMCGH", destination: "Oncology ward", requestedBy: "Ward", receivedBy: "Nurse", projectId: "PRJ-AMCGH", lines: [{ item, quantity: 5, unit: "Box" }] }));
    expect(stockOf(state, item, "STR-AMCGH", "B-2411", "PRJ-AMCGH")).toBe(5);
    state = must(savePurchaseOrder(state, {
      title: "Expired saline",
      sourceId: "",
      supplierId: "SUP-0301",
      supplierName: "Bengal Medical Supplies Ltd.",
      department: "Health Programme",
      projectId: "PRJ-AMCGH",
      deliveryLocation: "AMCGH Pharmacy, Uttara",
      needBy: "2026-11-01",
      lines: [{ id: "saline", description: "Saline", quantity: 2, unit: "Bottle", unitPrice: 40, specification: "", category: "Medicine" }],
    }, "issue"));
    const saline = state.purchaseOrders.find((order) => order.title === "Expired saline");
    if (!saline) throw new Error("saline order missing");
    state = must(postGoodsReceipt(state, { purchaseOrderId: saline.id, storeId: "STR-AMCGH", quality: "Accepted", lines: [{ lineId: "saline", receivedNow: 2, batch: "OLD", expiry: "2020-01-01" }] }));
    expect(postStoreIssue(state, { storeId: "STR-AMCGH", destination: "Ward", requestedBy: "Ward", receivedBy: "Nurse", projectId: "PRJ-AMCGH", lines: [{ item: "Saline", quantity: 1, unit: "Bottle", batch: "OLD", expiry: "2020-01-01" }] }).ok).toBe(false);

    const beforeCentral = stockOf(state, item, "STR-CENTRAL", "B-2506", "PRJ-AMCGH");
    const beforePharmacy = stockOf(state, item, "STR-AMCGH", "B-2506", "PRJ-AMCGH");
    state = must(transferStock(state, { item, quantity: 10, fromStoreId: "STR-AMCGH", toStoreId: "STR-CENTRAL", batch: "B-2506", expiry: "2027-06-30", projectId: "PRJ-AMCGH", department: "Health Programme" }));
    expect(stockOf(state, item, "STR-AMCGH", "B-2506", "PRJ-AMCGH")).toBe(beforePharmacy - 10);
    expect(stockOf(state, item, "STR-CENTRAL", "B-2506", "PRJ-AMCGH")).toBe(beforeCentral + 10);
  });

  it("adds VAT, withholds TDS, and creates an asset from equipment received", () => {
    expect(invoiceAmounts([{ quantity: 2, unitPrice: 1_000 }])).toEqual({ subtotal: 2_000, vat: 300, tds: 100, net: 2_200 });
    let state = createSeedState();
    const before = state.assets.length;
    state = must(savePurchaseOrder(state, {
      title: "Training laptop",
      sourceId: "",
      supplierId: "SUP-0114",
      supplierName: "Bangla Stationers Ltd.",
      department: "Education",
      projectId: "PRJ-TVET",
      deliveryLocation: "Gazipur Training Centre Store",
      needBy: "2026-11-01",
      lines: [{ id: "laptop", description: "Training laptop", quantity: 1, unit: "Each", unitPrice: 85_000, specification: "", category: "Equipment" }],
    }, "issue"));
    const order = state.purchaseOrders.find((item) => item.title === "Training laptop");
    if (!order) throw new Error("laptop order missing");
    state = must(postGoodsReceipt(state, { purchaseOrderId: order.id, storeId: "STR-GAZIPUR", quality: "Accepted", lines: [{ lineId: "laptop", receivedNow: 1 }] }));
    const asset = state.assets.find((item) => item.description === "Training laptop");
    expect(state.assets.length).toBe(before + 1);
    expect(asset?.condition).toBe("Good");
    expect(asset?.value).toBe(85_000);
    expect(asset?.projectId).toBe("PRJ-TVET");
  });

  it("covers the supplier path from company file to challan", () => {
    const later = new Date(`${todayIso()}T00:00:00`);
    later.setDate(later.getDate() + 7);
    const openUntil = later.toISOString().slice(0, 10);
    let state = setPersona(createSeedState(), "supplier");
    state = { ...state, suppliers: state.suppliers.map((item) => item.legalName === "Bengal Medical Supplies Ltd." ? { ...item, status: "Under review" } : item), tenders: state.tenders.map((item) => item.id === "OTM-2026-0042" ? { ...item, closingDate: openUntil, status: "Published" } : item) };
    expect(saveBid(state, { tenderId: "OTM-2026-0042", validityDate: openUntil, technicalNote: "Packed in Dhaka with a traceability sheet.", securityNote: "Pay order PO-1", declared: true, lines: [line(1)] }, "submit").ok).toBe(false);

    state = setPersona(createSeedState(), "supplier");
    state = { ...state, tenders: state.tenders.map((item) => item.id === "OTM-2026-0042" ? { ...item, closingDate: openUntil, status: "Evaluation" } : item) };
    state = must(withdrawBid(state, "BID-2026-0014"));
    expect(state.bids.find((item) => item.id === "BID-2026-0014")?.status).toBe("Withdrawn");
    state = { ...state, tenders: state.tenders.map((item) => item.id === "OTM-2026-0042" ? { ...item, closingDate: "2020-01-01" } : item), bids: state.bids.map((item) => item.id === "BID-2026-0014" ? { ...item, status: "Submitted" } : item) };
    expect(withdrawBid(state, "BID-2026-0014").ok).toBe(false);

    state = setPersona(createSeedState(), "supplier");
    state = { ...state, tenders: state.tenders.map((item) => item.id === "OTM-2026-0042" ? { ...item, closingDate: openUntil, status: "Published" } : item) };
    state = must(askClarification(state, "OTM-2026-0042", "Can the kits be packed in Chattogram?"));
    expect(state.tenders.find((item) => item.id === "OTM-2026-0042")?.clarifications.some((item) => item.question.includes("Chattogram"))).toBe(true);
    expect(askClarification(state, "OTM-2026-0038", "Is this tender still open?").ok).toBe(false);

    const order = state.purchaseOrders.find((item) => item.id === "PO-2026-0301");
    if (!order) throw new Error("order missing");
    expect(saveInvoice(state, { invoiceNumber: "BMS-2", title: "Second paracetamol invoice", supplierName: order.supplierName, purchaseOrderId: order.id, receiptId: "GRN-2026-0101", department: order.department, projectId: order.projectId, invoiceDate: todayIso(), mushakNumber: "6.3-2", mushakDate: "2020-01-01", lines: order.lines }, "submit").ok).toBe(false);
    state = must(saveInvoice(state, { invoiceNumber: "BMS-2", title: "Second paracetamol invoice", supplierName: order.supplierName, purchaseOrderId: order.id, receiptId: "GRN-2026-0101", department: order.department, projectId: order.projectId, invoiceDate: todayIso(), mushakNumber: "6.3-2", mushakDate: todayIso(), lines: order.lines }, "submit"));
    expect(state.invoices.find((item) => item.invoiceNumber === "BMS-2")?.status).toBe("Submitted");

    state = must(respondToContract(state, "CON-2026-0038", "Accepted"));
    expect(state.contracts.find((item) => item.id === "CON-2026-0038")?.acceptance).toBe("Accepted");
    expect(confirmDelivery(state, { purchaseOrderId: "PO-2026-0318", expectedDate: openUntil, challan: "  ", lines: [{ lineId: "po318-1", quantity: 500 }] }).ok).toBe(false);
    state = must(confirmDelivery(state, { purchaseOrderId: "PO-2026-0318", expectedDate: openUntil, challan: "BMS-900", lines: [{ lineId: "po318-1", quantity: 500 }] }));
    expect(state.deliveries[0]?.challan).toBe("BMS-900");
  });
});
