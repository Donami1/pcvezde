import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { bookingStatusLabel } from "@/db/schema";
import { getBookingsByUser } from "@/lib/data";
import { decrypt } from "@/lib/crypto";
import { formatDate } from "@/lib/format";
import { requireUser } from "@/lib/auth";
import { logoutUserAction } from "./actions";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-accent/15 text-accent border-accent/30",
  CONFIRMED: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export default async function CabinetPage() {
  const userId = await requireUser();
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) notFound();

  const myBookings = await getBookingsByUser(userId);
  const displayName = decrypt(user.name) ?? user.name;
  const displayPhone = decrypt(user.phone) ?? user.phone;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Личный кабинет
          </h1>
          <p className="mt-1 text-zinc-400">
            {displayName} · {displayPhone}
          </p>
        </div>
        <form action={logoutUserAction}>
          <button
            type="submit"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-red-400/50 hover:text-red-300"
          >
            Выйти
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white font-display">Мои заявки</h2>

        {myBookings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-lg font-medium text-zinc-300">Заявок пока нет</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
              Оставьте заявку на сайте — и она появится здесь со статусом
              выполнения.
            </p>
            <Link
              href="/catalog"
              className="mt-5 inline-block rounded-xl bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Выбрать ПК
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {myBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-semibold text-white">#{booking.id}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[booking.status] ?? "bg-white/10 text-zinc-300 border-white/10"}`}
                  >
                    {bookingStatusLabel(booking.status)}
                  </span>
                  <span className="ml-auto text-xs text-zinc-500">
                    Создана: {formatDate(booking.createdAt)}
                  </span>
                </div>

                <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-zinc-400 sm:grid-cols-2">
                  {booking.config && (
                    <p>
                      <span className="text-zinc-500">ПК:</span> {booking.config}
                    </p>
                  )}
                  {booking.period && (
                    <p>
                      <span className="text-zinc-500">Срок:</span> {booking.period}
                    </p>
                  )}
                  {booking.city && (
                    <p>
                      <span className="text-zinc-500">Город:</span> {booking.city}
                    </p>
                  )}
                  {booking.address && (
                    <p className="sm:col-span-2">
                      <span className="text-zinc-500">Адрес:</span> {booking.address}
                    </p>
                  )}
                  {booking.comment && (
                    <p className="sm:col-span-2">
                      <span className="text-zinc-500">Комментарий:</span> {booking.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}