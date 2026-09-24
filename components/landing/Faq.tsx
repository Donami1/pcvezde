import { SectionHead } from "@/components/SectionHead";
import { getFaqItems } from "@/lib/data";
import { FaqAccordion } from "./FaqAccordion";

export async function Faq() {
  const items = await getFaqItems();

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead
        center
        eyebrow="FAQ"
        title="Частые вопросы"
        subtitle="Не нашли ответ — напишите нам в Telegram, ответим в течение 15 минут."
      />

      {items.length === 0 ? (
        <p className="fancy-corner p-10 text-center font-mono text-[13px] uppercase tracking-tight text-zinc-500">
          Вопросы скоро появятся.
        </p>
      ) : (
        <FaqAccordion items={items} />
      )}
    </section>
  );
}