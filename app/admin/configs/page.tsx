import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllConfigs, featuresToList } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { createConfig, deleteConfig, toggleConfigActive } from "./actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { ConfigForm } from "@/components/admin/ConfigForm";
import { ConfigImage } from "@/components/ConfigImage";

export const metadata: Metadata = {
  title: "Конфигурации",
};

export default async function AdminConfigsPage() {
  await requireAdmin();
  const configs = await getAllConfigs();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Конфигурации</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Управление каталогом ПК, которые видят клиенты.
        </p>

        <div className="mt-5 space-y-3">
          {configs.length === 0 && (
            <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
              Конфигураций пока нет.
            </p>
          )}

          {configs.map((config) => (
            <div
              key={config.id}
              className={`rounded-2xl border bg-white/[0.03] p-4 ${config.isActive ? "border-white/10" : "border-white/5 opacity-55"}`}
            >
              <div className="flex items-start gap-3">
                <ConfigImage config={config} className="h-14 w-20 shrink-0 overflow-hidden rounded-lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{config.name}</span>
                    <span className="text-xs text-zinc-500">/{config.slug}</span>
                    {!config.isActive && (
                      <span className="rounded-full bg-zinc-500/20 px-2 py-0.5 text-xs text-zinc-400">
                        скрыт
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-400">
                    {config.gpu} · {config.cpu}
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {formatPrice(config.pricePerDay)}/сутки
                    {config.pricePerMonth && <span> · {formatPrice(config.pricePerMonth)}/мес</span>}
                  </p>
                  {featuresToList(config.features).length > 0 && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Особенностей: {featuresToList(config.features).length}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                <Link
                  href={`/admin/configs/${config.id}/edit`}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  Редактировать
                </Link>
                <ConfirmForm
                  action={toggleConfigActive.bind(null, config.id)}
                  confirmText={
                    config.isActive
                      ? "Скрыть эту конфигурацию с сайта?"
                      : "Показать эту конфигурацию на сайте?"
                  }
                >
                  <input type="hidden" name="isActive" value={String(!config.isActive)} />
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-white/5"
                  >
                    {config.isActive ? "Скрыть" : "Показать"}
                  </button>
                </ConfirmForm>
                <ConfirmForm
                  action={deleteConfig.bind(null, config.id)}
                  confirmText={`Удалить «${config.name}» безвозвратно?`}
                  className="ml-auto"
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-400/50 hover:text-red-300"
                  >
                    Удалить
                  </button>
                </ConfirmForm>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/admin/configs/new"
          className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Создать конфигурацию
        </Link>
      </div>

      <div className="lg:sticky lg:top-24 self-start">
        <h2 className="text-xl font-bold text-white font-display">Новая конфигурация</h2>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <ConfigForm action={createConfig} submitLabel="Создать" />
        </div>
      </div>
    </div>
  );
}