import Image from "next/image";
import type { Config } from "@/db/schema";

export function ConfigImage({
  config,
  className,
  sizes,
}: {
  config: Pick<Config, "image" | "name" | "slug">;
  className?: string;
  sizes?: string;
}) {
  const src = config.image
    ? /^https?:\/\//.test(config.image)
      ? config.image
      : config.image
    : `/images/configs/${config.slug}.svg`;

  return (
    <div className={`relative ${className ?? ""}`}>
      <Image
        src={src}
        alt={config.name}
        fill
        sizes={sizes ?? "100%"}
        className="object-cover"
      />
    </div>
  );
}