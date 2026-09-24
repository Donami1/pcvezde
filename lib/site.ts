export const SITE = {
  name: "ПК Везде",
  tagline: "Аренда игровых ПК на дом",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const CONTACTS = {
  phone: process.env.NEXT_PUBLIC_PHONE || "+7 (999) 123-45-67",
  phoneHref: process.env.NEXT_PUBLIC_PHONE_HREF || "+79991234567",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || "https://t.me/pcvezde",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "https://wa.me/79991234567",
  city: process.env.NEXT_PUBLIC_CITY || "Москва и область",
};

export const NAV_LINKS = [
  { href: "/#about", label: "Почему мы" },
  { href: "/#how", label: "Как это работает" },
  { href: "/#pricing", label: "Тарифы" },
  { href: "/catalog", label: "Каталог ПК" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#contacts", label: "Контакты" },
];