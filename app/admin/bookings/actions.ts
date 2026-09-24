"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { BOOKING_STATUSES, bookings, type BookingStatus } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { applyBookingStatusTransition, releaseUnitForBooking } from "@/lib/stock";

export async function setBookingStatus(bookingId: number, formData: FormData) {
  await requireAdmin();

  const status = String(formData.get("status") ?? "");
  if (!BOOKING_STATUSES.includes(status as BookingStatus)) {
    throw new Error("Недопустимый статус.");
  }

  const [current] = await db
    .select({ status: bookings.status })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  await db
    .update(bookings)
    .set({ status: status as BookingStatus })
    .where(eq(bookings.id, bookingId));

  if (current) {
    await applyBookingStatusTransition(current.status, status, bookingId);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/units");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function deleteBooking(bookingId: number) {
  await requireAdmin();
  await releaseUnitForBooking(bookingId);
  await db.delete(bookings).where(eq(bookings.id, bookingId));
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/units");
  revalidatePath("/catalog");
  revalidatePath("/");
}