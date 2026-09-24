import Link from "next/link";
import type { SiteConfig } from "@/lib/settings";
import { getUserSessionId } from "@/lib/auth";
import { MobileMenu } from "./MobileMenu";

export function Logo({ name = "ПК Везде" }: { name?: string }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="На главную">
      <span className="relative inline-flex h-9 w-9 items-center justify-center bg-accent font-mono text-sm font-bold text-black transition group-hover:brightness-110">
        Z
      </span>
      <span className="font-display text-sm font-extrabold uppercase tracking-tight text-white">
        {name}
      </span>
    </Link>
  );
}

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="nav-item group px-3 py-2 text-zinc-300 transition hover:text-white">
      <span className="link-duplicate-wrapper">
        <span className="link-duplicate">
          <span className="link-duplicate__text" data-text={label}>
            {label}
          </span>
        </span>
      </span>
    </Link>
  );
}

const CATALOG_ITEMS = [
  { num: "[01]", label: "Все конфигурации", href: "/catalog" },
  { num: "[02]", label: "Почему мы", href: "/#about" },
  { num: "[03]", label: "Как это работает", href: "/#how" },
  { num: "[04]", label: "Отзывы", href: "/#reviews" },
  { num: "[05]", label: "FAQ", href: "/#faq" },
];

export async function Header({ site }: { site: SiteConfig }) {
  const loggedIn = (await getUserSessionId()) !== null;
  const contacts = site.contacts;

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between gap-4 border-b border-line/40 px-4 sm:px-6">
          <Logo name={site.name} />

          <div className="hidden items-center gap-5 md:flex">
            <span className="text-caption text-zinc-500">работаем 24/7</span>
            <a
              href={`tel:${contacts.phoneHref}`}
              className="font-mono text-[13px] uppercase tracking-tight text-zinc-100 transition hover:text-accent"
            >
              {contacts.phone}
            </a>
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
              className="text-zinc-400 transition hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C19.71 2 23.27 3.48 25.9 6.1A13.42 13.42 0 0 1 30 16c0 3.71-1.48 7.27-4.1 9.9A13.42 13.42 0 0 1 16 30c-3.71 0-7.28-1.48-9.9-4.1A13.42 13.42 0 0 1 2 16c0-3.71 1.48-7.27 4.1-9.9A13.42 13.42 0 0 1 16 2Zm5.72 8.43c-.53.02-1.22.3-5.22 1.91-2.05.68-3.33 1.02-3.75 1.1a2.9 2.9 0 0 0-1.18.44c-.33.26-.32.67-.3.79.06.29.38.44 1.1.66l.36.13c.44.16.95.3 1.32.31.34 0 .71-.13 1.13-.4 3.81-2.57 3.83-3.09 3.91-3.31.04-.1.08-.14.13-.16.05-.02.12-.03.19.01.08.05.12.13.1.16-.09.2-1.6 1.7-1.76 1.86-.34.35-.59.57-.59.61 0 .01-.01.02-.02.03l-.14.12c-1.3.98-1.9 1.45-1.82 2.09.04.28.15.51.34.68.18.17.36.24.57.24.3-.01.64-.25 1.87-1.27.32-.27.6-.48.84-.57.17-.06.34-.07.52-.01.28.1.5.4.43.9-.05.44-.42 1.06-.79 1.48-.35.39-.77.75-1.16 1.07-.4.34-.82.68-1.24 1.03-.35.28-.7.6-.95.86-.4.46-.22 1.04-.05 1.22.2.21.62.22.86.2.4-.03.72-.18.96-.3.31-.16 1.01-.64 2.13-1.52 1.27-1 2.02-1.6 2.16-1.8.05-.07.09-.13.1-.19.01-.07.03-.16-.08-.23-.1-.06-.28-.07-.39-.06-.17.02-.5.08-.9.22l-3.42 1.12c-.3.1-.62.13-.9 0-.17-.1-.34-.2-.49-.32a22.7 22.7 0 0 0-.6-.46c-.66-.5-1.05-.78-1.4-1.05-.2-.2-.4-.3-.56-.36.5.17 1 .33 1.5.48l6.72-1.89c.42-.12.76-.2 1-.27.21-.06.35-.09.46-.08.14 0 .23.04.27.1.05.1.07.24.04.36-.07.22-.52.82-1.28 1.5-.53.47-.95.83-1.33 1.14.15.08.3.18.45.29l.9.66.03.02.58.5c.72.64.96 1.13 1.18 1.5.2.33.3.63.34.9.04.25 0 .49-.16.7-.22.3-.64.43-1.04.33l-.08-.03.14.06c-.4.1-.82.17-1.23.22.4.12.8.18 1.2.23.86.1 1.45-.17 1.63-.77.04-.13.06-.33.05-.55V18.6c0-.8-.01-1.77 0-2.66.02-1.37.1-2.56-.36-3.22l-.02-.04c-.23-.3-.5-.5-.82-.62-.42-.16-.85-.22-1.26-.23Z" />
              </svg>
            </a>
            <a
              href={contacts.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
              className="text-zinc-400 transition hover:text-emerald-400"
            >
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2a13.9 13.9 0 0 0-11.98 21L2.6 29.4l6.6-1.72A13.93 13.93 0 1 0 16 2Zm0 25.32a11.35 11.35 0 0 1-5.79-1.59l-.42-.25-3.92 1.02 1.05-3.82-.28-.44A11.36 11.36 0 1 1 16 27.32Zm6.36-8.52c-.34-.17-2.05-1.01-2.37-1.13-.32-.12-.55-.17-.79.17-.23.34-.9 1.13-1.1 1.36-.2.23-.4.25-.75.09-.34-.17-1.45-.53-2.75-1.7-1.02-.91-1.7-2.03-1.9-2.37-.2-.34-.02-.53.15-.7.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.22.06-.42-.03-.59-.09-.17-.78-1.88-1.07-2.58-.28-.68-.57-.59-.79-.6l-.67-.01c-.23 0-.6.09-.92.43-.32.34-1.2 1.18-1.2 2.87s1.23 3.33 1.4 3.56c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.57 1.96.72.82.26 1.57.23 2.16.14.66-.1 2.05-.84 2.34-1.65.29-.8.29-1.5.2-1.65-.08-.15-.3-.23-.64-.4Z" />
              </svg>
            </a>

            <Link
              href={loggedIn ? "/cabinet" : "/cabinet/login"}
              className="inline-flex items-center gap-2 text-caption text-zinc-400 transition hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.5 9c.93 0 1.82.37 2.47 1.03C12.63 10.68 13 11.57 13 12.5V15h-1v-2.5a2.6 2.6 0 0 0-.4-1.4A2.44 2.44 0 0 0 9.5 10h-3a2.44 2.44 0 0 0-2.1 1.1c-.26.4-.4.89-.4 1.4V15H3v-2.5c0-.93.37-1.82 1.03-2.47A3.5 3.5 0 0 1 6.5 9h3ZM8 1a3.5 3.5 0 0 1 1.34 6.76 3.5 3.5 0 0 1-2.68 0A3.5 3.5 0 0 1 8 1Zm0 1a2.5 2.5 0 0 0-1.06 4.76c.32.15.68.24 1.06.24a2.5 2.5 0 0 0 0-5Z" />
              </svg>
              {loggedIn ? "кабинет" : "вход"}
            </Link>
          </div>

          <MobileMenu />
        </div>

        <nav className="hidden h-12 items-center gap-1 px-6 md:flex">
          <div className="group relative">
            <button type="button" className="nav-item flex items-center gap-1.5 px-3 py-2 text-zinc-300 transition hover:text-white">
              <span className="link-duplicate-wrapper">
                <span className="link-duplicate">
                  <span className="link-duplicate__text" data-text="Каталог ПК">Каталог ПК</span>
                </span>
              </span>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="opacity-60 transition group-hover:rotate-180">
                <path d="M8 10L4 6h8L8 10Z" />
              </svg>
            </button>

            <div className="invisible absolute left-0 top-full z-50 w-80 border border-line bg-[#141111] opacity-0 shadow-2xl transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul>
                {CATALOG_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group/item flex items-baseline gap-4 border-b border-line/50 px-5 py-3.5 transition hover:bg-white/5"
                    >
                      <span className="font-mono text-[11px] text-accent">{item.num}</span>
                      <span className="text-sm text-zinc-200 transition group-hover/item:text-white">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/catalog"
                className="btn-cr m-4 w-[calc(100%-32px)] px-5 py-3 text-zinc-200"
              >
                перейти в каталог
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13 9c0 .26-.1.52-.29.71a1 1 0 0 1-.71.29H4.91l2.3 2.29-.71.71L3 9.5 6.5 6l.71.71-2.3 2.29h8.09V4h1v5Z" />
                </svg>
              </Link>
            </div>
          </div>

          <NavItem href="/#about" label="Преимущества" />
          <NavItem href="/#how" label="Как это работает" />
          <NavItem href="/#reviews" label="Отзывы" />
          <NavItem href="/#faq" label="FAQ" />

          <div className="ml-auto flex items-center gap-3">
            <Link href="/catalog" className="btn-cr px-5 py-2.5 text-zinc-200">
              Выбрать ПК
            </Link>
            <Link href="/#order" className="btn-solid-cr px-5 py-2.5">
              Оставить заявку
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}