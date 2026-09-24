const priceFormatter = new Intl.NumberFormat("ru-RU");

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "";
  return `${priceFormatter.format(value)}\u00A0₽`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ensureHttp(link: string) {
  if (!link) return link;
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}