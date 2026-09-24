"use client";

import { useState } from "react";
import Link from "next/link";

const MOBILE_LINKS = [
  { num: "[01]", label: "Каталог ПК", href: "/catalog" },
  { num: "[02]", label: "Преимущества", href: "/#about" },
  { num: "[03]", label: "Как это работает", href: "/#how" },
  { num: "[04]", label: "Отзывы", href: "/#reviews" },
  { num: "[05]", label: "FAQ", href: "/#faq" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Меню"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center border border-line bg-panel text-zinc-100 transition hover:border-accent"
      >
        <span className="space-y-[5px]">
          <span
            className={`block h-[2px] w-5 bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[2px] w-5 bg-current transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-[2px] w-5 bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-line/60 bg-background/98 backdrop-blur-xl">
          <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-line/50 px-2 py-4 transition hover:bg-white/5"
              >
                <span className="font-mono text-[11px] text-accent">{link.num}</span>
                <span className="font-mono text-[15px] uppercase tracking-tight text-zinc-100">
                  {link.label}
                </span>
              </Link>
            ))}
            <Link
              href="/cabinet"
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 px-2 py-4 transition hover:bg-white/5"
            >
              <span className="font-mono text-[11px] text-accent">[--]</span>
              <span className="font-mono text-[15px] uppercase tracking-tight text-accent">
                Личный кабинет
              </span>
            </Link>
            <div className="flex gap-3 px-2 py-4">
              <Link
                href="/catalog"
                onClick={() => setOpen(false)}
                className="btn-cr flex-1 px-4 py-3 text-zinc-200"
              >
                Выбрать ПК
              </Link>
              <Link
                href="/#order"
                onClick={() => setOpen(false)}
                className="btn-solid-cr flex-1 px-4 py-3"
              >
                Заявка
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}