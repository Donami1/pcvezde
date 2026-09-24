import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { getNewBookingsCount } from "@/lib/data";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newCount = await getNewBookingsCount();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-white/5 bg-[#0a0a12]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Заявки
              {newCount > 0 && (
                <span className="ml-1.5 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                  {newCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin/configs"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Конфигурации
            </Link>
            <Link
              href="/admin/units"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Склад ПК
            </Link>
            <Link
              href="/admin/content"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Отзывы и FAQ
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Настройки
            </Link>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:text-white"
            >
              На сайт
            </Link>
          </nav>

          <form action={logoutAction} className="ml-auto">
            <button
              type="submit"
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:border-red-400/50 hover:text-red-300"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}