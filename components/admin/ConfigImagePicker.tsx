"use client";

import { useRef, useState } from "react";

export function ConfigImagePicker({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
      setValue(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить файл");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-300">
        Изображение
      </label>

      <input type="hidden" name="image" value={value} />

      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {value ? (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Превью конфигурации"
              className="h-44 w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-zinc-500">
            Фото ещё не выбрано
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Загрузка..." : value ? "Заменить фото" : "Загрузить фото"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-red-300"
            >
              Убрать
            </button>
          )}
          {!value && (
            <span className="text-xs text-zinc-500">
              JPG, PNG, WebP, GIF · до 8 МБ
            </span>
          )}
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}

        {value.startsWith("http") && (
          <p className="text-xs text-zinc-500">
            Это внешняя ссылка. Можно вставить любой адрес изображения.
          </p>
        )}
      </div>
    </div>
  );
}