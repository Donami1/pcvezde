import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db/db";
import { faqItems, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { FaqForm, ReviewForm } from "@/components/admin/ContentForms";
import {
  createFaqAction,
  createReviewAction,
  deleteFaqAction,
  deleteReviewAction,
  toggleReviewAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Отзывы и FAQ",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm text-accent">
      {"★".repeat(rating)}
      <span className="text-zinc-600">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function AdminContentPage() {
  await requireAdmin();

  const [allReviews, allFaq] = await Promise.all([
    db.select().from(reviews).orderBy(desc(reviews.id)),
    db.select().from(faqItems).orderBy(desc(faqItems.id)),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-extrabold text-white font-display">
          Отзывы
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Видны на главной странице, если активны.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-300">
            Добавить отзыв
          </h2>
          <ReviewForm action={createReviewAction} submitLabel="Добавить" />
        </div>

        <div className="mt-5 space-y-3">
          {allReviews.length === 0 && (
            <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
              Отзывов пока нет.
            </p>
          )}
          {allReviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-2xl border bg-white/[0.03] p-4 ${review.isActive ? "border-white/10" : "border-white/5 opacity-55"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-white">{review.name}</span>
                {review.city && <span className="text-xs text-zinc-500">{review.city}</span>}
                <Stars rating={review.rating} />
                {!review.isActive && (
                  <span className="rounded-full bg-zinc-500/20 px-2 py-0.5 text-xs text-zinc-400">
                    скрыт
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-zinc-400 line-clamp-2">{review.text}</p>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                <Link
                  href={`/admin/content/review/${review.id}/edit`}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  Редактировать
                </Link>
                <ConfirmForm
                  action={toggleReviewAction.bind(null, review.id)}
                  confirmText={
                    review.isActive
                      ? "Скрыть этот отзыв с сайта?"
                      : "Показать этот отзыв на сайте?"
                  }
                >
                  <input type="hidden" name="isActive" value={String(!review.isActive)} />
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
                  >
                    {review.isActive ? "Скрыть" : "Показать"}
                  </button>
                </ConfirmForm>
                <ConfirmForm
                  action={deleteReviewAction.bind(null, review.id)}
                  confirmText={`Удалить отзыв «${review.name}» безвозвратно?`}
                  className="ml-auto"
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-400/50 hover:text-red-300"
                  >
                    Удалить
                  </button>
                </ConfirmForm>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h1 className="text-2xl font-extrabold text-white font-display">
          Вопросы и ответы
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Секция FAQ на главной странице.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-300">
            Добавить вопрос
          </h2>
          <FaqForm action={createFaqAction} submitLabel="Добавить" />
        </div>

        <div className="mt-5 space-y-3">
          {allFaq.length === 0 && (
            <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
              Вопросов пока нет.
            </p>
          )}
          {allFaq.map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-semibold text-white">{faq.question}</p>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{faq.answer}</p>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                <Link
                  href={`/admin/content/faq/${faq.id}/edit`}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  Редактировать
                </Link>
                <ConfirmForm
                  action={deleteFaqAction.bind(null, faq.id)}
                  confirmText={`Удалить вопрос «${faq.question}» безвозвратно?`}
                  className="ml-auto"
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-400/50 hover:text-red-300"
                  >
                    Удалить
                  </button>
                </ConfirmForm>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}