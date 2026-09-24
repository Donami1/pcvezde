"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  duration = 900,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match?.[2] ?? "";

  useEffect(() => {
    if (target === null) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const n = Math.round(target * eased);
          setDisplay(`${n}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration, suffix, target, value]);

  return <span ref={ref}>{display}</span>;
}