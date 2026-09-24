import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    number: "01",
    title: "оставляете заявку",
    text: "Через форму на сайте, в Telegram или по телефону. Расскажите, для чего нужен ПК.",
  },
  {
    number: "02",
    title: "согласовываем детали",
    text: "Менеджер перезванивает за 15 минут: подбираем конфигурацию, срок и время доставки.",
  },
  {
    number: "03",
    title: "привозим и настраиваем",
    text: "Мастер приезжает, подключает ПК, устанавливает игры и показывает работу. Оплата — после проверки.",
  },
  {
    number: "04",
    title: "играйте, продлевайте или выкупайте",
    text: "По окончании срока мы забираем технику. Можно продлить, поменять конфигурацию или выкупить ПК.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-line/50 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHead
          center
          eyebrow="схема работы"
          title="как это работает"
          subtitle="Четыре простых шага от заявки до готового игрового места."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 90}>
              <div className="group relative h-full p-6">
                <span className="text-stroke block text-6xl font-extrabold font-display">
                  {step.number}
                </span>
                <h3 className="mt-5 font-display text-base font-bold uppercase tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{step.text}</p>
                {step.number !== "04" && (
                  <span className="absolute -right-4 top-10 hidden text-2xl text-accent lg:block">
                    →
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}