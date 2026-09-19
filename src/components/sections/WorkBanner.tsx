/* eslint-disable @next/next/no-img-element -- icon vector exported from the design */
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vectors } from "@/content/assets";
import type { WorkBannerContent } from "@/types/content";

/**
 * 1440 x 620 banner (the asset's native size). Eyebrow + three-line heading
 * sit on the left gutter, ~105px up from the bottom; the CTA sits on the
 * right gutter on the heading's last line. Below sm the banner is 4:5 and
 * the CTA drops under the heading.
 */
export function WorkBanner({ banner }: { banner: WorkBannerContent }) {
  return (
    <section className="relative isolate flex aspect-[4/5] items-end overflow-hidden bg-ink sm:aspect-[1440/620]">
      {/* The banner is the LCP element on both work pages: eager and high priority, like the home hero. */}
      <Image src={banner.image} alt={banner.alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      {/* Left-weighted wash so the white and pink lines read against the wall. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />

      <div className="gutter flex w-full flex-col gap-8 pb-[clamp(40px,7.3vw,105px)] md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow={banner.eyebrow} lines={banner.lines} tone="light" />
        <Button href={banner.cta.href} size="sm" icon={<img src={vectors.arrowSmall} alt="" width={13} height={13} />}>
          {banner.cta.label}
        </Button>
      </div>
    </section>
  );
}
