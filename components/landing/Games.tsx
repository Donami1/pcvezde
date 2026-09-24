const gameRowA = [
  "CS 2",
  "Dota 2",
  "Valorant",
  "Fortnite",
  "PUBG",
  "Apex Legends",
  "Minecraft",
  "Cyberpunk 2077",
  "GTA V",
  "Rust",
  "Warzone",
  "The Witcher 3",
];

const gameRowB = [
  "Baldur's Gate 3",
  "Elden Ring",
  "Starfield",
  "Forza Horizon 5",
  "Genshin Impact",
  "Roblox",
  "The Finals",
  "Hunt: Showdown",
  "Horizon",
  "Diablo IV",
  "EA FC 26",
  "DayZ",
];

function row(items: string[]) {
  return items.map((g) => (
    <span
      key={g}
      className="mx-3 inline-flex items-center gap-2 whitespace-nowrap border border-line bg-panel px-5 py-2.5 font-mono text-[13px] uppercase tracking-tight text-zinc-300 transition hover:border-accent hover:text-white"
    >
      <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
      {g}
    </span>
  ));
}

export function Games() {
  return (
    <section id="games" className="border-y border-line/50 bg-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center font-mono text-[12px] uppercase tracking-tight text-zinc-500">
          всё, во что сейчас играют
        </p>
        <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-tight text-zinc-600">
          500+ игр уже установлены и готовы к запуску
        </p>
      </div>

      <div className="group marquee mt-8 overflow-hidden" style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}>
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <div className="flex">{row(gameRowA)}</div>
          <div className="flex">{row(gameRowA)}</div>
        </div>
      </div>

      <div className="group marquee mt-5 overflow-hidden" style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}>
        <div className="flex w-max animate-marquee [animation-direction:reverse] group-hover:[animation-play-state:paused]">
          <div className="flex">{row(gameRowB)}</div>
          <div className="flex">{row(gameRowB)}</div>
        </div>
      </div>
    </section>
  );
}