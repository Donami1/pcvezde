import Link from "next/link";
import Image from "next/image";
import { getActiveConfigs } from "@/lib/data";
import { getSiteConfig } from "@/lib/settings";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

export async function Hero() {
  const [configs, site] = await Promise.all([getActiveConfigs(), getSiteConfig()]);
  const flagship = configs[configs.length - 1] ?? null;
  const stats = site.heroStats;
  const hero = site.heroText;
  const titleParts = hero.title.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <section className="relative flex min-h-[90svh] flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-cta-grid opacity-60" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[520px] w-[720px] animate-glow-drift rounded-full bg-accent/20 blur-[150px]" />

      {flagship && (
        <div className="pointer-events-none absolute inset-y-0 right-[-6%] hidden w-[46%] opacity-50 [mask-image:linear-gradient(90deg,transparent,black_60%)] lg:block">
          <Image
            src={flagship.image ?? `/images/configs/${flagship.slug}.svg`}
            alt=""
            width={1100}
            height={800}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pb-0 pt-28 sm:px-6">
        <Reveal>
          <p className="text-caption text-accent">
            {hero.caption}
            <span className="ml-2 inline-block h-[1.05em] w-[0.55em] animate-blink bg-accent align-baseline" />
          </p>
          <h1 className="mt-5 max-w-[16ch] font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[68px]">
            {titleParts.map((part, i) =>
              part.startsWith("*") && part.endsWith("*") ? (
                <span key={i} className="text-accent">
                  {part.slice(1, -1)}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h1>
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 lg:ml-auto lg:mt-14 lg:max-w-md">
          <Reveal delay={120}>
            <p className="text-zinc-300">{hero.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn-cr px-6 py-3.5 text-zinc-100">
                {hero.ctaPrimary}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13 9c0 .26-.1.52-.29.71a1 1 0 0 1-.71.29H4.91l2.3 2.29-.71.71L3 9.5 6.5 6l.71.71-2.3 2.29h8.09V4h1v5Z" />
                </svg>
              </Link>
              <Link href="#order" className="btn-solid-cr px-6 py-3.5">
                {hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-line lg:mt-16">
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <div className="border-b border-r border-line/60 py-6 pr-4 max-md:[&:nth-child(odd)]:border-r-0 md:[&:last-child]:border-r-0">
                  <dt className="font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="mt-2 text-caption text-zinc-500">{stat.label}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}