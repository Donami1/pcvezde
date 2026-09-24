import { getSiteConfig } from "@/lib/settings";
import { BookingForm } from "@/components/BookingForm";
import { Reveal } from "@/components/Reveal";

export async function Order() {
  const site = await getSiteConfig();
  const contacts = site.contacts;

  const channels: {
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[] = [
    { label: "позвонить", value: contacts.phone, href: `tel:${contacts.phoneHref}` },
    { label: "telegram", value: "@pcvezde", href: contacts.telegram, external: true },
    { label: "whatsapp", value: contacts.phone, href: contacts.whatsapp, external: true },
  ];

  return (
    <section id="order" className="relative scroll-mt-20 overflow-hidden border-t border-line/50 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-cta-grid opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 right-[-5%] h-[420px] w-[560px] rounded-full bg-accent/15 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal>
          <header className="index-header">
            <div className="max-w-2xl">
              <p className="mb-4 font-mono text-[12px] uppercase tracking-tight text-accent">
                /{contacts.city ? `заявка · ${contacts.city}` : "заявка"}
              </p>
              <h2 className="max-w-[18ch] font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Оставить заявку
              </h2>
              <p className="mt-4 max-w-xl text-base text-zinc-400">
                Оставьте контакты — перезвоним за 15 минут, подберём конфигурацию
                и согласуем доставку. Или напишите нам напрямую:
              </p>
            </div>
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="border-t border-line/60">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline justify-between gap-4 border-b border-line/60 py-5 transition hover:border-accent"
                  >
                    <span className="font-mono text-[12px] uppercase tracking-tight text-zinc-500 transition group-hover:text-accent">
                      [{channels.indexOf(channel) + 1}] {channel.label}
                    </span>
                    <span className="link-duplicate">
                      <span
                        className="link-duplicate__text font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl"
                        data-text={channel.value}
                      >
                        {channel.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
              {contacts.city && (
                <p className="mt-6 font-mono text-[12px] uppercase tracking-tight text-zinc-500">
                  город работы: <span className="text-zinc-300">{contacts.city}</span>
                </p>
              )}
            </div>

            <div className="fancy-corner bg-panel p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                быстрая заявка
              </h3>
              <p className="mb-6 mt-1 font-mono text-[12px] uppercase tracking-tight text-zinc-400">
                заполните форму — подберём ПК под ваши задачи
              </p>
              <BookingForm compact />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}