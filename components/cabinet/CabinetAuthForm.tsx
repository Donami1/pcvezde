"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthState } from "@/app/cabinet/actions";

const inputClass =
  "w-full border border-line bg-panel px-4 py-3 font-mono text-[13px] tracking-tight text-white placeholder:text-zinc-600 outline-none transition focus:border-accent";
const labelClass = "text-caption mb-2 block text-zinc-500";

export function CabinetAuthForm({
  mode,
  action,
}: {
  mode: "login" | "register";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="fancy-corner bg-panel p-6 sm:p-8">
        <p className="mb-4 font-mono text-[12px] uppercase tracking-tight text-accent">
          /{mode === "login" ? "вход" : "регистрация"}
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          {mode === "login" ? "личный кабинет" : "регистрация"}
        </h1>
        <p className="mt-3 font-mono text-[12px] leading-relaxed text-zinc-400">
          {mode === "login"
            ? "введите номер телефона и пароль, чтобы посмотреть статусы заявок"
            : "создайте кабинет, чтобы отслеживать свои заявки на аренду ПК"}
        </p>

        <form action={formAction} className="mt-6 space-y-5">
          {mode === "register" && (
            <div>
              <label className={labelClass} htmlFor="name">
                имя *
              </label>
              <input id="name" name="name" required minLength={2} placeholder="Иван" className={inputClass} />
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="phone">
              телефон *
            </label>
            <input
              id="phone"
              name="phone"
              required
              type="tel"
              inputMode="tel"
              placeholder="+7 (___) ___-__-__"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="password">
              пароль *
            </label>
            <input
              id="password"
              name="password"
              required
              type="password"
              minLength={6}
              placeholder={mode === "register" ? "минимум 6 символов" : "ваш пароль"}
              className={inputClass}
            />
          </div>

          {state.error && (
            <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-[12px] text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-solid-cr w-full px-6 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "подождите..."
              : mode === "login"
                ? "войти"
                : "зарегистрироваться"}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center font-mono text-[12px] text-zinc-400">
        {mode === "login" ? (
          <>
            ещё нет кабинета?{" "}
            <Link href="/cabinet/register" className="text-accent hover:text-white">
              зарегистрируйтесь
            </Link>
          </>
        ) : (
          <>
            уже есть аккаунт?{" "}
            <Link href="/cabinet/login" className="text-accent hover:text-white">
              войдите
            </Link>
          </>
        )}
      </p>
    </div>
  );
}