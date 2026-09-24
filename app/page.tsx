import { Hero } from "@/components/landing/Hero";
import { Games } from "@/components/landing/Games";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Reviews } from "@/components/landing/Reviews";
import { Order } from "@/components/landing/Order";
import { getActiveConfigs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const configs = await getActiveConfigs();

  return (
    <>
      <Hero />
      <Games />
      <Benefits />
      <HowItWorks />
      <Pricing configs={configs} />
      <Faq />
      <Reviews />
      <Order />
    </>
  );
}