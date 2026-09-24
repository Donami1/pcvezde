import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/booking";
import { getUserSessionId } from "@/lib/auth";
import { rateLimit, currentRateIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const limit = rateLimit(`bookings:${await currentRateIp()}`, 5);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Слишком много заявок за минуту. Подождите немного." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  try {
    const userId = await getUserSessionId();
    const booking = await createBooking({
      userId: userId ?? undefined,
      name: String(body.name ?? ""),
      phone: String(body.phone ?? ""),
      city: String(body.city ?? ""),
      address: String(body.address ?? ""),
      period: String(body.period ?? ""),
      config: String(body.config ?? ""),
      comment: String(body.comment ?? ""),
    });
    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Ошибка сервера." }, { status: 500 });
  }
}