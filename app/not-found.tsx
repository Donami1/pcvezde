import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-cta-grid opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 animate-glow-drift rounded-full bg-accent/20 blur-[140px]" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-tight text-accent">
            error 404<span className="ml-2 inline-block h-[1.05em] w-[0.55em] animate-blink bg-accent align-baseline" />
          </p>
          <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-none tracking-tight text-white sm:text-8xl">
            Нет такой<br />
            <span className="text-stroke">страницы</span>
          </h1>
          <p className="mt-6 font-mono text-[13px] uppercase tracking-tight text-zinc-400">
            похоже, вы зашли не туда — этой страницы не существует или она была перемещена
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-solid-cr px-7 py-3.5">
              на главную
            </Link>
            <Link href="/catalog" className="btn-cr px-7 py-3.5 text-zinc-200">
              выбрать ПК
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}