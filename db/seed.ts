import { asc } from "drizzle-orm";
import { configs, faqItems, reviews, settings, units } from "./schema.js";
import { db } from "./db.js";

const DEFAULT_SETTINGS: Record<string, string> = {
  "site.name": "ПК Везде",
  "site.tagline": "Аренда игровых ПК на дом",
  "seo.description":
    "Аренда игровых ПК на дом: доставка за 2 часа, полная настройка, любые конфигурации — от бюджетных до флагманских. Без залога, выкуп со скидкой.",
  "contact.phone": "+7 (999) 123-45-67",
  "contact.phoneHref": "+79991234567",
  "contact.telegram": "https://t.me/pcvezde",
  "contact.whatsapp": "https://wa.me/79991234567",
  "contact.city": "Москва и область",
  "hero.caption": "аренда игровых ПК · привезли — играй, забрали — не оглядывайся",
  "hero.title": "Мощные игровые ПК *в аренду* на дом",
  "hero.description":
    "Привозим за 2 часа, подключаем и настраиваем. Любые игры на максималках — от бюджета до флагмана. Через месяц ПК можно выкупить со скидкой.",
  "hero.ctaPrimary": "Выбрать из каталога",
  "hero.ctaSecondary": "Оставить заявку",
  "hero.stat1.value": "0 ₽",
  "hero.stat1.label": "без залога и паспорта",
  "hero.stat2.value": "2 часа",
  "hero.stat2.label": "доставка по городу",
  "hero.stat3.value": "24/7",
  "hero.stat3.label": "поддержка в Telegram",
  "hero.stat4.value": "500+",
  "hero.stat4.label": "ПК в аренде",
  "theme.accent": "red",
};

const SEED_REVIEWS = [
  {
    name: "Дмитрий",
    city: "Москва",
    rating: 5,
    text: "Привезли за два часа, всё подключили, настроили. Играет сын — CS и физика теперь на максималках, ни одного лага. Отличный сервис.",
  },
  {
    name: "Анна",
    city: "Химки",
    rating: 5,
    text: "Сняли ПК на день рождения мужу. Ребята приехали заранее, поставили, всё показали. Монитор и клавиатуру привезли бесплатно.",
  },
  {
    name: "Игорь",
    city: "Балашиха",
    rating: 5,
    text: "Сомневался, что залог не понадобится, а его и правда нет. Через месяц выкупил ПК — скидку сделали честно, как и обещали.",
  },
  {
    name: "Максим",
    city: "Подольск",
    rating: 5,
    text: "Нужен был мощный ПК для стримов с Киберпанком. Ultra-конфиг тянет всё на ультрах. Поддержка в Telegram отвечает за минуты.",
  },
  {
    name: "Ольга",
    city: "Мытищи",
    rating: 5,
    text: "Брала ноут для работы, муж — игровой ПК. Привезли оба за один выезд. Всё чистое, аккуратное, пахнет новым. Очень довольна.",
  },
  {
    name: "Сергей",
    city: "Химки",
    rating: 5,
    text: "Поменял конфигурацию на более мощную — приехали, заменили за 20 минут, доплатил только разницу. Сервис реально выше ожиданий.",
  },
];

const SEED_FAQ = [
  {
    question: "Кто отвечает за поломку ПК во время аренды?",
    answer:
      "Все устройства застрахованы. Если техника вышла из строя не по вашей вине — бесплатно заменим в течение 24 часов и компенсируем время простоя.",
  },
  {
    question: "Нужен ли залог и паспорт?",
    answer:
      "Депозит не требуется. При заключении договора нужен паспорт и подтверждение адреса доставки. Юридическим лицам — работаем по безналичному расчёту.",
  },
  {
    question: "Как быстро привезёте ПК?",
    answer:
      "По городу — обычно за 2–4 часа с момента подтверждения заявки. В выходные бронируйте заранее: самые востребованные конфигурации разбирают быстро.",
  },
  {
    question: "Можно ли продлить аренду?",
    answer:
      "Да, продление — в один звонок или сообщение. Цена фиксируется на срок продления, обычно выгоднее заранее продлить на месяц.",
  },
  {
    question: "Что входит в аренду?",
    answer:
      "Системный блок с предустановленными играми и готовый к работе. По запросу — монитор, клавиатура, мышь, наушники и Wi-Fi-адаптер.",
  },
  {
    question: "Можно ли выкупить ПК?",
    answer:
      "Да. Вся сумма аренды вычитается из стоимости ПК при выкупе в течение 3 месяцев после начала аренды.",
  },
];

async function seedConfigs() {
  const existing = await db.select().from(configs).orderBy(asc(configs.id));
  if (existing.length > 0) {
    console.log(`Конфигурации уже есть (${existing.length}). Пропускаю.`);
    return;
  }
  await db.insert(configs).values(seed);
  console.log(`Добавлено конфигураций: ${seed.length}`);
}

async function seedSettings() {
  const rows = await db.select().from(settings);
  const existing = new Set(rows.map((s) => s.key));
  const missing = Object.entries(DEFAULT_SETTINGS).filter(([key]) => !existing.has(key));
  if (missing.length > 0) {
    await db
      .insert(settings)
      .values(missing.map(([key, value]) => ({ key, value })))
      .onConflictDoNothing();
    console.log(`Заполнены настройки: ${missing.map(([k]) => k).join(", ")}`);
  }
}

async function seedReviews() {
  const existing = await db.select().from(reviews);
  if (existing.length > 0) {
    console.log(`Отзывы уже есть (${existing.length}). Пропускаю.`);
    return;
  }
  await db.insert(reviews).values(
    SEED_REVIEWS.map((r, i) => ({ ...r, sortOrder: i })),
  );
  console.log(`Добавлено отзывов: ${SEED_REVIEWS.length}`);
}

async function seedFaq() {
  const existing = await db.select().from(faqItems);
  if (existing.length > 0) {
    console.log(`FAQ уже есть (${existing.length}). Пропускаю.`);
    return;
  }
  await db.insert(faqItems).values(
    SEED_FAQ.map((f, i) => ({ ...f, sortOrder: i })),
  );
  console.log(`Добавлено вопросов FAQ: ${SEED_FAQ.length}`);
}

function configShortName(name: string) {
  const quoted = name.match(/«([^»]+)»/);
  if (quoted) return quoted[1];
  return name.split("—")[0].trim() || name;
}

const UNITS_PER_CONFIG = 3;

async function seedUnits() {
  const existing = await db.select().from(units);
  if (existing.length > 0) {
    console.log(`ПК уже созданы (${existing.length}). Пропускаю.`);
    return;
  }
  const configRows = await db.select().from(configs).orderBy(asc(configs.id));
  const rows = configRows.flatMap((c) =>
    Array.from({ length: UNITS_PER_CONFIG }, (_, i) => ({
      configId: c.id,
      label: `ПК-${String(i + 1).padStart(2, "0")} · ${configShortName(c.name)}`,
    })),
  );
  if (rows.length > 0) {
    await db.insert(units).values(rows);
    console.log(`Создано ПК: ${rows.length} (по ${UNITS_PER_CONFIG} на конфигурацию).`);
  }
}

async function main() {
  await seedConfigs();
  await seedUnits();
  await seedSettings();
  await seedReviews();
  await seedFaq();
  console.log("Сид завершён.");
}

const seed = [
  {
    slug: "start",
    name: "«Старт» — бюджетный",
    gpu: "GeForce GTX 1660 Super 6 ГБ",
    cpu: "AMD Ryzen 5 5500",
    ram: "16 ГБ DDR4",
    storage: "SSD 512 ГБ",
    pricePerDay: 300,
    pricePerMonth: 6000,
    shortDesc:
      "Для киберспортивных дисциплин и игр на средних настройках. Идеален для CS 2, Dota 2, Valorant.",
    features: [
      "FPS 100+ в CS 2 / Dota 2",
      "Доставка и установка бесплатно",
      "Полная настройка под вас",
    ].join("\n"),
    sortOrder: 0,
  },
  {
    slug: "optima",
    name: "«Оптима» — популярный",
    gpu: "GeForce RTX 3060 12 ГБ",
    cpu: "AMD Ryzen 5 5600X",
    ram: "16 ГБ DDR4 3200",
    storage: "SSD 1 ТБ",
    pricePerDay: 450,
    pricePerMonth: 9000,
    shortDesc:
      "Баланс цены и производительности. Комфортные 60+ FPS в современных ААА-играх на высоких настройках.",
    features: [
      "60+ FPS в Cyberpunk 2077 на высоких",
      "Трассировка лучей (DLSS)",
      "Wi-Fi и проводное подключение",
    ].join("\n"),
    sortOrder: 1,
  },
  {
    slug: "pro",
    name: "«Про» — мощный",
    gpu: "GeForce RTX 4060 Ti 8 ГБ",
    cpu: "AMD Ryzen 7 5700X",
    ram: "32 ГБ DDR4",
    storage: "SSD 1 ТБ NVMe",
    pricePerDay: 650,
    pricePerMonth: 13000,
    shortDesc:
      "Для стриминга и тяжёлых ААА-проектов. Плавный геймплей в 1440p на ультра-настройках.",
    features: [
      "1440p / ультра в любых играх",
      "Стриминг и запись без потери FPS",
      "RGB-подсветка корпуса",
    ].join("\n"),
    sortOrder: 2,
  },
  {
    slug: "ultra",
    name: "«Ультра» — топ",
    gpu: "GeForce RTX 4070 Super 12 ГБ",
    cpu: "Intel Core i7-14700F",
    ram: "32 ГБ DDR5 6000",
    storage: "SSD 2 ТБ NVMe",
    pricePerDay: 900,
    pricePerMonth: 18000,
    shortDesc:
      "Максимальный запас производительности: 4K-гейминг, трассировка лучей и любые задачи без компромиссов.",
    features: [
      "4K / DLSS в ААА-проектах",
      "Полная трассировка лучей",
      "ПК под ключ: наушники, мышь, клавиатура",
    ].join("\n"),
    sortOrder: 3,
  },
  {
    slug: "ultra-pro",
    name: "«Ультра Про» — флагман",
    gpu: "GeForce RTX 4090 24 ГБ",
    cpu: "Intel Core i9-14900K",
    ram: "64 ГБ DDR5 7000",
    storage: "SSD 2 ТБ NVMe Gen4",
    pricePerDay: 1300,
    pricePerMonth: 26000,
    shortDesc:
      "Флагманская сборка для жесткого геймера и профессионала. Максимальный FPS в любой игре.",
    features: [
      "Максимальный FPS в 4K",
      "Идеален для рендера и ML-задач",
      "Приоритетная доставка за 2 часа",
    ].join("\n"),
    sortOrder: 4,
  },
];

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));