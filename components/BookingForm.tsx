"use client";

import { useState, type FormEvent } from "react";
import { CITIES } from "@/lib/cities";
import { MapAddressInput } from "./MapAddressInput";

const PERIODS = ["", "1–3 дня", "Неделя", "2 недели", "Месяц", "Более месяца"];

export function BookingForm({
  configName,
  compact,
  allBusy,
}: {
  configName?: string;
  compact?: boolean;
  allBusy?: boolean;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      address: address.trim(),
      period: String(formData.get("period") ?? ""),
      config: configName ? configName : String(formData.get("config") ?? ""),
      comment: String(formData.get("comment") ?? ""),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body?.error || "Не удалось отправить заявку. Попробуйте ещё раз.");
        setStatus("error");
        return;
      }

      form.reset();
      setAddress("");
      setStatus("success");
    } catch {
      setError("Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="fancy-corner--top-left bg-panel p-8 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-emerald-500/50 bg-emerald-500/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-mono text-[14px] font-medium uppercase tracking-tight text-white">
          заявка отправлена
        </h3>
        <p className="mx-auto mt-2 max-w-sm font-mono text-[12px] leading-relaxed text-zinc-400">
          Мы свяжемся с вами в ближайшее время, чтобы подтвердить детали и доставку.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 border border-line px-5 py-2.5 font-mono text-[12px] uppercase tracking-tight text-zinc-300 transition hover:border-accent hover:text-white"
        >
          отправить ещё одну
        </button>
      </div>
    );
  }

  const inputClass = `w-full border border-line bg-panel px-4 py-3 font-mono text-[13px] tracking-tight text-white placeholder:text-zinc-600 outline-none transition focus:border-accent`;
  const labelClass = "text-caption mb-2 block text-zinc-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {allBusy && (
        <div className="border border-accent/60 bg-accent/10 px-4 py-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-tight text-accent">
            все ПК этого типа сейчас заняты
          </p>
          <p className="mt-1 font-mono text-[12px] leading-relaxed text-zinc-300">
            Приносим извинения за ожидание. Оставьте заявку — мы свяжемся с вами,
            как только освободится ПК.
          </p>
        </div>
      )}
      {configName && (
        <div className="border border-accent/50 bg-accent/10 px-4 py-3 font-mono text-[12px] uppercase tracking-tight text-accent-soft">
          выбранная конфигурация: <span className="font-medium text-white">{configName}</span>
        </div>
      )}
      {!configName && (
        <div>
          <label className={labelClass} htmlFor="config">
            какой ПК вас интересует (необязательно)
          </label>
          <input
            id="config"
            name="config"
            placeholder="Например: «Оптима», или опишите требования"
            className={inputClass}
          />
        </div>
      )}

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label className={labelClass} htmlFor="name">
            Ваше имя *
          </label>
          <input id="name" name="name" required minLength={2} placeholder="Иван" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Телефон *
          </label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            pattern="[0-9+()\-\s]*"
            title="Введите номер телефона"
            placeholder="+7 (___) ___-__-__"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="period">
            на какой срок
          </label>
          <select id="period" name="period" className={`${inputClass} [&>option]:bg-panel`}>
            {PERIODS.map((period) => (
              <option key={period} value={period}>
                {period || "Выберите срок"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="city">
            город *
          </label>
          <input id="city" name="city" required list="city-suggestions" placeholder="Москва" className={inputClass} />
          <datalist id="city-suggestions">
            {CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="address">
          куда доставить (необязательно)
        </label>
        <MapAddressInput id="address" value={address} onChange={setAddress} />
      </div>

      <div>
        <label className={labelClass} htmlFor="comment">
          комментарий (необязательно)
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          placeholder="Например: нужен ПК к пятнице, есть вопросы по монитору"
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-[12px] text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-solid-cr w-full px-6 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "отправляем..." : "отправить заявку"}
      </button>

      <p className="text-center font-mono text-[11px] uppercase tracking-tight text-zinc-600">
        нажимая кнопку, вы соглашаетесь с обработкой персональных данных
      </p>
    </form>
  );
}