"use client";

/* eslint-disable @next/next/no-img-element -- icon vectors exported from the design */
import Image from "next/image";
import { motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vectors } from "@/content/assets";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useMediaQuery";
import type { Platform } from "@/types/content";

/**
 * Mobile frame (888:2529): 12px tabs, 24/30 follower count, 15/24 body,
 * two full-width rounded buttons, then a 3 x 2 grid of squares with 6px gaps.
 */
export function Platforms({ items }: { items: Platform[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const reduce = useReducedMotion();
  const active = items.find((p) => p.id === activeId) ?? items[0];
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (id: Platform["id"]) => setActiveId(id);

  // WAI-ARIA tabs: arrows (wrapping), Home and End move focus and select; only the active tab is in the tab order.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    select(items[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="social" className="gutter pt-6 lg:pt-[clamp(64px,8.3vw,120px)]">
      {/* Each platform has its own label and heading, so this follows the active tab. */}
      <SectionHeading eyebrow={active.eyebrow} lines={active.lines} className="mb-8 lg:mb-[clamp(48px,7vw,100px)]" />

      <div role="tablist" aria-label="Platforms" className="flex gap-4 border-b border-black/20 lg:border-black/25">
        {items.map((platform, index) => {
          const selected = platform.id === active.id;
          return (
            <button
              key={platform.id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${platform.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${platform.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(platform.id)}
              onKeyDown={(e) => onTabKey(e, index)}
              className={cn(
                "relative touch-manipulation pb-2 font-mono text-[12px] uppercase leading-[18px] tracking-[0.3px] transition-colors duration-200 hover:text-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink lg:w-[107px] lg:p-[10px] lg:text-[16px] lg:leading-[16.5px] lg:tracking-normal",
                selected ? "text-pink" : "text-black",
              )}
            >
              {platform.name}
              {selected && (
                <motion.span
                  layoutId="platform-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-pink"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/*
        Every platform's panel is in the HTML (inactive ones `hidden`, as the ARIA tabs
        pattern expects), so all three profiles, descriptions and links are crawlable
        without anyone clicking a tab. The first panel renders fully visible; a tab
        change fades the new one in from 10px below, unless motion is reduced.
      */}
      {items.map((platform) => {
        const selected = platform.id === active.id;
        return (
          <motion.div
            key={platform.id}
            role="tabpanel"
            id={`${baseId}-panel-${platform.id}`}
            aria-labelledby={`${baseId}-tab-${platform.id}`}
            hidden={!selected}
            initial={false}
            animate={selected ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 grid gap-4 lg:mt-[46px] lg:grid-cols-[minmax(0,1fr)_minmax(0,772px)] lg:gap-[55px]"
          >
            <div className="flex flex-col gap-6 lg:gap-[60px]">
              <div className="flex flex-col gap-3 lg:gap-10">
                <div className="flex flex-col gap-1 lg:gap-[18px]">
                  <p className="font-display text-[24px] leading-[30px] text-black lg:text-[clamp(24px,2.2vw,32px)] lg:leading-none">{platform.followers}</p>
                  <a
                    href={platform.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${platform.name} profile ${platform.handle}`}
                    className="font-body text-[14px] leading-[21px] uppercase text-pink hover:underline lg:text-[clamp(16px,1.4vw,20px)] lg:leading-normal"
                  >
                    {platform.handle}
                  </a>
                </div>
                <p className="max-w-[520px] font-body text-[15px] leading-[24px] text-black/70 lg:font-sans lg:text-[clamp(18px,1.67vw,24px)] lg:leading-[1.4]">
                  {platform.description}
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 lg:max-w-[385px] lg:gap-4">
                <Button
                  href={platform.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${platform.followLabel} on ${platform.name}`}
                  size="lg"
                  rounded
                  className="w-full justify-center lg:justify-start"
                  icon={
                    <>
                      <img src={vectors.arrowUpRightWhiteSm} alt="" width={16} height={16} loading="lazy" className="lg:hidden" />
                      <img src={vectors.arrowUpRightWhite} alt="" width={20} height={20} loading="lazy" className="hidden lg:block" />
                    </>
                  }
                >
                  {platform.followLabel}
                </Button>
                <Button
                  href={platform.collabUrl}
                  size="lg"
                  variant="outline-dark"
                  rounded
                  className="w-full justify-center lg:justify-start"
                  icon={
                    <>
                      <img src={vectors.arrowUpRightPinkSm} alt="" width={16} height={16} loading="lazy" className="lg:hidden" />
                      <img src={vectors.arrowUpRight} alt="" width={20} height={20} loading="lazy" className="hidden lg:block" />
                    </>
                  }
                >
                  {platform.collabLabel}
                </Button>
              </div>
            </div>

            <ul className="grid grid-cols-3 gap-1.5 lg:gap-[11px]">
              {platform.images.map((image, i) => {
                const photo = (
                  <Image
                    src={image.url}
                    alt={image.alt ?? `${platform.name} post ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 250px, 33vw"
                    className="object-cover transition-transform duration-500 ease-out-quint group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                );
                return (
                  <li key={i} className="group relative aspect-square overflow-hidden bg-stone lg:aspect-[5/6]">
                    {/* Each photo links to its own post when the admin has set one. */}
                    {image.link ? (
                      <a
                        href={image.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${platform.name} post ${i + 1}`}
                        className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
                      >
                        {photo}
                      </a>
                    ) : (
                      photo
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        );
      })}
    </section>
  );
}
