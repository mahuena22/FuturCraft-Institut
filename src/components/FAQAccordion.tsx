"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQAccordion({
  faqs,
  openDefault = 0,
}: {
  faqs: FaqItem[];
  openDefault?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    openDefault >= 0 && openDefault < faqs.length ? openDefault : null
  );

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-2xl bg-white border shadow-xs overflow-hidden transition-colors ${
              isOpen ? "border-blue-300 ring-1 ring-blue-100" : "border-slate-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                <HelpCircle
                  className={`w-5 h-5 shrink-0 ${isOpen ? "text-blue-600" : "text-slate-400"}`}
                />
                <span className="text-sm font-bold text-slate-900">{faq.q}</span>
              </span>
              <span
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isOpen
                    ? "bg-blue-600 text-white rotate-180"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden min-h-0">
                <p className="pl-13 pr-5 pb-4 text-sm leading-relaxed text-slate-600">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
