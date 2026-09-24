"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { configs, units, type NewConfig } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

function slugify(text: string) {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return (
    text
      .toLowerCase()
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "config"
  );
}

function parseConfigForm(formData: FormData): NewConfig {
  const pricePerMonth = String(formData.get("pricePerMonth") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim().slice(0, 200),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    gpu: String(formData.get("gpu") ?? "").trim().slice(0, 200),
    cpu: String(formData.get("cpu") ?? "").trim().slice(0, 200),
    ram: String(formData.get("ram") ?? "").trim().slice(0, 200),
    storage: String(formData.get("storage") ?? "").trim().slice(0, 200),
    pricePerDay: Number(formData.get("pricePerDay") ?? 0),
    pricePerMonth: pricePerMonth ? Number(pricePerMonth) : null,
    image: String(formData.get("image") ?? "").trim() || null,
    shortDesc: String(formData.get("shortDesc") ?? "").trim() || null,
    features: String(formData.get("features") ?? "").trim() || null,
    isActive: formData.get("isActive") !== "false",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

function validateConfig(data: NewConfig): string | null {
  if (!data.name || data.name.length < 2) return "Укажите название (минимум 2 символа).";
  if (!data.gpu || !data.cpu) return "Заполните GPU и процессор.";
  if (!Number.isFinite(data.pricePerDay) || data.pricePerDay <= 0)
    return "Цена за сутки должна быть больше нуля.";
  if (data.pricePerMonth != null && (!Number.isFinite(data.pricePerMonth) || data.pricePerMonth <= 0))
    return "Цена за месяц должна быть больше нуля.";
  return null;
}

export async function createConfig(formData: FormData) {
  await requireAdmin();

  const data = parseConfigForm(formData);
  const error = validateConfig(data);
  if (error) throw new Error(error);

  await db.insert(configs).values(data);

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/configs");
  redirect("/admin/configs");
}

export async function updateConfig(configId: number, formData: FormData) {
  await requireAdmin();

  const data = parseConfigForm(formData);
  const error = validateConfig(data);
  if (error) throw new Error(error);

  await db.update(configs).set(data).where(eq(configs.id, configId));

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/configs");
  redirect("/admin/configs");
}

export async function deleteConfig(configId: number) {
  await requireAdmin();
  await db.delete(units).where(eq(units.configId, configId));
  await db.delete(configs).where(eq(configs.id, configId));

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/configs");
  redirect("/admin/configs");
}

export async function toggleConfigActive(configId: number, formData: FormData) {
  await requireAdmin();

  const isActive = String(formData.get("isActive") ?? "") === "true";
  await db.update(configs).set({ isActive }).where(eq(configs.id, configId));

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/configs");
}