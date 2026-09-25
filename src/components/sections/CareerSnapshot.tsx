/* eslint-disable @next/next/no-img-element -- torn-edge vector exported from the design */
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/SectionHeading";
import { vectors } from "@/content/assets";
import { cn } from "@/lib/cn";
import type { CareerCard, CareerContent } from "@/types/content";

/**
 * Desktop frame (1440 x 752): sage arch behind the portrait, torn dark strip
 * at its base, three fact cards stepping down the left, CV panel on the right,
 * reproduced with percentage offsets at lg+. Mobile frame (880:2088): a 258px
 * arch group, then the cards and panel stacked full width with 16px gaps, the
 * first card tucked 34px up under the dark strip; on scroll the arch + first
 * card stick and the other cards rise over them (see the mobile block below).
 */
/* Where the rising cards stick: the base block's 24px offset + the arch group's flow height (min(66vw, 440px) x 2336/2582) + the column's 24px padding. */
const RISING_CARD_TOP = "calc(48px + min(66vw, 440px) * 0.90473)";

export function CareerSnapshot({ career }: { career: CareerContent }) {
  const [c1, c2, c3] = career.cards;
  // Bottom margin: Figma has 32px to Contact on the 390 frame (8045.9 -> 8077.9), 120px on the 1440 frame (8812 -> 8932).
  return (
    <section id="career" className="mt-12 mb-8 lg:mt-[clamp(64px,8.3vw,120px)] lg:mb-[clamp(64px,8.3vw,120px)]">
      {/* lg+: scaled composition */}
      <div className="relative mx-auto hidden aspect-[1440/752] w-full max-w-[1440px] lg:block">
        <div className="absolute top-0 left-1/2 aspect-[666/630] w-[46.25%] -translate-x-1/2 rounded-t-full bg-sage" />
        <div className="absolute top-0 left-1/2 aspect-[404/718] w-[28.07%] -translate-x-1/2">
          <Image src={career.portrait} alt="Smrithi crouching in an oversized blazer and tie" fill sizes="30vw" className="object-cover" />
        </div>
        <img src={vectors.careerTornEdge} alt="" aria-hidden width={671} height={157} loading="lazy" className="absolute top-[79.2%] left-[26.55%] w-[46.57%]" />

        <FactCard card={c1} className="absolute top-[7%] left-[17.3%] w-[20.5%]" />
        <FactCard card={c2} className="absolute top-[37.8%] left-[12%] w-[20.5%]" />
        <FactCard card={c3} className="absolute top-[72.7%] left-[14.3%] w-[20.5%]" />

        <Panel panel={career.panel} className="absolute top-[42.2%] left-[67.4%] w-[26.4%]" />
      </div>

      {/* < lg: sticky base (arch + MBA card) with the other cards rising over it */}
      {/*
        Mobile frame (880:2088): a 258-wide arch group - sage arch (244 tall), the portrait
        centred at 61% width, the torn dark strip closing it at 291.6 - whose strip runs on
        under the first card: the cards container starts 233.6 below the group's top and
        pads 24, so the MBA card overlaps the strip by 34 (880:2050 vs 880:2060). The
        group's flow box is therefore only the 258 x 233.6 part above the container; the
        strip is laid out from the group's full 258 x 291.6 box and hangs below it.

        Scroll: the arch + MBA card block sticks 24px from the top of the viewport and the
        other two cards stick where the MBA card sits (24px + arch height + 24px), so each
        rises from below over the card before it and the stack reverses on the way back;
        `.stack-card` in globals.css drops all of it to a plain column for reduced motion
        and viewports it cannot fit. The wrapper is the sticky container, so once the last
        card has landed the whole block scrolls on in normal flow and the CV panel follows.
      */}
      <div className="flex flex-col pt-6 lg:hidden">
        <div className="relative flex flex-col">
          <div className="stack-card sticky top-6">
            <div className="relative mx-auto aspect-[2582/2336] w-[66vw] max-w-[440px]">
              <div className="absolute top-0 inset-x-0 aspect-[666/630] rounded-t-full bg-sage" />
              <div className="absolute top-0 left-1/2 aspect-[404/718] w-[61%] -translate-x-1/2">
                <Image src={career.portrait} alt="Smrithi crouching in an oversized blazer and tie" fill sizes="60vw" className="object-cover" />
              </div>
              <div className="absolute top-0 inset-x-0 aspect-[666/752]">
                <img src={vectors.careerTornEdge} alt="" aria-hidden width={671} height={157} loading="lazy" className="absolute bottom-0 inset-x-0 w-full" />
              </div>
            </div>
            {/* One full-width column as in the mobile frame; capped on tablets so cards keep card proportions. */}
            <div className="gutter w-full pt-6 md:mx-auto md:max-w-[600px]">
              <FactCard card={c1} className="relative" />
            </div>
          </div>
          {/* The rising cards share the tallest card's height so each fully covers the one beneath. */}
          <div className="gutter grid w-full auto-rows-fr gap-4 pt-4 md:mx-auto md:max-w-[600px]">
            {[c2, c3].map((card) => (
              <div key={card.id} className="stack-card sticky" style={{ top: RISING_CARD_TOP }}>
                <FactCard card={card} className="h-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="gutter w-full pt-6 md:mx-auto md:max-w-[600px]">
          <Panel panel={career.panel} className="w-full" />
        </div>
      </div>
    </section>
  );
}

function FactCard({ card, className }: { card: CareerCard; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-[24px] bg-beige p-5 lg:gap-6 lg:rounded-[40px] lg:p-[clamp(20px,2.2vw,32px)]", className)}>
      <DisplayHeading as="h3" lines={card.lines} flow="afterFirst" className="text-[20px] font-normal leading-[1.25] lg:text-[clamp(18px,1.67vw,24px)]" />
      <p className="font-body text-[14px] uppercase leading-none text-black/50 lg:text-[clamp(14px,1.4vw,20px)]">{card.meta}</p>
    </div>
  );
}

function Panel({ panel, className }: { panel: CareerContent["panel"]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-[24px] bg-beige p-5 lg:gap-5 lg:rounded-[40px] lg:p-[clamp(20px,2.2vw,32px)]", className)}>
      <div className="flex flex-col gap-1 lg:gap-6">
        <DisplayHeading as="h3" lines={panel.lines} flow="all" className="text-[22px] font-normal leading-[1.25] lg:text-[clamp(22px,2.2vw,32px)] lg:leading-[0.94]" />
        <p className="font-body text-[14px] leading-[19px] text-black/50 lg:text-[clamp(14px,1.4vw,20px)] lg:leading-none">{panel.description}</p>
      </div>
      <div className="flex flex-col gap-3 pt-2 lg:gap-4 lg:pt-0">
        {/* Until a CV is uploaded the link is the "#" placeholder, which in a new tab would just open the
            site again, so the button only appears once there is a file to open. */}
        {/^https?:\/\//.test(panel.downloadCta.href) && (
          <Button
            href={panel.downloadCta.href}
            /* The CV is served from Cloudinary, another origin, where a download attribute is ignored, so open it in a new tab. */
            target="_blank"
            rel="noreferrer"
            rounded
            className="w-full lg:text-[clamp(14px,1.2vw,17px)]"
            iconPosition="left"
            icon={<img src={vectors.download} alt="" width={20} height={20} loading="lazy" className="size-4 lg:size-5" />}
          >
            {panel.downloadCta.label}
          </Button>
        )}
        <Button
          href={panel.contactCta.href}
          variant="outline"
          rounded
          className="w-full lg:text-[clamp(14px,1.2vw,17px)]"
          iconPosition="left"
          icon={<img src={vectors.mail} alt="" width={20} height={20} loading="lazy" className="size-4 lg:size-5" />}
        >
          {panel.contactCta.label}
        </Button>
      </div>
    </div>
  );
}
