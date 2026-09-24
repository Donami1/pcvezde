"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { clearUserSession, createUserSession } from "@/lib/auth";
import { encrypt, encryptDeterministic } from "@/lib/crypto";
import { rateLimit, currentRateIp } from "@/lib/rate-limit";

export type AuthState = { error?: string };

function normalizePhone(input: string) {
  return String(input ?? "").replace(/\D/g, "").replace(/^8/, "7");
}

function validate(name: string, phone: string, password: string): string {
  if (name.trim().length < 2) return "Укажите ваше имя (минимум 2 символа).";
  if (phone.length < 10) return "Укажите корректный номер телефона.";
  if (password.length < 6) return "Пароль должен быть не короче 6 символов.";
  return "";
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");

  const error = validate(name, phone, password);
  if (error) return { error };

  const limit = rateLimit(`auth:${await currentRateIp()}`, 8);
  if (!limit.ok) return { error: "Слишком много попыток. Подождите и попробуйте ещё раз." };

  const encryptedPhone = encryptDeterministic(phone) ?? "";
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.phone, encryptedPhone))
    .limit(1);
  if (existing.length > 0) {
    return { error: "Этот номер уже зарегистрирован. Войдите в кабинет." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  await db
    .insert(users)
    .values({ id, name: encrypt(name) ?? "", phone: encryptedPhone, passwordHash });

  await createUserSession(id);
  redirect("/cabinet");
}

export async function loginActionUser(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");

  const limit = rateLimit(`auth:${await currentRateIp()}`, 8);
  if (!limit.ok) return { error: "Слишком много попыток. Подождите и попробуйте ещё раз." };

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.phone, encryptDeterministic(phone) ?? ""))
    .limit(1);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Неверный номер или пароль." };
  }

  await createUserSession(user.id);
  redirect("/cabinet");
}

export async function logoutUserAction() {
  await clearUserSession();
  redirect("/");
}