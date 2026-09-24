import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getBookings } from "@/lib/data";
import { getUnitForBooking } from "@/lib/stock";
import { bookingStatusLabel } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { BookingActions } from "@/components/admin/BookingActions";

export const metadata: Metadata = {
  title: "Заявки",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-accent/15 text-accent border-accent/30",
  CONFIRMED: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CANCELLED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const bookingsList = await getBookings();

  const unitByBooking = new Map<number, string>();
  for (const booking of bookingsList) {
    if (booking.status !== "CONFIRMED") continue;
    const unit = await getUnitForBooking(booking.id);
    if (unit) unitByBooking.set(booking.id, unit.label);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Заявки</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Всего: {bookingsList.length} · новых:{" "}
            {bookingsList.filter((b) => b.status === "NEW").length}
          </p>
        </div>
      </div>

      {bookingsList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-lg font-medium text-zinc-300">Заявок пока нет</p>
          <p className="mt-1 text-sm text-zinc-500">
            Когда клиент оставит заявку на сайте, она появится здесь и придёт в Telegram.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookingsList.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      #{booking.id} · {booking.name}
                    </span>
                    <span className="text-sm text-zinc-500">{booking.phone}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[booking.status] ?? "bg-white/10 text-zinc-300 border-white/10"}`}
                    >
                      {bookingStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="mt-2 grid gap-x-6 gap-y-1 text-sm text-zinc-400 sm:grid-cols-2">
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

                  <p className="mt-2 text-xs text-zinc-600">
                    Создана: {formatDate(booking.createdAt)}
                    {booking.status === "CONFIRMED" && (
                      <>
                        {" · "}
                        <span className={unitByBooking.has(booking.id) ? "text-accent" : "text-zinc-500"}>
                          ПК: {unitByBooking.get(booking.id) ?? "не назначен"}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <BookingActions
                  bookingId={booking.id}
                  currentStatus={booking.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}