import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ReviewForm } from "@/components/admin/ContentForms";
import { updateReviewAction } from "../../../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Редактировать отзыв",
};

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [review] = await db.select().from(reviews).where(eq(reviews.id, Number(id))).limit(1);
  if (!review) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-white font-display">
        Редактировать отзыв
      </h1>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <ReviewForm
          action={updateReviewAction.bind(null, review.id)}
          review={review}
          submitLabel="Сохранить"
        />
      </div>
      <Link
        href="/admin/content"
        className="mt-4 inline-block text-sm text-zinc-400 transition hover:text-white"
      >
        ← Назад к отзывам и FAQ
      </Link>
    </div>
  );
}