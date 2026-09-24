export type ThemeKey =
  | "red"
  | "violet"
  | "cyan"
  | "emerald"
  | "rose"
  | "amber"
  | "sky";

export type Theme = {
  label: string;
  accent1: string;
  accent2: string;
  accent3: string;
};

export const THEMES: Record<ThemeKey, Theme> = {
  red: {
    label: "Красный",
    accent1: "#ea1343",
    accent2: "#ff1f51",
    accent3: "#ea8613",
  },
  violet: {
    label: "Фиолетовый (оригинал)",
    accent1: "#8b5cf6",
    accent2: "#d946ef",
    accent3: "#22d3ee",
  },
  cyan: {
    label: "Бирюзовый неон",
    accent1: "#22d3ee",
    accent2: "#3b82f6",
    accent3: "#a78bfa",
  },
  emerald: {
    label: "Неоновый зелёный",
    accent1: "#10b981",
    accent2: "#22d3ee",
    accent3: "#a3e635",
  },
  rose: {
    label: "Алый",
    accent1: "#f43f5e",
    accent2: "#fb923c",
    accent3: "#e879f9",
  },
  amber: {
    label: "Золотой",
    accent1: "#f59e0b",
    accent2: "#f97316",
    accent3: "#fbbf24",
  },
  sky: {
    label: "Голубой",
    accent1: "#38bdf8",
    accent2: "#6366f1",
    accent3: "#22d3ee",
  },
};

export function resolveTheme(key: string | undefined): Theme {
  return (key && THEMES[key as ThemeKey]) || THEMES.red;
}