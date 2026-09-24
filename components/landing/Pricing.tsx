import type { Config } from "@/db/schema";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { ConfigImage } from "@/components/ConfigImage";
import { SectionHead, IconedArrow } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";

export function Pricing({
  configs,
}: {
  configs: Config[];
}) {
  const featured = configs.slice(0, 3);

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead
        eyebrow="тарифы"
        title="линейка ПК"
        subtitle="Прозрачные цены за сутки и месяц. Чем дольше аренда — тем выгоднее, а при выкупе аренда вычитается из цены ПК."
        aside={
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 text-caption text-zinc-300 transition hover:text-white"
          >
            все конфигурации
            <IconedArrow />
          </Link>
        }
      />

      {featured.length === 0 ? (
        <p className="fancy-corner p-12 text-center font-mono text-[13px] text-zinc-500">
          тарифы появятся скоро
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((config, index) => {
            const highlight = index === 1;
            return (
              <Reveal key={config.id} delay={index * 90}>
                <div
                  className={`group fancy-corner flex h-full flex-col p-0 transition hover:-translate-y-1 hover:[--line:var(--accent-1)] ${
                    highlight ? "[--line:var(--accent-1)]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-line/60 px-6 py-3">
                    <span className="font-mono text-[11px] text-accent">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>
                    {highlight && (
                      <span className="font-mono text-[10px] uppercase tracking-tight text-accent-soft">
                        самый популярный
                      </span>
                    )}
                  </div>

                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ConfigImage
                      config={config}
                      className="h-full w-full transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                      {config.name}
                    </h3>
                    <p className="mt-1 font-mono text-[12px] uppercase tracking-tight text-zinc-500">
                      {config.gpu}
                    </p>

                    <div className="mt-5 space-y-2">
                      <div className="flex items-baseline justify-between border-b border-line/50 pb-2">
                        <span className="text-caption text-zinc-500">в сутки</span>
                        <span className="font-display text-xl font-bold tracking-tight text-white">
                          {formatPrice(config.pricePerDay)}
                        </span>
                      </div>
                      {config.pricePerMonth && (
                        <div className="flex items-baseline justify-between border-b border-line/50 pb-2">
                          <span className="text-caption text-zinc-500">в месяц</span>
                          <span className="font-display text-xl font-bold tracking-tight text-accent-soft">
                            {formatPrice(config.pricePerMonth)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/catalog/${config.slug}`}
                      className="btn-cr mt-6 w-full px-4 py-3 text-zinc-200"
                    >
                      подробнее
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13 9c0 .26-.1.52-.29.71a1 1 0 0 1-.71.29H4.91l2.3 2.29-.71.71L3 9.5 6.5 6l.71.71-2.3 2.29h8.09V4h1v5Z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}