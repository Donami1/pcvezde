"use client";

import { useTransition } from "react";
import { deleteBooking, setBookingStatus } from "@/app/admin/bookings/actions";
import { BOOKING_STATUSES, bookingStatusLabel } from "@/db/schema";

export function BookingActions({
  bookingId,
  currentStatus,
}: {
  bookingId: number;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleStatusChange(status: string) {
    const formData = new FormData();
    formData.set("status", status);
    startTransition(() => setBookingStatus(bookingId, formData));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={currentStatus}
        disabled={pending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-accent/60"
      >
        {BOOKING_STATUSES.map((status) => (
          <option key={status} value={status} className="bg-[#12121b]">
            {bookingStatusLabel(status)}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm("Удалить заявку безвозвратно?")) {
            startTransition(() => deleteBooking(bookingId));
          }
        }}
        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-400 transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"
      >
        Удалить
      </button>
    </div>
  );
}