"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
          Пароль администратора
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="••••••••"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-accent/60 focus:bg-white/10"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-2 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}