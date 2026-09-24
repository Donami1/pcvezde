import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";
import { THEMES } from "@/lib/theme";
import {
  changeAdminPasswordAction,
  saveBrandAction,
  saveContactsAction,
  saveHeroStatsAction,
  saveHeroTextAction,
  saveThemeAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Настройки сайта",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-accent/60 focus:bg-white/10";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-bold text-white font-display">{title}</h2>
      <p className="mt-0.5 mb-5 text-sm text-zinc-500">{description}</p>
      {children}
    </div>
  );
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const pwError =
    sp?.pwError === "current"
      ? "Текущий пароль указан неверно."
      : sp?.pwError === "short"
        ? "Новый пароль слишком короткий — минимум 8 символов."
        : sp?.pwError === "mismatch"
          ? "Новый пароль и подтверждение не совпадают."
          : null;
  const pwOk = sp?.pwOk === "1";
  const site = await getSiteConfig();
  const contacts = site.contacts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-display">
          Настройки сайта
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Изменения применяются на сайте мгновенно — без программиста.
        </p>
      </div>

      <Card
        title="Бренд"
        description="Название, слоган и описание для поисковиков (SEO)."
      >
        <form action={saveBrandAction} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="name">
              Название сайта
            </label>
            <input
              id="name"
              name="name"
              defaultValue={site.name}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="tagline">
              Слоган
            </label>
            <input
              id="tagline"
              name="tagline"
              defaultValue={site.tagline}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="seoDescription">
              SEO-описание
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={site.seoDescription}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Сохранить
          </button>
        </form>
      </Card>

      <Card
        title="Контакты"
        description="Телефон, мессенджеры и город, которые видны на сайте."
      >
        <form action={saveContactsAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="phone">
                Телефон (показывается на сайте)
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={contacts.phone}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="phoneHref">
                Телефон для звонков (без пробелов, +7…)
              </label>
              <input
                id="phoneHref"
                name="phoneHref"
                defaultValue={contacts.phoneHref}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="telegram">
                Ссылка Telegram
              </label>
              <input
                id="telegram"
                name="telegram"
                defaultValue={contacts.telegram}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="whatsapp">
                Ссылка WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                defaultValue={contacts.whatsapp}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="city">
                Город / зона доставки
              </label>
              <input
                id="city"
                name="city"
                defaultValue={contacts.city}
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Сохранить
          </button>
        </form>
      </Card>

      <Card
        title="Текст первого экрана (Hero)"
        description="Надпись над заголовком, заголовок, описание и кнопки. Слово в звёздочках *так* выделяется акцентным цветом."
      >
        <form action={saveHeroTextAction} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="hero-caption">
              Надпись над заголовком
            </label>
            <input
              id="hero-caption"
              name="caption"
              defaultValue={site.heroText.caption}
              placeholder="аренда игровых ПК · привезли — играй, забрали — не оглядывайся"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="hero-title">
              Заголовок
            </label>
            <input
              id="hero-title"
              name="title"
              defaultValue={site.heroText.title}
              placeholder="Мощные игровые ПК *в аренду* на дом"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Часть между звёздочками станет акцентной: *в аренду*
            </p>
          </div>
          <div>
            <label className={labelClass} htmlFor="hero-description">
              Описание под заголовком
            </label>
            <textarea
              id="hero-description"
              name="description"
              defaultValue={site.heroText.description}
              placeholder="Привозим за 2 часа, подключаем и настраиваем…"
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="hero-cta-primary">
                Кнопка 1 (в каталог)
              </label>
              <input
                id="hero-cta-primary"
                name="ctaPrimary"
                defaultValue={site.heroText.ctaPrimary}
                placeholder="Выбрать из каталога"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="hero-cta-secondary">
                Кнопка 2 (заявка)
              </label>
              <input
                id="hero-cta-secondary"
                name="ctaSecondary"
                defaultValue={site.heroText.ctaSecondary}
                placeholder="Оставить заявку"
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Сохранить
          </button>
        </form>
      </Card>

      <Card
        title="Статистика на главной"
        description="Четыре показателя на первом экране: значение и подпись под ним. Пустое поле вернёт стандартный текст."
      >
        <form action={saveHeroStatsAction} className="space-y-5">
          {["stat1", "stat2", "stat3", "stat4"].map((name, i) => {
            const stat = site.heroStats[i];
            return (
              <div key={name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-tight text-zinc-500">
                  Показатель {i + 1}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor={`${name}-value`}>
                      Значение
                    </label>
                    <input
                      id={`${name}-value`}
                      name={`${name}Value`}
                      defaultValue={stat.value}
                      placeholder="Например: 500+"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`${name}-label`}>
                      Подпись
                    </label>
                    <input
                      id={`${name}-label`}
                      name={`${name}Label`}
                      defaultValue={stat.label}
                      placeholder="Например: ПК в аренде"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Сохранить
          </button>
        </form>
      </Card>

      <Card
        title="Тема оформления"
        description="Цветовая схема всего сайта — переключите и посмотрите на лендинг."
      >
        <form action={saveThemeAction}>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(THEMES).map(([key, theme]) => {
              const checked = site.themeAccent === key;
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    checked
                      ? "border-accent/60 bg-accent/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="accent"
                    value={key}
                    defaultChecked={checked}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="flex h-8 w-8 shrink-0 rounded-full border border-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent1}, ${theme.accent2} 60%, ${theme.accent3})`,
                    }}
                  />
                  <span className="text-sm font-medium text-zinc-200">
                    {theme.label}
                  </span>
                </label>
              );
            })}
          </div>
          <button
            type="submit"
            className="mt-5 rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Применить тему
          </button>
        </form>
      </Card>

      <Card
        title="Пароль админки"
        description="Хэшируется (bcrypt) и хранится в data/secrets.json. В Dev по умолчанию admin123, на первом запуске в проде генерируется случайный."
      >
        <form action={changeAdminPasswordAction} className="space-y-4">
          {pwOk ? (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Пароль успешно изменён.
            </p>
          ) : pwError ? (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {pwError}
            </p>
          ) : null}
          <div>
            <label className={labelClass} htmlFor="pw-current">
              Текущий пароль
            </label>
            <input
              id="pw-current"
              name="current"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="pw-next">
              Новый пароль
            </label>
            <input
              id="pw-next"
              name="next"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="pw-confirm">
              Повторите новый пароль
            </label>
            <input
              id="pw-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Сменить пароль
          </button>
        </form>
      </Card>
    </div>
  );
}