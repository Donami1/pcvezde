import Link from "next/link";
import type { SiteConfig } from "@/lib/settings";
import { Logo } from "./Header";

export function Footer({ site }: { site: SiteConfig }) {
  const contacts = site.contacts;

  const nav: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "навигация",
      links: [
        { label: "каталог ПК", href: "/catalog" },
        { label: "преимущества", href: "/#about" },
        { label: "как это работает", href: "/#how" },
        { label: "отзывы", href: "/#reviews" },
        { label: "faq", href: "/#faq" },
      ],
    },
    {
      title: "клиентам",
      links: [
        { label: "оставить заявку", href: "/#order" },
        { label: "личный кабинет", href: "/cabinet" },
        { label: "вход для клиента", href: "/cabinet/login" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md space-y-5">
            <Logo name={site.name} />
            <p className="text-sm leading-relaxed text-zinc-400">
              {site.tagline}. Привозим, настраиваем и забираем — вы просто играете.
            </p>
            <p className="font-mono text-[12px] uppercase tracking-tight text-zinc-600">
              работаем без выходных · {contacts.city || "город"}
            </p>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-tight text-accent">
            [01] напишите нам
          </p>
        </div>

        <div className="mt-12 border-y border-line/60 py-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-tight text-zinc-500">
                телефон / whatsapp
              </p>
              <a
                href={`tel:${contacts.phoneHref}`}
                className="link-duplicate block"
              >
                <span
                  className="link-duplicate__text font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-5xl"
                  data-text={contacts.phone}
                >
                  {contacts.phone}
                </span>
              </a>
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="link-duplicate block"
              >
                <span
                  className="link-duplicate__text font-display text-2xl font-bold uppercase leading-none tracking-tight text-accent sm:text-3xl"
                  data-text="@pcvezde"
                >
                  @pcvezde
                </span>
              </a>
            </div>

            <div className="grid gap-10 sm:grid-cols-2">
              {nav.map((column) => (
                <div key={column.title}>
                  <h3 className="font-mono text-[11px] uppercase tracking-tight text-zinc-500">
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="group inline-flex items-center gap-2">
                          <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                          <span className="text-sm text-zinc-400 transition hover:text-white">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-tight text-zinc-600">
            © {new Date().getFullYear()} {site.name} · аренда игровых ПК
          </p>
          <p className="font-mono text-[11px] uppercase tracking-tight text-zinc-600">
            не является публичной офертой
          </p>
        </div>
      </div>
    </footer>
  );
}