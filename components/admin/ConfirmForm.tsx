"use client";

import { useTransition, type FormEvent, type ReactNode } from "react";

export function ConfirmForm({
  action,
  confirmText,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmText: string;
  children: ReactNode;
  className?: string;
}) {
  const [, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window.confirm(confirmText)) return;

    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}