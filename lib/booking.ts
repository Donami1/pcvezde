import { db } from "@/db/db";
import { bookings, type NewBooking } from "@/db/schema";
import { sendTelegram } from "@/lib/telegram";
import { formatDateShort } from "@/lib/format";
import { encrypt } from "@/lib/crypto";

export type BookingInput = {
  userId?: string;
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  period?: string;
  config?: string;
  comment?: string;
};

export function validateBooking(input: BookingInput) {
  const errors: string[] = [];

  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const digits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    errors.push("Укажите ваше имя (минимум 2 символа).");
  }
  if (digits.length < 10) {
    errors.push("Укажите корректный номер телефона.");
  }

  return {
    errors,
    data: {
      name,
      phone,
      city: String(input.city ?? "").trim().slice(0, 200) || null,
      address: String(input.address ?? "").trim().slice(0, 500) || null,
      period: String(input.period ?? "").trim().slice(0, 100) || null,
      config: String(input.config ?? "").trim().slice(0, 200) || null,
      comment: String(input.comment ?? "").trim().slice(0, 1000) || null,
    },
  };
}

export async function createBooking(input: BookingInput) {
  const validated = validateBooking(input);
  if (validated.errors.length > 0) {
    throw new Error(validated.errors.join(" "));
  }

  const data = validated.data as NewBooking;
  if (input.userId) data.userId = input.userId;

  const dbValues: NewBooking = {
    ...data,
    name: encrypt(data.name) ?? "",
    phone: encrypt(data.phone) ?? "",
    city: data.city ? encrypt(data.city) : null,
    address: data.address ? encrypt(data.address) : null,
    comment: data.comment ? encrypt(data.comment) : null,
  };
  const [created] = await db.insert(bookings).values(dbValues).returning();

  const message = [
    "<b>🔔 Новая заявка на аренду ПК</b>",
    `👤 Имя: <b>${escapeHtml(data.name)}</b>`,
    `📞 Телефон: <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`,
  ];
  if (data.config) message.push(`🖥️ ПК: ${escapeHtml(data.config)}`);
  if (data.period) message.push(`⏳ Срок: ${escapeHtml(data.period)}`);
  if (data.city) message.push(`📍 Город: ${escapeHtml(data.city)}`);
  if (data.address) message.push(`🏠 Адрес: ${escapeHtml(data.address)}`);
  if (data.comment) message.push(`💬 Комментарий: ${escapeHtml(data.comment)}`);
  message.push(`🕐 Дата: ${formatDateShort(new Date())}`);

  await sendTelegram(message.join("\n"));
  return created;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}