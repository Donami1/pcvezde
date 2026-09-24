import type { Config } from "@/db/schema";
import { ConfigImagePicker } from "./ConfigImagePicker";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-accent/60 focus:bg-white/10";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

export function ConfigForm({
  action,
  config,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  config?: Config;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Название *</label>
          <input
            id="name"
            name="name"
            required
            placeholder="«Оптима» — популярный"
            defaultValue={config?.name}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">Slug (ссылка)</label>
          <input
            id="slug"
            name="slug"
            placeholder="optima (если пусто — сам из названия)"
            defaultValue={config?.slug}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Пустая — сформируется автоматически из названия.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="gpu">Видеокарта *</label>
          <input
            id="gpu"
            name="gpu"
            required
            placeholder="GeForce RTX 3060 12 ГБ"
            defaultValue={config?.gpu}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="cpu">Процессор *</label>
          <input
            id="cpu"
            name="cpu"
            required
            placeholder="AMD Ryzen 5 5600X"
            defaultValue={config?.cpu}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ram">Оперативная память</label>
          <input
            id="ram"
            name="ram"
            placeholder="16 ГБ DDR4"
            defaultValue={config?.ram}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="storage">Накопитель</label>
          <input
            id="storage"
            name="storage"
            placeholder="SSD 1 ТБ"
            defaultValue={config?.storage}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="pricePerDay">Цена за сутки, ₽ *</label>
          <input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            min="1"
            required
            defaultValue={config?.pricePerDay ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="pricePerMonth">Цена за месяц, ₽</label>
          <input
            id="pricePerMonth"
            name="pricePerMonth"
            type="number"
            min="1"
            defaultValue={config?.pricePerMonth ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <ConfigImagePicker defaultValue={config?.image ?? ""} />
        <p className="mt-1.5 text-xs text-zinc-500">
          Загрузите своё фото или вставьте ссылку. Если пусто — подставится заглушка.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="shortDesc">Короткое описание</label>
        <textarea
          id="shortDesc"
          name="shortDesc"
          rows={2}
          defaultValue={config?.shortDesc ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="features">Особенности (каждая с новой строки)</label>
        <textarea
          id="features"
          name="features"
          rows={4}
          defaultValue={config?.features ?? ""}
          placeholder={"FPS 100+ в CS 2 / Dota 2\nДоставка и установка бесплатно"}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="sortOrder">Порядок сортировки</label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={config?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-300">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={config ? config.isActive : true}
              className="h-4 w-4 rounded accent-accent"
            />
            Показывать на сайте
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {submitLabel}
        </button>
        <a
          href="/admin/configs"
          className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
        >
          Отмена
        </a>
      </div>
    </form>
  );
}