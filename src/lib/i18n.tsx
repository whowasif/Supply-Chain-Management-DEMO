import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "bn";

const labels: Record<string, string> = {
  Dashboard: "ড্যাশবোর্ড",
  Approvals: "অনুমোদন",
  Requisitions: "রিকুইজিশন",
  Plans: "পরিকল্পনা",
  "Market surveys": "বাজার জরিপ",
  Tenders: "টেন্ডার",
  Evaluations: "মূল্যায়ন",
  Suppliers: "সরবরাহকারী",
  "Purchase orders": "ক্রয় আদেশ",
  Contracts: "চুক্তি",
  Receiving: "পণ্য গ্রহণ",
  Inventory: "মজুদ",
  "Procurement plans": "ক্রয় পরিকল্পনা",
  "Tender evaluations": "টেন্ডার মূল্যায়ন",
  "Store issues": "স্টোর ইস্যু",
  Assets: "স্থায়ী সম্পদ",
  "Invoices & payments": "ইনভয়েস ও পরিশোধ",
  Reports: "প্রতিবেদন",
  "Audit trail": "অডিট",
  Overview: "সংক্ষিপ্ত চিত্র",
  "Supplier overview": "সরবরাহকারীর সংক্ষিপ্ত চিত্র",
  "My company": "আমার প্রতিষ্ঠান",
  "Available tenders": "খোলা টেন্ডার",
  "My bids": "আমার দর",
  "Awards and contracts": "অ্যাওয়ার্ড ও চুক্তি",
  Deliveries: "সরবরাহ",
  "Invoices and payments": "ইনভয়েস ও পরিশোধ",
  Notices: "নোটিশ",
  "Orders & invoices": "আদেশ ও ইনভয়েস",
  Workspace: "কর্মক্ষেত্র",
  Procurement: "ক্রয়",
  "Supply chain": "সরবরাহ চেইন",
  Oversight: "তদারকি",
  "Supplier portal": "সরবরাহকারী পোর্টাল",
  "Purchase requisitions": "ক্রয় অনুরোধ",
  "Delivery & receiving": "পণ্য গ্রহণ",
  "Tender management": "টেন্ডার ব্যবস্থাপনা",
  Notifications: "বিজ্ঞপ্তি",
};

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (english: string) => string };

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const t = (english: string) => (language === "bn" ? labels[english] ?? english : english);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used within LanguageProvider");
  return value;
}
