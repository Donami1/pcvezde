import type { Metadata } from "next";
import { CabinetAuthForm } from "@/components/cabinet/CabinetAuthForm";
import { loginActionUser } from "../actions";

export const metadata: Metadata = {
  title: "Вход",
};

export default function CabinetLoginPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <CabinetAuthForm mode="login" action={loginActionUser} />
    </section>
  );
}