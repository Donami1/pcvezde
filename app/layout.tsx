import type { Metadata } from "next";
import { Manrope, Source_Code_Pro, Unbounded } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteConfig } from "@/lib/settings";
import { resolveTheme } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["cyrillic", "latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: {
      default: `${site.tagline} | ${site.name}`,
      template: `%s | ${site.name}`,
    },
    description: site.seoDescription,
    keywords: [
      "аренда пк на дом",
      "аренда игрового пк",
      "пк напрокат",
      "компьютер в аренду",
      "геймерский пк на дом",
    ],
    openGraph: {
      title: `${site.tagline} | ${site.name}`,
      description: site.seoDescription,
      type: "website",
      locale: "ru_RU",
      siteName: site.name,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();
  const theme = resolveTheme(site.themeAccent);

  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${sourceCodePro.variable} ${unbounded.variable} h-full antialiased`}
      style={{
        "--accent-1": theme.accent1,
        "--accent-2": theme.accent2,
        "--accent-3": theme.accent3,
      } as React.CSSProperties}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header site={site} />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}