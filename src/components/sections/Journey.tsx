"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useMediaQuery, useReducedMotion } from "@/lib/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import type { JourneyStep, SectionHeading as Heading } from "@/types/content";

/* The pin needs the 450px card row plus breathing room; shorter windows keep the row as a native scroller. */
const CAN_PIN = "(min-width: 1024px) and (min-height: 520px)";

/**
 * Desktop: section pins while vertical scroll pans the card track left, with
 * the heading on the right. Mobile frame (880:1740): left-aligned heading
 * above a native horizontal scroller of separate 257 x 316 bordered cards.
 *
 * While pinned the card viewport is `overflow: clip`, never `hidden`: a hidden
 * box is still a scroll container, so a swipe made before the pin engaged (or
 * on the mobile scroller before a resize past lg), a scroll-snap re-snap or a
 * scrollIntoView could leave it with a scrollLeft that added to the pan and
 * pushed the first cards out of view. Clip has no scroll offset at all.
 */
export function Journey({ eyebrow, lines, steps }: Heading & { steps: JourneyStep[] }) {
  const reduce = useReducedMotion();
  const pinned = useMediaQuery(CAN_PIN) && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const distanceRef = useRef(0);
  const x = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  /*
   * Pan the track by scroll progress, clamped to the live overflow so the last
   * card can never travel past the viewport's right edge whatever was measured.
   */
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const max = viewport && track ? Math.max(0, track.scrollWidth - viewport.clientWidth) : distanceRef.current;
    x.set(-Math.min(max, p * distanceRef.current));
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => {
      // Any offset left by the native scroller (before the pin, or below lg) must not add to the pan.
      if (pinned) viewport.scrollLeft = 0;
      const d = pinned ? Math.max(0, track.scrollWidth - viewport.clientWidth) : 0;
      distanceRef.current = d;
      setDistance(d);
      x.set(-scrollYProgress.get() * d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);
    return () => ro.disconnect();
  }, [pinned, scrollYProgress, x]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      /*
       * Pinned: the 100dvh sticky viewport centres the 450px card row, leaving dead space above and
       * below. Margins cancel it so the section sits 120px from its neighbours (Figma), and the top
       * padding moves out of the pinned height so the pan and the pin end together.
       */
      /*
       * The pinned geometry comes from the `pin:` variant (globals.css), the same test as
       * CAN_PIN plus motion allowed, so the server HTML already has it and nothing moves when
       * JavaScript takes over. Only the height and the pan need JavaScript.
       * Mobile frame: 39.5px above and below the card track (the track itself adds 16px).
       */
      className="relative pt-10 pb-6 lg:pt-[clamp(64px,8.3vw,120px)] lg:pb-0 pin:pt-0 pin:mt-[calc(120px_-_(100dvh_-_450px)/2)] pin:mb-[calc((450px_-_100dvh)/2)]"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="pin:sticky pin:top-0 pin:flex pin:h-[100dvh] pin:items-center">
        {/* Figma 181:4710: 11px lead-in, a 960px card viewport (three cards) and the 361px heading block, no gap between them. */}
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:gap-0 lg:pl-[11px] lg:pr-[clamp(20px,7.5vw,108px)]">
          <SectionHeading
            eyebrow={eyebrow}
            lines={lines}
            align="right-lg"
            className="gutter order-first lg:order-last lg:ml-auto lg:w-[clamp(240px,25vw,361px)] lg:shrink-0 lg:px-0"
          />
          {/* Card viewport takes whatever is left of the row (960px at 1440); the pan distance is measured. */}
          <div
            ref={viewportRef}
            className={cn(
              /* Explicit width (row minus heading) rather than flex-1, so every engine resolves the same viewport. */
              "w-full lg:w-[calc(100%_-_clamp(240px,25vw,361px))] lg:shrink-0",
              "overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pin:snap-none pin:overflow-clip",
            )}
          >
            <motion.div ref={trackRef} style={pinned ? { x } : undefined} className="flex w-max gap-4 pb-4 pl-5 lg:gap-0 lg:pb-0 lg:pl-0">
              {steps.map((step, i) => (
                <article
                  key={step.id}
                  className={cn(
                    "flex h-[316px] w-[257px] shrink-0 snap-start flex-col justify-between border border-black/30 p-5 lg:h-[450px] lg:w-[320px] lg:px-5 lg:py-8",
                    i > 0 && "lg:border-l-0",
                  )}
                >
                  <p className="font-body text-[13px] uppercase leading-[19px] text-pink lg:text-[16px] lg:leading-6">{step.category}</p>
                  <div className="flex flex-col gap-3 lg:gap-7">
                    <h3 className="font-display text-[22px] leading-[27px] text-black lg:text-[clamp(24px,2.2vw,32px)] lg:leading-[0.9]">{step.title}</h3>
                    <p className="font-body text-[14px] leading-[19px] text-black/50 lg:text-[clamp(16px,1.4vw,20px)] lg:leading-[1]">{step.description}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
