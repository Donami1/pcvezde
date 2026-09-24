import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { Logo } from "@/components/Header";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Вход в админку",
};

export default async function AdminLoginPage() {
  if (await isAdmin()) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="fancy-corner bg-panel p-6">
          <h1 className="mb-6 text-center text-xl font-bold text-white">
            Вход в админ-панель
          </h1>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-zinc-500">
          Доступ только для администратора сайта.
        </p>
      </div>
    </div>
  );
}