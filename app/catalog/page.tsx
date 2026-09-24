import type { Metadata } from "next";
import Link from "next/link";
import { getActiveConfigs } from "@/lib/data";
import { getAvailabilityMap } from "@/lib/stock";
import { ConfigCard } from "@/components/ConfigCard";

export const metadata: Metadata = {
  title: "Каталог конфигураций",
  description:
    "Аренда игровых ПК на дом — выберите конфигурацию: от бюджетной до флагманской. Доставка и настройка бесплатно.",
};

export const dynamic = "force-dynamic";

type SortOrder = "default" | "price_asc" | "price_desc";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q = "", sort = "default" } = await searchParams;
  const query = q.trim().toLowerCase();

  let configs = await getActiveConfigs();

  if (query) {
    configs = configs.filter((c) =>
      [c.name, c.gpu, c.cpu, c.ram, c.storage, c.shortDesc ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  const sortOrder: SortOrder = ["default", "price_asc", "price_desc"].includes(sort)
    ? (sort as SortOrder)
    : "default";

  if (sortOrder === "price_asc") {
    configs = [...configs].sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortOrder === "price_desc") {
    configs = [...configs].sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  const count = configs.length;
  const availability = await getAvailabilityMap();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="index-header">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-[12px] uppercase tracking-tight text-accent">
            /каталог
          </p>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl">
            Каталог игровых ПК
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-400">
            Все конфигурации проверяются и настраиваются перед выдачей. Доставка
            и установка — бесплатно в пределах города.
          </p>
        </div>
        <p className="font-mono text-[12px] uppercase tracking-tight text-zinc-500">
          найдено: {count} шт.
        </p>
      </header>

      <form method="get" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[12px] text-zinc-600">
            поиск
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="RTX 3060, Ryzen, 32 ГБ..."
            className="w-full border border-line bg-panel px-20 py-3.5 font-mono text-[13px] tracking-tight text-white placeholder:text-zinc-600 outline-none transition focus:border-accent"
          />
        </label>

        <select
          name="sort"
          defaultValue={sortOrder}
          className="border border-line bg-panel px-4 py-3.5 font-mono text-[13px] text-white outline-none transition focus:border-accent [&>option]:bg-panel"
        >
          <option value="default">сортировка: по умолчанию</option>
          <option value="price_asc">сначала дешевле</option>
          <option value="price_desc">сначала дороже</option>
        </select>

        <button
          type="submit"
          className="btn-solid-cr px-6 py-3.5"
        >
          применить
        </button>

        {query && (
          <Link
            href="/catalog"
            className="border border-line px-4 py-3.5 font-mono text-[13px] uppercase tracking-tight text-zinc-300 transition hover:border-accent hover:text-white"
          >
            сбросить
          </Link>
        )}
      </form>

      {count === 0 ? (
        <div className="fancy-corner mt-8 p-16 text-center">
          <p className="font-display text-xl font-bold uppercase tracking-tight text-zinc-200">
            по запросу «{q}» ничего не найдено
          </p>
          <p className="mt-2 font-mono text-[13px] text-zinc-500">
            попробуйте изменить запрос или сбросить фильтры
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {configs.map((config) => (
            <ConfigCard
              key={config.id}
              config={config}
              availability={availability.get(config.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}