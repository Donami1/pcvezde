import { and, asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { bookings, configs, faqItems, reviews, type Booking } from "@/db/schema";
import { decrypt } from "@/lib/crypto";

export async function getActiveConfigs() {
  return db
    .select()
    .from(configs)
    .where(eq(configs.isActive, true))
    .orderBy(asc(configs.sortOrder), asc(configs.id));
}

export async function getAllConfigs() {
  return db
    .select()
    .from(configs)
    .orderBy(asc(configs.sortOrder), asc(configs.id));
}

export async function getConfigBySlug(slug: string) {
  const rows = await db
    .select()
    .from(configs)
    .where(and(eq(configs.slug, slug), eq(configs.isActive, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getConfigsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return db.select().from(configs).where(and(...ids.map((id) => eq(configs.id, id))));
}

function decryptBooking(booking: Booking): Booking {
  return {
    ...booking,
    name: decrypt(booking.name) ?? "",
    phone: decrypt(booking.phone) ?? "",
    city: decrypt(booking.city),
    address: decrypt(booking.address),
    comment: decrypt(booking.comment),
  };
}

export async function getBookings() {
  const rows = await db.select().from(bookings).orderBy(asc(bookings.id));
  return rows.map(decryptBooking);
}

export async function getBookingsByUser(userId: string) {
  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt), desc(bookings.id));
  return rows.map(decryptBooking);
}

export async function getActiveReviews() {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.isActive, true))
    .orderBy(asc(reviews.sortOrder), asc(reviews.id));
}

export async function getFaqItems() {
  return db.select().from(faqItems).orderBy(asc(faqItems.sortOrder), asc(faqItems.id));
}

export async function getNewBookingsCount() {
  const rows = await db
    .select({ value: count() })
    .from(bookings)
    .where(eq(bookings.status, "NEW"));
  return rows[0]?.value ?? 0;
}

export function featuresToList(features: string | null): string[] {
  if (!features) return [];
  return features
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}