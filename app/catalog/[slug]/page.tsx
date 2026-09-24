import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveConfigs, getConfigBySlug, featuresToList } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { getAvailabilityMap, isAllBusy } from "@/lib/stock";
import { ConfigImage } from "@/components/ConfigImage";
import { ConfigCard } from "@/components/ConfigCard";
import { BookingForm } from "@/components/BookingForm";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getConfigBySlug(slug);
  if (!config) return { title: "Конфигурация не найдена" };
  return {
    title: `${config.name} — аренда от ${formatPrice(config.pricePerDay)}/сутки`,
    description:
      config.shortDesc ??
      `Аренда ПК «${config.name}» на дом: ${config.cpu}, ${config.gpu}, ${config.ram}. ${formatPrice(config.pricePerDay)}/сутки, ${config.pricePerMonth ? formatPrice(config.pricePerMonth) + "/мес, " : ""}доставка бесплатно.`,
  };
}

export default async function ConfigDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getConfigBySlug(slug);
  if (!config) notFound();

  const features = featuresToList(config.features);
  const allConfigs = await getActiveConfigs();
  const related = allConfigs.filter((c) => c.id !== config.id).slice(0, 3);

  const availability = await getAvailabilityMap();
  const myStock = availability.get(config.id) ?? null;
  const allBusy = isAllBusy(myStock);
  const availabilityText = myStock
    ? allBusy
      ? "все ПК заняты"
      : `свободно ${myStock.free} из ${myStock.total}`
    : "в наличии";

  const specs = [
    { label: "видеокарта", value: config.gpu },
    { label: "процессор", value: config.cpu },
    { label: "оперативная память", value: config.ram },
    { label: "накопитель", value: config.storage },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <nav className="mb-10 font-mono text-[11px] uppercase tracking-tight text-zinc-600">
        <Link href="/" className="transition hover:text-accent">
          главная
        </Link>
        <span className="mx-2 text-zinc-700">/</span>
        <Link href="/catalog" className="transition hover:text-accent">
          каталог
        </Link>
        <span className="mx-2 text-zinc-700">/</span>
        <span className="text-accent">{config.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="fancy-corner p-0">
            <ConfigImage
              config={config}
              className="aspect-[16/10] h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-line/60 pt-6">
            {[
              ["залог", "не нужен"],
              ["доставка", "бесплатно"],
              ["выкуп", "со скидкой"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-caption text-zinc-600">{label}</p>
                <p className="mt-1 font-mono text-[13px] uppercase tracking-tight text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[12px] uppercase tracking-tight text-accent">
              /конфигурация #01
            </p>
            <p className="font-mono text-[12px] uppercase tracking-tight text-zinc-600">
              {availabilityText}
            </p>
          </div>
          <h1 className="mt-4 max-w-[16ch] font-display text-3xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {config.name}
          </h1>
          {config.shortDesc && (
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              {config.shortDesc}
            </p>
          )}

          <dl className="mt-7">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-4 border-b border-line/50 py-3.5"
              >
                <dt className="font-mono text-[12px] uppercase tracking-tight text-zinc-500">
                  {spec.label}
                </dt>
                <dd className="text-right font-mono text-[14px] tracking-tight text-zinc-100">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>

          {features.length > 0 && (
            <ul className="mt-6 space-y-2">
              {features.map((feature, i) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="mt-0.5 font-mono text-[10px] text-accent">
                    [{"+"}]
                  </span>
                  <span className="[&:nth-child(2)]:flex-1">{feature}</span>
                  <span className="font-mono text-[10px] text-zinc-600">
                    {i + 1}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 border border-accent/50 bg-accent/10 p-7">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="text-caption text-zinc-400">аренда / сутки</p>
                <p className="mt-1 font-display text-4xl font-bold tracking-tight text-white">
                  {formatPrice(config.pricePerDay)} ₽
                </p>
              </div>
              {config.pricePerMonth && (
                <div>
                  <p className="text-caption text-zinc-400">аренда / месяц</p>
                  <p className="mt-1 font-display text-2xl font-bold tracking-tight text-accent-soft">
                    {formatPrice(config.pricePerMonth)} ₽
                  </p>
                </div>
              )}
            </div>
            <Link href="#order" className="btn-solid-cr mt-6 w-full px-6 py-3.5">
              арендовать этот ПК
            </Link>
          </div>
        </Reveal>
      </div>

      <div id="order" className="mx-auto mt-20 max-w-xl scroll-mt-28">
        <div className="fancy-corner bg-panel p-8">
          <p className="mb-4 font-mono text-[12px] uppercase tracking-tight text-accent">
            /{[config.name.toLowerCase().slice(0, 16)]}
          </p>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Оставить заявку
          </h2>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-tight text-zinc-500">
            заполните форму — перезвоним за 15 минут и согласуем доставку
          </p>
          <div className="mt-6">
            <BookingForm configName={config.name} allBusy={allBusy} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <header className="index-header">
            <div>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-tight text-accent">
                /ещё
              </p>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                другие конфигурации
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-caption text-zinc-400 transition hover:text-accent"
            >
              смотреть все →
            </Link>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ConfigCard
                key={item.id}
                config={item}
                availability={availability.get(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}