import Link from "next/link";
import type { Config } from "@/db/schema";
import type { Availability } from "@/lib/stock";
import { formatPrice } from "@/lib/format";
import { ConfigImage } from "./ConfigImage";

export function ConfigCard({
  config,
  availability,
}: {
  config: Config;
  availability?: Availability | null;
}) {
  const allBusy = !!availability && availability.total > 0 && availability.free === 0;

  return (
    <Link
      href={`/catalog/${config.slug}`}
      className="group fancy-corner flex h-full flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:[--line:var(--accent-1)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line/60">
        <ConfigImage
          config={config}
          className="h-full w-full transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141111] via-transparent to-transparent" />
        <span className="absolute right-4 top-4 border border-line bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-tight text-accent backdrop-blur">
          {config.gpu}
        </span>
        {availability && (
          <span
            className={`absolute bottom-4 left-4 border px-2 py-1 font-mono text-[10px] uppercase tracking-tight backdrop-blur ${
              allBusy
                ? "border-accent/60 bg-background/70 text-accent"
                : "border-line bg-background/70 text-zinc-300"
            }`}
          >
            {allBusy
              ? "все ПК заняты"
              : `свободно ${availability.free} из ${availability.total}`}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-tight text-zinc-600">
            аренда/сутки
          </p>
          <p className="font-display text-2xl font-bold tracking-tight text-white">
            {formatPrice(config.pricePerDay)}
          </p>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight text-white transition group-hover:text-accent-soft">
          {config.name}
        </h3>
        {config.shortDesc && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {config.shortDesc}
          </p>
        )}

        <dl className="mt-4 space-y-2 text-[13px]">
          {[
            ["процессор", config.cpu],
            ["память", config.ram],
            ["накопитель", config.storage],
          ].map(([dt, dd]) => (
            <div key={dt} className="flex items-baseline justify-between gap-3 border-b border-line/40 pb-2">
              <dt className="text-caption text-zinc-500">{dt}</dt>
              <dd className="text-right text-zinc-200">{dd}</dd>
            </div>
          ))}
        </dl>

        {config.pricePerMonth && (
          <p className="mt-4 font-mono text-[12px] uppercase tracking-tight text-zinc-500">
            {formatPrice(config.pricePerMonth)}/мес при оплате за месяц
          </p>
        )}

        <div className="mt-auto pt-5">
          <span className="btn-cr w-full px-4 py-3 text-zinc-200 group-hover:[--line:var(--accent-1)]">
            подробнее
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13 9c0 .26-.1.52-.29.71a1 1 0 0 1-.71.29H4.91l2.3 2.29-.71.71L3 9.5 6.5 6l.71.71-2.3 2.29h8.09V4h1v5Z" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}