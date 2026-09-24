import { sql } from "drizzle-orm";
import { db } from "@/db/db";
import { settings } from "@/db/schema";

export type SiteContacts = {
  phone: string;
  phoneHref: string;
  telegram: string;
  whatsapp: string;
  city: string;
};

export type SiteHeroStat = {
  value: string;
  label: string;
};

export type SiteHeroText = {
  caption: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  seoDescription: string;
  themeAccent: string;
  contacts: SiteContacts;
  heroText: SiteHeroText;
  heroStats: SiteHeroStat[];
};

export async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function setSettings(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: sql`excluded.value` },
      });
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const map = await getSettingsMap();

  const DEFAULT_STATS: SiteHeroStat[] = [
    { value: "0 ₽", label: "без залога и паспорта" },
    { value: "2 часа", label: "доставка по городу" },
    { value: "24/7", label: "поддержка в Telegram" },
    { value: "500+", label: "ПК в аренде" },
  ];

  return {
    name: map["site.name"] || "ПК Везде",
    tagline: map["site.tagline"] || "Аренда игровых ПК на дом",
    seoDescription:
      map["seo.description"] ||
      "Аренда игровых ПК на дом: доставка за 2 часа, полная настройка, любые конфигурации. Без залога.",
    themeAccent: map["theme.accent"] || "red",
    contacts: {
      phone: map["contact.phone"] || "+7 (999) 123-45-67",
      phoneHref: map["contact.phoneHref"] || "+79991234567",
      telegram: map["contact.telegram"] || "https://t.me/pcvezde",
      whatsapp: map["contact.whatsapp"] || "https://wa.me/79991234567",
      city: map["contact.city"] || "Москва и область",
    },
    heroText: {
      caption:
        map["hero.caption"] ||
        "аренда игровых ПК · привезли — играй, забрали — не оглядывайся",
      title: map["hero.title"] || "Мощные игровые ПК *в аренду* на дом",
      description:
        map["hero.description"] ||
        "Привозим за 2 часа, подключаем и настраиваем. Любые игры на максималках — от бюджета до флагмана. Через месяц ПК можно выкупить со скидкой.",
      ctaPrimary: map["hero.ctaPrimary"] || "Выбрать из каталога",
      ctaSecondary: map["hero.ctaSecondary"] || "Оставить заявку",
    },
    heroStats: DEFAULT_STATS.map((stat, i) => ({
      value: map[`hero.stat${i + 1}.value`]?.trim() || stat.value,
      label: map[`hero.stat${i + 1}.label`]?.trim() || stat.label,
    })),
  };
}