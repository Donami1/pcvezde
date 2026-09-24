import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/db";
import { bookings, configs, units, type Config, type Unit } from "@/db/schema";
import { decrypt } from "@/lib/crypto";

export type UnitWithBooking = Unit & {
  booking: { id: number; name: string; period: string | null } | null;
};

export type ConfigStock = {
  config: Config;
  total: number;
  free: number;
  busy: number;
  units: UnitWithBooking[];
};

export async function getStockSummary(): Promise<ConfigStock[]> {
  const [configRows, unitRows] = await Promise.all([
    db.select().from(configs).orderBy(asc(configs.sortOrder), asc(configs.id)),
    db.select().from(units).orderBy(asc(units.configId), asc(units.id)),
  ]);

  const busyIds = unitRows
    .filter((u) => u.status === "BUSY" && u.bookingId != null)
    .map((u) => u.bookingId as number);

  const bookingRows =
    busyIds.length > 0
      ? await db
          .select({ id: bookings.id, name: bookings.name, period: bookings.period })
          .from(bookings)
          .where(inArray(bookings.id, busyIds))
      : [];

  const bookingById = new Map(
    bookingRows.map((b) => [b.id, { ...b, name: decrypt(b.name) ?? "" }]),
  );

  return configRows.map((config) => {
    const unitList = unitRows.filter((u) => u.configId === config.id);
    const decorated: UnitWithBooking[] = unitList.map((u) => ({
      ...u,
      booking: u.bookingId != null ? (bookingById.get(u.bookingId) ?? null) : null,
    }));
    const busy = decorated.filter((u) => u.status === "BUSY").length;
    return {
      config,
      total: decorated.length,
      free: decorated.length - busy,
      busy,
      units: decorated,
    };
  });
}

export async function getStockByConfigId(configId: number): Promise<ConfigStock | null> {
  const summary = await getStockSummary();
  return summary.find((s) => s.config.id === configId) ?? null;
}

export type Availability = { free: number; total: number };

export async function getAvailabilityMap(): Promise<Map<number, Availability>> {
  const summary = await getStockSummary();
  return new Map(summary.map((s) => [s.config.id, { free: s.free, total: s.total }]));
}

export function isAllBusy(availability: Availability | null | undefined): boolean {
  return !!availability && availability.total > 0 && availability.free === 0;
}

export function matchConfigByName(text: string, list: Config[]): Config | null {
  const raw = (text ?? "").trim();
  if (!raw || list.length === 0) return null;

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[«»"]/g, "").replace(/\s+/g, " ").trim();
  const q = raw.toLowerCase().replace(/[«»"]/g, "").trim();
  const qn = normalize(raw);

  const exact = list.find(
    (c) => normalize(c.name) === qn || c.slug.toLowerCase() === q,
  );
  if (exact) return exact;

  const partial = list.find((c) => {
    const cn = normalize(c.name);
    return cn.includes(qn) || qn.includes(cn);
  });
  if (partial) return partial;

  const qWords = qn.split(/\s+/).filter((w) => w.length > 2);
  const token = list.find((c) => {
    const cn = normalize(c.name);
    return qWords.some((w) => cn.includes(w));
  });
  return token ?? null;
}

async function pickFreeUnit(configId: number, bookingId: number): Promise<Unit | null> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = await db
      .select({ id: units.id })
      .from(units)
      .where(and(eq(units.configId, configId), eq(units.status, "FREE")))
      .orderBy(asc(units.id))
      .limit(1);
    if (candidate.length === 0) return null;

    const updated = await db
      .update(units)
      .set({ status: "BUSY", bookingId, rentedAt: new Date() })
      .where(
        and(eq(units.id, candidate[0].id), eq(units.status, "FREE")),
      )
      .returning();
    if (updated.length > 0) return updated[0];
  }
  return null;
}

export async function assignUnitToBooking(bookingId: number): Promise<Unit | null> {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  if (!booking?.config) return null;

  const configRows = await db.select().from(configs);
  const config = matchConfigByName(booking.config, configRows);
  if (!config) return null;

  return pickFreeUnit(config.id, bookingId);
}

export async function releaseUnitForBooking(bookingId: number) {
  await db
    .update(units)
    .set({ status: "FREE", bookingId: null, rentedAt: null })
    .where(eq(units.bookingId, bookingId));
}

export async function applyBookingStatusTransition(
  prevStatus: string,
  nextStatus: string,
  bookingId: number,
) {
  if (nextStatus === "CONFIRMED" && prevStatus !== "CONFIRMED") {
    await assignUnitToBooking(bookingId);
  } else if (prevStatus === "CONFIRMED" && nextStatus !== "CONFIRMED") {
    await releaseUnitForBooking(bookingId);
  }
}

export async function getUnitForBooking(bookingId: number): Promise<Unit | null> {
  const rows = await db
    .select()
    .from(units)
    .where(eq(units.bookingId, bookingId))
    .limit(1);
  return rows[0] ?? null;
}