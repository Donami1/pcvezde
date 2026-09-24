import Link from "next/link";
import { SectionHead, IconedArrow } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { getActiveReviews } from "@/lib/data";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="font-mono text-sm tracking-tight text-accent">
      {"★".repeat(rating)}
      <span className="text-zinc-700">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export async function Reviews() {
  const reviews = await getActiveReviews();

  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead
        eyebrow="отзывы"
        title="что говорят клиенты"
        subtitle="Реальные истории людей, которые уже играют на ПК с доставкой на дом."
        aside={
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 text-caption text-zinc-300 transition hover:text-white"
          >
            смотреть все ПК
            <IconedArrow />
          </Link>
        }
      />

      {reviews.length === 0 ? (
        <p className="fancy-corner p-10 text-center font-mono text-[13px] uppercase tracking-tight text-zinc-500">
          Отзывы скоро появятся.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 70}>
              <figure className="group flex h-full flex-col p-7 fancy-corner transition hover:-translate-y-1 hover:[--line:var(--accent-1)]">
                <div className="flex items-center justify-between">
                  <Stars rating={review.rating} />
                  <span className="text-caption text-zinc-600">отзыв #[{String(i + 1).padStart(2, "0")}]</span>
                </div>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-zinc-300">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-baseline gap-3 border-t border-line/60 pt-4">
                  <span className="font-mono text-[12px] font-medium uppercase tracking-tight text-white">
                    {review.name}
                  </span>
                  <span className="text-caption text-zinc-600">
                    {review.city || "клиент сервиса"}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}