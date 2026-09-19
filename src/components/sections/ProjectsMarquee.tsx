"use client";

import { useEffect, useRef, type FocusEvent } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "motion/react";
import type { Project } from "@/types/content";
import { ProjectCard } from "./ProjectCard";

/** Cruising speed in px per ms (45px/s): slow enough to read a card as it passes. */
const SPEED = 0.045;
/** Time constant of the ease back up to speed after a pause. */
const RAMP_MS = 280;

/*
 * Card widths match the static grid at every breakpoint: one per view below sm,
 * two from sm, three from lg. They are sized against the section's content box
 * (the `@container` below), so letting the strip run past it into the gutters
 * never changes a card. Margins rather than `gap`, so one copy of the list is
 * exactly one loop period, `--n * (--card + --gap)`, wide.
 */
const sizing =
  "@container mx-auto max-w-[1224px] [--gap:24px] [--card:100cqw] sm:[--card:calc((100cqw_-_24px)/2)] lg:[--gap:12px] lg:[--card:calc((100cqw_-_24px)/3)]";
/* The still (reduced-motion) row drops the last trailing gap, so its end rests on the content edge like its start. */
const item = "shrink-0 mr-(--gap) w-(--card) motion-reduce:snap-start motion-reduce:last:mr-0";

/**
 * Copies of the list in the track: one before the real cards (it fills the left
 * gutter), the real one, and two after. The section, not this component, clips
 * the strip, so cards run edge to edge of the dark panel.
 *
 * ponytail: four copies cover a panel up to ~5,300px wide with four cards;
 * render copies from a measured count if wider screens ever matter.
 */
const COPIES = 4;
const REAL = 1;

/**
 * More than three projects: the cards drift left in a seamless loop across the
 * whole dark panel. It stops the instant a pointer (mouse, pen or finger) is on
 * the strip or a card has keyboard focus, and eases back up to speed afterwards.
 * With reduced motion it is a plain swipeable row instead.
 *
 * The section it sits in must clip horizontally (`overflow-x-clip`): that is
 * the only edge the cards are cut at, and it is the edge of the dark panel.
 */
export function ProjectsMarquee({ items }: { items: Project[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const firstCopy = useRef<HTMLUListElement>(null); // the real, focusable copy
  const period = useRef(0);
  const speed = useRef(0);
  const hold = useRef({ pointer: false, focus: false });

  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const inView = useInView(viewport);

  // One copy's width is the loop period; it changes with the breakpoint and the card count.
  useEffect(() => {
    const list = firstCopy.current;
    if (!list) return;
    const measure = () => {
      period.current = list.getBoundingClientRect().width;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || !period.current) return;
    const dt = Math.min(delta, 100); // a backgrounded tab must not fast-forward the strip
    const target = hold.current.pointer || hold.current.focus ? 0 : SPEED;
    // Stop dead on pause; ease back up on resume.
    speed.current = target === 0 ? 0 : speed.current + (target - speed.current) * Math.min(1, dt / RAMP_MS);
    if (!speed.current) return;
    x.set(-((-x.get() + speed.current * dt) % period.current));
  });

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    hold.current.focus = true;
    // Keyboard focus only: shifting the strip under a mouse press would break the click.
    if (reduce || !(e.target as HTMLElement).matches(":focus-visible")) return;
    const card = e.target.getBoundingClientRect();
    const view = e.currentTarget.getBoundingClientRect();
    // Bring the focused card fully onto the content box. Only the real copy is focusable, so x stays within one period.
    if (card.left < view.left) x.set(x.get() + view.left - card.left);
    else if (card.right > view.right) x.set(x.get() - (card.right - view.right));
  };

  return (
    <div className={sizing} style={{ ["--n" as string]: items.length }}>
      <div
        ref={viewport}
        onPointerEnter={() => (hold.current.pointer = true)}
        onPointerLeave={() => (hold.current.pointer = false)}
        onFocus={onFocus}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) hold.current.focus = false;
        }}
        // Reduced motion: a native scroller that bleeds to the panel edges, padded so the first and last cards rest on the content edges.
        className="[--bleed:calc((100vw_-_100cqw)/2)] motion-reduce:-mx-(--bleed) motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto motion-reduce:scroll-px-(--bleed) motion-reduce:px-(--bleed)"
      >
        {/* Shifted one period left in CSS, so the real cards start on the content edge from the first paint. */}
        <motion.div
          style={{ x }}
          className="-ml-[calc(var(--n)_*_(var(--card)_+_var(--gap)))] flex w-max motion-reduce:ml-0"
        >
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              ref={copy === REAL ? firstCopy : undefined}
              // The copies are clickable, but hidden from assistive tech and the tab order.
              aria-hidden={copy !== REAL || undefined}
              className={copy === REAL ? "flex shrink-0" : "flex shrink-0 motion-reduce:hidden"}
            >
              {items.map((project) => (
                <li key={project.id} className={item}>
                  <ProjectCard project={project} tabIndex={copy === REAL ? undefined : -1} />
                </li>
              ))}
            </ul>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
