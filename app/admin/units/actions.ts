"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { configs, units } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

function configShortName(name: string) {
  const quoted = name.match(/«([^»]+)»/);
  if (quoted) return quoted[1];
  return name.split("—")[0].trim() || name;
}

function revalidateStock() {
  revalidatePath("/admin/units");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function addUnitAction(configId: number) {
  await requireAdmin();

  const [config] = await db
    .select()
    .from(configs)
    .where(eq(configs.id, configId))
    .limit(1);
  if (!config) throw new Error("Конфигурация не найдена.");

  const count = (await db.select().from(units).where(eq(units.configId, configId)))
    .length;
  const nextNum = count + 1;

  await db.insert(units).values({
    configId,
    label: `ПК-${String(nextNum).padStart(2, "0")} · ${configShortName(config.name)}`,
  });

  revalidateStock();
}

export async function removeUnitAction(unitId: number) {
  await requireAdmin();

  const [unit] = await db.select().from(units).where(eq(units.id, unitId)).limit(1);
  if (!unit) return;
  if (unit.status === "BUSY")
    throw new Error("Нельзя удалить занятый ПК — сначала освободите его.");

  await db.delete(units).where(eq(units.id, unitId));
  revalidateStock();
}

export async function releaseUnitAction(unitId: number) {
  await requireAdmin();

  await db
    .update(units)
    .set({ status: "FREE", bookingId: null, rentedAt: null })
    .where(eq(units.id, unitId));

  revalidateStock();
}