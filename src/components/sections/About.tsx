"use client";

import { motion, useScroll } from "motion/react";
import { useRef, type CSSProperties } from "react";
import type { AboutContent } from "@/types/content";

/**
 * Words brighten in reading order as the section scrolls through the
 * viewport. Progress is written to a CSS variable and the per-word colour
 * is a color-mix() in globals.css, so no per-word React state or re-renders.
 * Mobile frame (864:995): 50px side padding, 44px vertical, 20/28 medium.
 */
export function About({ about }: { about: AboutContent }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const words = about.statement.split(" ");

  return (
    <section
      id="about"
      ref={ref}
      className="flex flex-col items-center gap-[7px] rounded-b-[50px] bg-ink px-[50px] py-11 text-center lg:gutter lg:gap-6 lg:py-[clamp(96px,12vw,174px)]"
    >
      <p className="font-body font-light text-[12px] text-white/50 lg:text-eyebrow">{about.eyebrow}</p>
      <motion.p
        style={{ "--p": scrollYProgress, "--n": words.length } as CSSProperties}
        className="mx-auto max-w-[1224px] font-body font-medium text-[20px] leading-[28px] lg:font-semibold lg:text-[clamp(24px,3.2vw,46px)] lg:leading-[1.3]"
      >
        {words.map((word, i) => (
          <span key={i} className="about-word" style={{ "--i": i } as CSSProperties}>
            {word}{" "}
          </span>
        ))}
      </motion.p>
    </section>
  );
}
