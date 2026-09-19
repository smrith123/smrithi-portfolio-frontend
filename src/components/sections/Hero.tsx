/* eslint-disable @next/next/no-img-element -- decorative vectors exported from the design */
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { vectors } from "@/content/assets";
import type { HeroContent } from "@/types/content";

import { HERO_TEAR, HERO_TEAR_PATH } from "./hero-tear";

/**
 * The paper sheet's torn left edge is the Figma hero's own torn-paper vector
 * (see hero-tear.ts), rotated so its length runs down the sheet and its torn
 * side faces the pink. Units are object-bounding-box, so the clip scales with
 * the sheet. Shown at 1.6x the Figma's scale so the bites read at full width:
 * at 1440 the edge is ~34px deep. Three copies tile the height, every other
 * one mirrored end-for-end so adjacent copies meet on the same profile.
 */
const TEAR_SCALE = 1.6;
const SHEET_HEIGHT = 795; // desktop frame, px
const SHEET_WIDTH = 1058; // desktop frame sheet width (73.5% of 1440), px
const TILE_LENGTH = HERO_TEAR.fillEnd - HERO_TEAR.fillStart;
const TILE_DEPTH = HERO_TEAR.solidBottom - HERO_TEAR.tearTop;
const TEAR_WIDTH = (TILE_DEPTH * TEAR_SCALE) / SHEET_WIDTH; // depth as a share of the sheet's width
/*
 * matrix(a b c d e f): X = a·x + c·y + e, Y = b·x + d·y + f.
 * Vector y (depth) becomes X across the sheet; vector x (length) becomes Y
 * down it, mirrored on odd tiles so the strip ends line up.
 */
const tileTransform = (k: number) => {
  const b = TEAR_SCALE / SHEET_HEIGHT;
  const c = TEAR_SCALE / SHEET_WIDTH;
  const e = -HERO_TEAR.tearTop * c;
  return k % 2 === 0
    ? `matrix(0 ${b} ${c} 0 ${e} ${(k * TILE_LENGTH - HERO_TEAR.fillStart) * b})`
    : `matrix(0 ${-b} ${c} 0 ${e} ${(k * TILE_LENGTH + HERO_TEAR.fillEnd) * b})`;
};
const TEAR_TILES = [0, 1, 2];

/**
 * Two approved frames. Mobile (390 x 866, node 880:1558): a 390 x 477 image
 * stage, then the copy in a cream block with full-width buttons. Desktop
 * (1440 x 795): the stage fills the section and the copy sits over the paper;
 * every offset is a percentage of that frame so it scales as one picture.
 */
export function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section id="top" className="relative isolate overflow-hidden lg:h-[55.2vw] lg:max-h-[795px]">
      {/* Tablet keeps the mobile structure but caps the stage so it doesn't fill the whole viewport. */}
      <div className="relative aspect-[390/477] overflow-hidden md:aspect-[5/4] lg:absolute lg:inset-0 lg:aspect-auto lg:overflow-visible">
        {/* Pink panel: 215/390 on mobile, 414/1440 on desktop. */}
        <div aria-hidden className="absolute inset-y-0 left-0 -z-20 w-[55.1%] bg-pink-soft lg:w-[28.75%]" />
        <img
          src={vectors.heroGlow}
          alt=""
          aria-hidden
          width={1044}
          height={1449}
          fetchPriority="low"
          className="absolute -z-20 hidden lg:block left-[-13%] top-[-19%] w-[64.6%] max-w-none"
        />

        {/* Paper sheet laid over the pink: torn edge (clip), bright fibre rim beneath it, soft shadow on the wrapper. */}
        <svg aria-hidden className="absolute size-0">
          <clipPath id="hero-tear" clipPathUnits="objectBoundingBox">
            {TEAR_TILES.map((k) => (
              <path key={k} d={HERO_TEAR_PATH} transform={tileTransform(k)} />
            ))}
            {/* Solid remainder of the sheet; starts inside the strip's solid band so there is no seam. */}
            <rect x={TEAR_WIDTH * 0.6} y="0" width={1 - TEAR_WIDTH * 0.6} height="1" />
          </clipPath>
        </svg>
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 -z-10 w-[69.9%] lg:w-[73.5%]"
          style={{ filter: "drop-shadow(-6px 0 10px rgba(0, 0, 0, 0.16))" }}
        >
          <div className="absolute inset-0 bg-[#f7f5f2]" style={{ clipPath: "url(#hero-tear)", transform: "translateX(-0.6%)" }} />
          <div className="absolute inset-0" style={{ clipPath: "url(#hero-tear)" }}>
            {/*
              The paper is the LCP element at every width. Eager + high priority (rather than
              next/image's `preload`) makes React emit the head preload with fetchpriority=high,
              so the browser does not start it at the low priority an image preload gets by default.
            */}
            <Image src={hero.texture} alt="" fill loading="eager" fetchPriority="high" sizes="75vw" className="object-cover" />
          </div>
        </div>

        {/*
          Portrait. Mobile frame "Image (Laila)": 273.6 x 500.9 box at (0, -23.8), cover-cropped.
          Desktop: contained, bottom-left, nudged 0.5% right of the Figma box.
          No align-self here: on an abspos box with top+bottom set it would collapse the box to 0.
        */}
        <div className="absolute top-[-5%] left-0 h-[105%] w-[70.2%] motion-safe:animate-hero-left lg:inset-y-0 lg:top-0 lg:left-[0.5%] lg:h-auto lg:w-[48.7%]">
          <Image
            src={hero.portrait}
            alt="Smrithi, seated, smiling with her chin resting on her hand"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 70vw"
            className="object-cover lg:object-contain lg:object-left-bottom"
          />
        </div>
      </div>

      {/* Copy block: 880:1560 on mobile (px 20, pt 24, pb 32); absolute at (right 108, top 190) of the desktop frame. */}
      <div className="relative flex flex-col items-end gap-4 px-5 pt-6 pb-8 text-right motion-safe:animate-hero-right md:px-12 md:pt-10 md:pb-12 lg:absolute lg:top-[22.26%] lg:right-[7.5%] lg:w-[63%] lg:gap-[2.2vw] lg:p-0">
        {/*
          Sized by cap height so the composition survives the font swap.
          Desktop frame: Starleague Black 124px / Bold 48px with 14px gaps. Figma's trimmed
          boxes (82 / 32) use the font's capHeight metric; the rendered ink is 0.7075em, so
          --h1cap is 124 * 0.7075 = 87.7px (6.094vw) and the gap ratio is 14 / 87.7.
          Mobile frame: caps 33 / 14.5 with ~10px and ~14px gaps (ratios 0.438 / 0.30 / 0.42).
          --h1mi is 1 - --h1m; the margin terms cancel the two sizes' differing cap offsets.
        */}
        <h1 className="flex w-full flex-col items-end font-display leading-[var(--display-cap)] pb-[calc(var(--display-cap-top)*var(--h1cap)/var(--display-cap))] [--h1cap:clamp(35.3px,9.05vw,59.5px)] [--h1m:0.438] [--h1mi:0.562] [--h1g1:0.30] [--h1g2:0.42] lg:[--h1cap:6.094vw] lg:[--h1m:0.3902] lg:[--h1mi:0.6098] lg:[--h1g1:0.1596] lg:[--h1g2:0.1596]">
          {/* Starleague Black, as in the Figma. (Weight 400 was a thinning workaround for the Unbounded stand-in.) */}
          <span className="block font-black uppercase text-pink text-[calc(var(--h1cap)/var(--display-cap))]">
            {hero.titleTop}{" "}
          </span>
          <span className="mt-[calc(var(--h1cap)*var(--h1g1)+var(--display-cap-top)*var(--h1cap)*var(--h1mi)/var(--display-cap))] block font-bold uppercase text-plum text-[calc(var(--h1cap)*var(--h1m)/var(--display-cap))]">
            {hero.titleMid}{" "}
          </span>
          <span className="mt-[calc(var(--h1cap)*var(--h1g2)-var(--display-cap-top)*var(--h1cap)*var(--h1mi)/var(--display-cap))] block font-black uppercase text-pink text-[calc(var(--h1cap)/var(--display-cap))]">
            {hero.titleBottom}
          </span>
        </h1>
        <p className="font-body text-[15px] leading-[24px] text-[#4a2b35]/50 lg:w-[53vw] lg:max-w-[760px] lg:text-[1.67vw] lg:leading-[1.25]">
          {hero.subtitle}
        </p>
        <div className="mt-2 flex w-full flex-col gap-3 motion-safe:animate-hero-right [animation-delay:250ms] md:w-auto md:flex-row md:items-center md:justify-end md:gap-6 lg:mt-0">
          <Button
            href={hero.primaryCta.href}
            size="sm"
            className="md:rounded-none"
            icon={
              <>
                {/* Low priority: 1 KB glyphs must not compete with the hero images, and React then skips preloading them. */}
                <img src={vectors.arrowUpRightWhiteSm} alt="" width={16} height={16} fetchPriority="low" className="md:hidden" />
                <img src={vectors.arrowSmall} alt="" width={13} height={13} fetchPriority="low" className="hidden md:block" />
              </>
            }
          >
            {hero.primaryCta.label}
          </Button>
          <Button
            href={hero.secondaryCta.href}
            size="sm"
            variant="outline"
            className="md:rounded-none"
            icon={
              <>
                <img src={vectors.arrowUpRightPinkSm} alt="" width={16} height={16} fetchPriority="low" className="md:hidden" />
                <img src={vectors.arrowSmallPink} alt="" width={13} height={13} fetchPriority="low" className="hidden md:block" />
              </>
            }
          >
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
