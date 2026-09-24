import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db/db";
import { configs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateConfig } from "../../actions";
import { ConfigForm } from "@/components/admin/ConfigForm";

export const metadata: Metadata = {
  title: "Редактирование конфигурации",
};

export default async function AdminConfigEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const configId = Number(id);
  if (!Number.isInteger(configId)) notFound();

  const rows = await db.select().from(configs).where(eq(configs.id, configId)).limit(1);
  const config = rows[0];
  if (!config) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-white font-display">
        Редактирование: {config.name}
      </h1>
      <p className="mt-1 text-sm text-zinc-400">Ссылка: /catalog/{config.slug}</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <ConfigForm
          action={updateConfig.bind(null, config.id)}
          config={config}
          submitLabel="Сохранить"
        />
      </div>
    </div>
  );
}