import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";

const benefits = [
  {
    num: "[01]",
    title: "доставка за 2 часа",
    text: "Привезём в удобное время, поставим на стол и подключим. Выезд от 1 000 ₽ — бесплатно при аренде от недели.",
  },
  {
    num: "[02]",
    title: "полная настройка",
    text: "Установим игры, драйверы, настроим FPS и синхронизацию. Приедем с монитором и периферией по запросу.",
  },
  {
    num: "[03]",
    title: "без залога",
    text: "Никаких депозитов и скрытых платежей. Понадобится только паспорт и подтверждение адреса.",
  },
  {
    num: "[04]",
    title: "меняйте конфигурацию",
    text: "Захотелось мощнее — поменяем ПК за один выезд. Доплачиваете только разницу в стоимости.",
  },
  {
    num: "[05]",
    title: "чистота и гигиена",
    text: "Каждое устройство проходит глубокую чистку и проверку стабильности перед каждой сдачей.",
  },
  {
    num: "[06]",
    title: "выкуп со скидкой",
    text: "Понравился ПК? Выкупите его — переплаченные арендные платежи вычтем из цены.",
  },
];

export function Benefits() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHead
        eyebrow="преимущества"
        title="почему нас выбирают"
        subtitle="Мы делаем аренду ПК простой и прозрачной — без скрытых условий и сложных договоров."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((item, i) => (
          <Reveal key={item.num} delay={i * 60}>
            <div className="group fancy-corner flex h-full flex-col p-7 transition hover:-translate-y-1 hover:[--line:var(--accent-1)]">
              <span className="font-mono text-[12px] uppercase tracking-tight text-accent">
                {item.num}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{item.text}</p>
              <span className="mt-auto pt-6 text-caption text-zinc-600 transition group-hover:text-accent">
                пк везде →
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}