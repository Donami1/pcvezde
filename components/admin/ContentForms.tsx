import type { FaqItem, Review } from "@/db/schema";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-accent/60 focus:bg-white/10";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

export function ReviewForm({
  action,
  review,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  review?: Review;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Имя *</label>
          <input
            id="name"
            name="name"
            required
            defaultValue={review?.name}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">Город</label>
          <input
            id="city"
            name="city"
            defaultValue={review?.city ?? ""}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="rating">Оценка (1–5)</label>
          <select
            id="rating"
            name="rating"
            defaultValue={review?.rating ?? 5}
            className={inputClass}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="sortOrder">Порядок</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={review?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-300">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={review ? review.isActive : true}
              className="h-4 w-4 rounded accent-accent"
            />
            Активен
          </label>
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="text">Текст отзыва *</label>
        <textarea
          id="text"
          name="text"
          required
          rows={3}
          defaultValue={review?.text ?? ""}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function FaqForm({
  action,
  faq,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  faq?: FaqItem;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="question">Вопрос *</label>
          <input
            id="question"
            name="question"
            required
            defaultValue={faq?.question}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="sortOrder">Порядок</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={faq?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="answer">Ответ *</label>
        <textarea
          id="answer"
          name="answer"
          required
          rows={3}
          defaultValue={faq?.answer}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}