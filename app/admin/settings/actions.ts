"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, checkAdminPassword } from "@/lib/auth";
import { setAdminPassword } from "@/lib/secrets";
import { setSettings } from "@/lib/settings";
import { THEMES, type ThemeKey } from "@/lib/theme";

export async function changeAdminPasswordAction(formData: FormData) {
  await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!(await checkAdminPassword(current))) {
    return redirect("/admin/settings?pwError=current");
  }
  if (next.length < 8) {
    return redirect("/admin/settings?pwError=short");
  }
  if (next !== confirm) {
    return redirect("/admin/settings?pwError=mismatch");
  }
  setAdminPassword(next);
  redirect("/admin/settings?pwOk=1");
}

export async function saveBrandAction(formData: FormData) {
  await requireAdmin();
  await setSettings({
    "site.name": String(formData.get("name") ?? "").trim(),
    "site.tagline": String(formData.get("tagline") ?? "").trim(),
    "seo.description": String(formData.get("seoDescription") ?? "").trim(),
  });
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}

export async function saveContactsAction(formData: FormData) {
  await requireAdmin();
  await setSettings({
    "contact.phone": String(formData.get("phone") ?? "").trim(),
    "contact.phoneHref": String(formData.get("phoneHref") ?? "")
      .trim()
      .replace(/[^\d+]/g, ""),
    "contact.telegram": String(formData.get("telegram") ?? "").trim(),
    "contact.whatsapp": String(formData.get("whatsapp") ?? "").trim(),
    "contact.city": String(formData.get("city") ?? "").trim(),
  });
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}

export async function saveHeroTextAction(formData: FormData) {
  await requireAdmin();
  const values: Record<string, string> = {
    "hero.caption": String(formData.get("caption") ?? "").trim(),
    "hero.title": String(formData.get("title") ?? "").trim(),
    "hero.description": String(formData.get("description") ?? "").trim(),
    "hero.ctaPrimary": String(formData.get("ctaPrimary") ?? "").trim(),
    "hero.ctaSecondary": String(formData.get("ctaSecondary") ?? "").trim(),
  };
  await setSettings(values);
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}

export async function saveHeroStatsAction(formData: FormData) {
  await requireAdmin();
  const values: Record<string, string> = {};
  for (let i = 1; i <= 4; i += 1) {
    values[`hero.stat${i}.value`] = String(formData.get(`stat${i}Value`) ?? "").trim();
    values[`hero.stat${i}.label`] = String(formData.get(`stat${i}Label`) ?? "").trim();
  }
  await setSettings(values);
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}

export async function saveThemeAction(formData: FormData) {
  await requireAdmin();
  const accent = String(formData.get("accent") ?? "violet");
  const key = accent in THEMES ? (accent as ThemeKey) : "violet";
  await setSettings({ "theme.accent": key });
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}