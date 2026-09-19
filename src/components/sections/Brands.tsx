import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Brand, SectionHeading as Heading } from "@/types/content";

/**
 * Logo strip loops with a pure-CSS marquee: the track is rendered twice and shifted by -50%.
 * Mobile frame (880:1971): heading above a 20px-tall strip at 60% opacity with 40px gaps.
 */
export function Brands({ eyebrow, lines, items }: Heading & { items: Brand[] }) {
  const loop = [...items, ...items, ...items];
  return (
    <section id="brands" className="gutter flex flex-col gap-6 pt-14 pb-8 lg:flex-row lg:items-center lg:gap-[87px] lg:py-[clamp(64px,8.3vw,120px)]">
      <SectionHeading eyebrow={eyebrow} lines={lines} className="shrink-0" />

      {/* Auto-scrolling strip pauses on hover and on keyboard focus (WCAG 2.2.2). */}
      <div
        tabIndex={0}
        aria-label="Brands worked with; the strip pauses while focused"
        className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
      >
        <ul className="flex w-max items-center gap-10 opacity-60 motion-safe:animate-marquee group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused] lg:gap-[clamp(48px,7.6vw,110px)] lg:opacity-100">
          {/* Only the first copy of the list is exposed; the rest exist to fill the loop, so they are hidden and alt-less. */}
          {[...loop, ...loop].map((brand, i) => (
            <li key={`${brand.id}-${i}`} className="shrink-0" aria-hidden={i >= items.length || undefined}>
              <Image
                src={brand.logo}
                alt={i < items.length ? brand.name : ""}
                width={brand.width}
                height={brand.height}
                className="h-5 w-auto lg:h-[41px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
