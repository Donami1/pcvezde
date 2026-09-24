import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getStockSummary } from "@/lib/stock";
import { formatDate } from "@/lib/format";
import { addUnitAction, releaseUnitAction, removeUnitAction } from "./actions";

export const metadata: Metadata = {
  title: "Склад ПК",
};

export default async function AdminUnitsPage() {
  await requireAdmin();
  const stock = await getStockSummary();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Склад ПК</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Физические ПК по конфигурациям. Заявки со статусом «Подтверждена»
            занимают свободные машины автоматически.
          </p>
        </div>
      </div>

      {stock.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-lg font-medium text-zinc-300">Конфигураций пока нет</p>
        </div>
      ) : (
        <div className="space-y-8">
          {stock.map(({ config, total, free, busy, units }) => (
            <section
              key={config.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-white">{config.name}</h2>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    свободно {free} из {total} · занято {busy}
                  </p>
                </div>
                <form action={addUnitAction.bind(null, config.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:border-accent/60 hover:text-white"
                  >
                    + добавить ПК
                  </button>
                </form>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className={`rounded-xl border p-4 ${
                      unit.status === "BUSY"
                        ? "border-amber-500/30 bg-amber-500/[0.06]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm text-white">{unit.label}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                          unit.status === "BUSY"
                            ? "border-amber-500/40 text-amber-300"
                            : "border-emerald-500/40 text-emerald-300"
                        }`}
                      >
                        {unit.status === "BUSY" ? "занят" : "свободен"}
                      </span>
                    </div>

                    {unit.booking && unit.rentedAt ? (
                      <div className="mt-3 space-y-1 text-[13px] text-zinc-400">
                        <p>
                          <span className="text-zinc-500">Заявка:</span> #{unit.booking.id} ·{" "}
                          {unit.booking.name}
                        </p>
                        {unit.booking.period && (
                          <p>
                            <span className="text-zinc-500">Взяли на:</span>{" "}
                            {unit.booking.period}
                          </p>
                        )}
                        <p>
                          <span className="text-zinc-500">Занят с:</span>{" "}
                          {formatDate(unit.rentedAt)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-[13px] text-zinc-600">свободен для выдачи</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {unit.status === "BUSY" && (
                        <form action={releaseUnitAction.bind(null, unit.id)}>
                          <button
                            type="submit"
                            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-emerald-500/50 hover:text-emerald-300"
                          >
                            освободить
                          </button>
                        </form>
                      )}
                      <form action={removeUnitAction.bind(null, unit.id)}>
                        <button
                          type="submit"
                          className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-zinc-500 transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-40"
                          disabled={unit.status === "BUSY"}
                          title={
                            unit.status === "BUSY"
                              ? "Сначала освободите занятый ПК"
                              : "Удалить ПК из склада"
                          }
                        >
                          удалить
                        </button>
                      </form>
                    </div>
                  </div>
                ))}

                {units.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-500">
                    ПК для этой конфигурации ещё не добавлены.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}