"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { faqItems, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

function toInt(value: FormDataEntryValue | null, fallback = 0) {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function createReviewAction(formData: FormData) {
  await requireAdmin();
  await db.insert(reviews).values({
    name: String(formData.get("name") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    rating: toInt(formData.get("rating"), 5),
    text: String(formData.get("text") ?? "").trim(),
    isActive: formData.get("isActive") === "true",
    sortOrder: toInt(formData.get("sortOrder")),
  });
  revalidatePath("/", "layout");
  redirect("/admin/content");
}

export async function updateReviewAction(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(reviews)
    .set({
      name: String(formData.get("name") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      rating: toInt(formData.get("rating"), 5),
      text: String(formData.get("text") ?? "").trim(),
      isActive: formData.get("isActive") === "true",
      sortOrder: toInt(formData.get("sortOrder")),
    })
    .where(eq(reviews.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/content");
}

export async function deleteReviewAction(id: number) {
  await requireAdmin();
  await db.delete(reviews).where(eq(reviews.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/content");
}

export async function toggleReviewAction(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(reviews)
    .set({ isActive: formData.get("isActive") === "true" })
    .where(eq(reviews.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/content");
}

export async function createFaqAction(formData: FormData) {
  await requireAdmin();
  await db.insert(faqItems).values({
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sortOrder: toInt(formData.get("sortOrder")),
  });
  revalidatePath("/", "layout");
  redirect("/admin/content");
}

export async function updateFaqAction(id: number, formData: FormData) {
  await requireAdmin();
  await db
    .update(faqItems)
    .set({
      question: String(formData.get("question") ?? "").trim(),
      answer: String(formData.get("answer") ?? "").trim(),
      sortOrder: toInt(formData.get("sortOrder")),
    })
    .where(eq(faqItems.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/content");
}

export async function deleteFaqAction(id: number) {
  await requireAdmin();
  await db.delete(faqItems).where(eq(faqItems.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/content");
}