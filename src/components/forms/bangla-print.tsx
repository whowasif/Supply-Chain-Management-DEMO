import { formatBDT, formatDisplayDate, linesTotal, projectName, type GoodsReceipt, type PurchaseOrder, type Requisition } from "@/lib/domain";
import type { ProcurementState } from "@/lib/domain";

const statusBn: Record<string, string> = {
  Draft: "খসড়া",
  Submitted: "জমা",
  Returned: "ফেরত",
  Approved: "অনুমোদিত",
  Rejected: "বাতিল",
  Issued: "ইস্যুকৃত",
  "Partially received": "আংশিক গৃহীত",
  Received: "গৃহীত",
  Closed: "বন্ধ",
  Posted: "পোস্টকৃত",
  Accepted: "গৃহীত",
};

export function statusInBangla(status: string) {
  return statusBn[status] ?? status;
}

const sheetClass = "bangla-sheet space-y-4 bg-white p-6 text-black";
const fontStyle = { fontFamily: '"Noto Sans Bengali", "Nirmala UI", "Kalpurush", "SolaimanLipi", sans-serif' };

export function printSheet() {
  window.print();
}

export function RequisitionBangla({ state, requisition }: { state: ProcurementState; requisition: Requisition }) {
  const project = state.projects.find((item) => item.id === requisition.projectId);
  return (
    <article className={sheetClass} style={fontStyle}>
      <header>
        <p className="text-xs">নমুনা · আহছানিয়া মিশন ক্রয়</p>
        <h2 className="text-2xl font-bold">ক্রয় অনুরোধ</h2>
        <p>{requisition.id} · {statusInBangla(requisition.status)}</p>
      </header>
      <p><strong>শিরোনাম:</strong> {requisition.title}</p>
      <p><strong>অনুরোধকারী:</strong> {requisition.requester}</p>
      <p><strong>প্রকল্প:</strong> {project?.name ?? "—"} · <strong>দাতা:</strong> {project?.donor ?? "—"} · <strong>বাজেট খাত:</strong> {project?.budgetHead ?? "—"}</p>
      <p><strong>প্রয়োজনের তারিখ:</strong> {formatDisplayDate(requisition.needBy)} · <strong>পদ্ধতি:</strong> {requisition.method}</p>
      <p>{requisition.justification}</p>
      <table className="w-full text-left text-sm">
        <thead><tr><th>বিবরণ</th><th>পরিমাণ</th><th>দর</th><th>মোট</th></tr></thead>
        <tbody>
          {requisition.lines.map((line) => <tr key={line.id}><td>{line.description}</td><td>{line.quantity} {line.unit}</td><td>{formatBDT(line.unitPrice)}</td><td>{formatBDT(line.quantity * line.unitPrice)}</td></tr>)}
        </tbody>
      </table>
      <p className="text-right font-bold">মোট {formatBDT(linesTotal(requisition.lines))}</p>
    </article>
  );
}

export function PurchaseOrderBangla({ state, order }: { state: ProcurementState; order: PurchaseOrder }) {
  return (
    <article className={sheetClass} style={fontStyle}>
      <header>
        <p className="text-xs">নমুনা · আহছানিয়া মিশন ক্রয়</p>
        <h2 className="text-2xl font-bold">ক্রয় আদেশ</h2>
        <p>{order.id} · {statusInBangla(order.status)}</p>
      </header>
      <p><strong>শিরোনাম:</strong> {order.title}</p>
      <p><strong>সরবরাহকারী:</strong> {order.supplierName}</p>
      <p><strong>প্রকল্প:</strong> {projectName(state, order.projectId)}</p>
      <p><strong>সরবরাহের স্থান:</strong> {order.deliveryLocation} · <strong>তারিখ:</strong> {formatDisplayDate(order.needBy)}</p>
      <table className="w-full text-left text-sm">
        <thead><tr><th>বিবরণ</th><th>পরিমাণ</th><th>দর</th><th>মোট</th></tr></thead>
        <tbody>
          {order.lines.map((line) => <tr key={line.id}><td>{line.description}</td><td>{line.quantity} {line.unit}</td><td>{formatBDT(line.unitPrice)}</td><td>{formatBDT(line.quantity * line.unitPrice)}</td></tr>)}
        </tbody>
      </table>
      <p className="text-right font-bold">মোট {formatBDT(linesTotal(order.lines))}</p>
    </article>
  );
}

export function ReceiptBangla({ state, receipt }: { state: ProcurementState; receipt: GoodsReceipt }) {
  return (
    <article className={sheetClass} style={fontStyle}>
      <header>
        <p className="text-xs">নমুনা · আহছানিয়া মিশন ক্রয়</p>
        <h2 className="text-2xl font-bold">পণ্য গ্রহণ নোট</h2>
        <p>{receipt.id} · {statusInBangla(receipt.quality)}</p>
      </header>
      <p><strong>ক্রয় আদেশ:</strong> {receipt.purchaseOrderId}</p>
      <p><strong>গুদাম:</strong> {receipt.warehouse}</p>
      <p><strong>প্রকল্প:</strong> {projectName(state, receipt.projectId)}</p>
      <p><strong>চালান:</strong> {receipt.challan || "—"}</p>
      <table className="w-full text-left text-sm">
        <thead><tr><th>বিবরণ</th><th>গৃহীত</th><th>ব্যাচ</th><th>মেয়াদ</th></tr></thead>
        <tbody>
          {receipt.lines.map((line, index) => <tr key={`${line.lineId}-${index}`}><td>{line.description}</td><td>{line.receivedNow}</td><td>{line.batch || "—"}</td><td>{line.expiry ? formatDisplayDate(line.expiry) : "—"}</td></tr>)}
        </tbody>
      </table>
      <p className="text-xs">নমুনা দলিল। মাঠ পর্যায়ের কর্মী ও ট্রাস্টি এটি বাংলায় পড়তে পারবেন।</p>
    </article>
  );
}
