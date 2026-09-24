"use client";

import { useState } from "react";

export type FaqEntry = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className={`fancy-corner--top-left bg-transparent! transition [--cut:22px] ${open ? "[--line:var(--accent-1)]" : ""}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="flex items-baseline gap-4">
                <span className="hidden font-mono text-[11px] text-accent sm:inline">
                  [0{index + 1}]
                </span>
                <span className="font-semibold uppercase tracking-tight text-white font-display text-sm">
                  {item.question}
                </span>
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center border border-line font-mono text-base text-accent transition-transform duration-300 ${open ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-5 pl-6 sm:pl-14">
                  <p className="text-sm leading-relaxed text-zinc-400">{item.answer}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}