"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useMediaQuery";
import type { ContentPiece, SectionHeading as Heading } from "@/types/content";

const SCROLL_PER_CARD_VH = 80;

/**
 * Below lg (Figma mobile frame): the eyebrow + heading pin at the top of the
 * viewport and every label + card block sticks right beneath them, so each
 * block rises over the previous one as the user scrolls. Plain CSS sticky in
 * normal flow: the section is exactly as tall as its list, nothing is left
 * empty, and Platforms follows as soon as the last card is in place. The
 * blocks' sticky offset is the pinned heading's measured height; globals.css
 * turns the stack back into a static list where a block cannot fit under the
 * heading (short or landscape viewports) or when motion is reduced.
 *
 * Desktop (lg+): the heading scrolls away and a 202px label column + 862 x 566
 * card sit pinned and centred while the cards stack (scroll-linked motion).
 * The pinned viewport is 100vh so the pin and the scroll progress share one
 * range; the dead space that leaves around the content is measured and
 * cancelled with negative margins on the track, so the next section follows
 * at the design's 120px.
 */
export function ContentStack({ eyebrow, lines, pieces }: Heading & { pieces: ContentPiece[] }) {
  const reduce = useReducedMotion();
  const count = pieces.length;

  const headingRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [mobile, setMobile] = useState({ stackTop: 0, cardH: 0 });
  useEffect(() => {
    const heading = headingRef.current;
    const last = listRef.current?.lastElementChild as HTMLElement | null;
    if (!heading || !last) return;
    const measure = () => setMobile({ stackTop: heading.offsetHeight, cardH: last.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(heading);
    ro.observe(last);
    return () => ro.disconnect();
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dead, setDead] = useState({ top: 0, bottom: 0 });
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const measure = () => {
      const spare = Math.max(0, viewport.clientHeight - content.offsetHeight) / 2;
      setDead({ top: spare, bottom: spare });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(content);
    return () => ro.disconnect();
  }, [reduce]);

  return (
    <section id="content" className="gutter pt-6 lg:pt-[clamp(64px,8.3vw,120px)]">
      {/* < lg: sticky stack */}
      <div className="lg:hidden" style={{ paddingBottom: mobile.cardH }}>
        {/*
         * The blocks all release the moment the last one lands (its flow
         * bottom is the list's bottom). The heading has to release then too,
         * so its sticky range - this wrapper - ends one card block above the
         * list's bottom; the padding above puts that block back, so the
         * section keeps its height and the last card stays on screen while
         * the whole stack scrolls away as one. flow-root so the list's negative
         * margin shortens this box instead of collapsing out through it.
         */}
        <div className="flow-root">
          <div ref={headingRef} className="stack-heading sticky top-0 z-10 bg-cream pt-10 pb-8">
            <SectionHeading eyebrow={eyebrow} lines={lines} />
          </div>
          <ul
            ref={listRef}
            className="flex flex-col gap-8"
            style={{ "--stack-top": `${mobile.stackTop}px`, marginBottom: -mobile.cardH } as CSSProperties}
          >
            {pieces.map((piece) => (
              <li key={piece.id} className="stack-card sticky top-(--stack-top) grid gap-3 bg-cream">
                <Label piece={piece} />
                <Card piece={piece} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* lg+: pinned motion stack */}
      <div className="hidden lg:block">
        <div className="mb-[clamp(48px,8.3vw,120px)]">
          <SectionHeading eyebrow={eyebrow} lines={lines} />
        </div>
        {reduce ? (
          <ul className="flex flex-col gap-[84px]">
            {pieces.map((piece) => (
              <li key={piece.id} className="grid grid-cols-[202px_1fr] gap-[160px]">
                <Label piece={piece} />
                <Card piece={piece} />
              </li>
            ))}
          </ul>
        ) : (
          <div
            ref={trackRef}
            style={{
              height: `calc(100vh + ${(count - 1) * SCROLL_PER_CARD_VH}vh)`,
              marginTop: -dead.top,
              marginBottom: -dead.bottom,
            }}
          >
            <div ref={viewportRef} className="sticky top-0 flex h-[100vh] items-center overflow-hidden">
              <div ref={contentRef} className="grid w-full grid-cols-[202px_1fr] gap-[160px]">
                <div className="relative h-[137px]">
                  {pieces.map((piece, i) => (
                    <FadingLabel key={piece.id} piece={piece} index={i} count={count} progress={scrollYProgress} />
                  ))}
                </div>
                {/* Clipped so the next card rises into the frame instead of hanging below it. */}
                <div className="relative aspect-[862/566] w-full overflow-hidden rounded-[40px]">
                  {pieces.map((piece, i) => (
                    <StackedCard key={piece.id} piece={piece} index={i} count={count} progress={scrollYProgress} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type Slot = { piece: ContentPiece; index: number; count: number; progress: MotionValue<number> };

/*
 * Scroll-linked transforms run through WAAPI, so every keyframe range must
 * span exactly 0..1. Each card owns one stop; values are keyed per stop.
 */
const stops = (count: number) => Array.from({ length: count }, (_, j) => j / Math.max(1, count - 1));

function FadingLabel({ piece, index, count, progress }: Slot) {
  const opacity = useTransform(progress, stops(count), stops(count).map((_, j) => (j === index ? 1 : 0)));
  // Decorative: each card image already carries the label as alt text.
  return (
    <motion.div style={{ opacity }} className="absolute inset-0" aria-hidden>
      <Label piece={piece} />
    </motion.div>
  );
}

function StackedCard({ piece, index, count, progress }: Slot) {
  // Card i slides up during stop i-1 -> i, then shrinks slightly while card i+1 covers it.
  const y = useTransform(progress, stops(count), stops(count).map((_, j) => (j < index ? "112%" : "0%")));
  const scale = useTransform(progress, stops(count), stops(count).map((_, j) => (j <= index ? 1 : 0.94)));
  return (
    <motion.div style={{ y, scale, transformOrigin: "50% 0%" }} className="absolute inset-0 will-change-transform">
      <Card piece={piece} />
    </motion.div>
  );
}

function Label({ piece }: { piece: ContentPiece }) {
  return (
    <div className="flex items-end gap-3 lg:flex-col lg:items-start lg:gap-[17px]">
      <span className="font-serif text-[47px] leading-none text-black/15 lg:text-[clamp(56px,6.7vw,96px)] lg:leading-[0.75] lg:text-black/20">
        {piece.number}
      </span>
      <span className="pb-1 font-mono text-[18px] leading-[1.5] capitalize whitespace-nowrap text-black lg:pb-0 lg:text-[clamp(18px,2.2vw,32px)] lg:leading-[1.4]">
        {piece.label}
      </span>
    </div>
  );
}

function Card({ piece }: { piece: ContentPiece }) {
  return (
    <div className="relative aspect-[349/237] h-full w-full overflow-hidden rounded-[20px] bg-stone lg:aspect-[862/566] lg:rounded-[40px]">
      <Image
        src={piece.image}
        alt={piece.label.replace(/^-/, "")}
        fill
        sizes="(min-width: 1024px) 60vw, calc(100vw - 40px)"
        className="object-cover"
      />
    </div>
  );
}
