import type { Metadata } from "next";
import { CabinetAuthForm } from "@/components/cabinet/CabinetAuthForm";
import { registerAction } from "../actions";

export const metadata: Metadata = {
  title: "Регистрация",
};

export default function CabinetRegisterPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <CabinetAuthForm mode="register" action={registerAction} />
    </section>
  );
}