import { Reveal } from "@/components/Reveal";

export function IconedArrow() {
  return (
    <span className="inline-flex h-[1.3em] w-[1.3em] items-center justify-center border border-line transition group-hover:border-accent group-hover:text-accent">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M9 3h4v4h-1V4.7L6.85 9.85l-.71-.7L11.29 4H9V3ZM3 5h5v1H4v6h6V7h1v5H3V5Z" />
      </svg>
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  center = false,
  aside,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <Reveal>
      <div
        className={`index-header ${
          center
            ? "flex-col items-start text-left"
            : "items-end"
        }`}
      >
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 font-mono text-[12px] uppercase tracking-tight text-accent">
              /{eyebrow}
            </p>
          )}
          <h2 className="max-w-[22ch] font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="mt-4 max-w-xl text-base text-zinc-400">{subtitle}</p>}
        </div>
        {aside}
      </div>
    </Reveal>
  );
}