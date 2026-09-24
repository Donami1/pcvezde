import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8 МБ

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа." }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Допустимы только JPG, PNG, WebP и GIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл больше 8 МБ." }, { status: 400 });
  }

  try {
    const dir = join(process.cwd(), "public", "uploads", "configs");
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, name), bytes);
    return NextResponse.json({ url: `/uploads/configs/${name}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить файл." }, { status: 500 });
  }
}