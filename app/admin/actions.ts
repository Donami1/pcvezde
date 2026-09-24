"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, clearSession, createSession } from "@/lib/auth";
import { rateLimit, currentRateIp } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  const limit = rateLimit(`admin-login:${await currentRateIp()}`, 8);
  if (!limit.ok) {
    return { error: "Слишком много попыток. Подождите минуту и попробуйте снова." };
  }

  const ok = await checkAdminPassword(password);

  if (!ok) {
    return { error: "Неверный пароль. Попробуйте снова." };
  }

  await createSession();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}