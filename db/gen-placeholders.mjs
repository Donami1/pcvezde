import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = resolve(root, "public", "images", "configs");
mkdirSync(dir, { recursive: true });

const items = [
  { slug: "start", name: "СТАРТ", c1: "#7c3aed", c2: "#0ea5e9", gpu: "GTX 1660 S" },
  { slug: "optima", name: "ОПТИМА", c1: "#8b5cf6", c2: "#ec4899", gpu: "RTX 3060" },
  { slug: "pro", name: "ПРО", c1: "#a855f7", c2: "#f43f5e", gpu: "RTX 4060 Ti" },
  { slug: "ultra", name: "УЛЬТРА", c1: "#d946ef", c2: "#f59e0b", gpu: "RTX 4070 S" },
  { slug: "ultra-pro", name: "УЛЬТРА ПРО", c1: "#f43f5e", c2: "#fbbf24", gpu: "RTX 4090" },
];

for (const it of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
 <defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0" stop-color="${it.c1}"/><stop offset="1" stop-color="${it.c2}"/>
  </linearGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0" stop-color="#12121b"/><stop offset="1" stop-color="#08080d"/>
  </linearGradient>
 </defs>
 <rect width="800" height="500" fill="url(#bg)"/>
 <g opacity="0.12" stroke="url(#g)" stroke-width="1">
  <path d="M0 100H800M0 200H800M0 300H800M0 400H800"/>
  <path d="M100 0V500M200 0V500M300 0V500M400 0V500M500 0V500M600 0V500M700 0V500"/>
 </g>
 <rect x="500" y="140" width="200" height="140" rx="10" fill="url(#g)" opacity="0.9"/>
 <rect x="515" y="155" width="170" height="100" rx="6" fill="#08080d" opacity="0.75"/>
 <rect x="560" y="285" width="80" height="12" rx="4" fill="url(#g)" opacity="0.7"/>
 <rect x="540" y="300" width="120" height="6" rx="3" fill="url(#g)" opacity="0.4"/>
 <text x="60" y="270" font-family="Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff" opacity="0.95">${it.name}</text>
 <text x="60" y="330" font-family="Arial, sans-serif" font-size="34" font-weight="600" fill="url(#g)">${it.gpu}</text>
 <text x="60" y="390" font-family="Arial, sans-serif" font-size="24" fill="#a1a1aa">ПК ВЕЗДЕ</text>
</svg>`;
  writeFileSync(resolve(dir, `${it.slug}.svg`), svg);
}

console.log("Placeholders written:", items.map((i) => i.slug).join(", "));