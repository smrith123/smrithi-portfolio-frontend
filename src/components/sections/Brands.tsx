import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Brand, SectionHeading as Heading } from "@/types/content";

/**
 * Logo strip loops with a pure-CSS marquee: the track is rendered twice and shifted by -50%.
 * Every logo gets the same 16:9 slot with object-contain: logo files are often 16:9 canvases with wide
 * margins, so the slot is sized for the mark inside to read, not for the file's outer edge.
 * With reduced motion the strip stands still, so it wraps and shows each logo once instead.
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
        className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink motion-reduce:[mask-image:none]"
      >
        <ul className="flex w-max items-center gap-x-10 gap-y-6 motion-safe:animate-marquee group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center lg:gap-x-[clamp(48px,7.6vw,110px)]">
          {/* Only the first copy of the list is exposed; the rest exist to fill the loop, so they are hidden and alt-less. */}
          {[...loop, ...loop].map((brand, i) => (
            <li key={`${brand.id}-${i}`} className="shrink-0 motion-reduce:aria-hidden:hidden" aria-hidden={i >= items.length || undefined}>
              <Image
                src={brand.logo}
                alt={i < items.length ? brand.name : ""}
                width={brand.width}
                height={brand.height}
                className="aspect-video h-auto w-32 object-contain sm:w-40 lg:w-[clamp(160px,13vw,224px)]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
