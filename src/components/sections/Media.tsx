"use client";

/* eslint-disable @next/next/no-img-element -- icon vectors exported from the design */
import Image, { getImageProps } from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vectors } from "@/content/assets";
import { cn } from "@/lib/cn";
import type { MediaItem, SectionHeading as Heading } from "@/types/content";

const SPRING = { type: "spring", stiffness: 210, damping: 30 } as const;

/**
 * Desktop: three-slot carousel, centre card large, sides dimmed, arrows outside.
 * Mobile frame (880:2026): the active card full width (313 x 361), then the
 * previous and next items as two square thumbnails carrying the arrows.
 */
export function Media({ eyebrow, lines, items }: Heading & { items: MediaItem[] }) {
  const [active, setActive] = useState(Math.min(1, items.length - 1));
  const count = items.length;
  const reduce = useReducedMotion();

  const step = (dir: 1 | -1) => setActive((i) => (i + dir + count) % count);
  const at = (offset: number) => items[(active + offset + count) % count];

  // Order cards by slot (left, centre, right) so their DOM position follows the active index.
  const slots = [-1, 0, 1].map((offset) => ({ offset, item: at(offset) }));

  return (
    <section id="media" className="mt-7 overflow-hidden rounded-[30px] bg-pink-light px-[38px] pt-6 pb-10 lg:mt-0 lg:rounded-[50px] lg:px-[clamp(20px,4.8vw,69px)] lg:py-[clamp(64px,8.3vw,120px)]">
      <SectionHeading eyebrow={eyebrow} lines={lines} align="center-lg" className="mb-6 lg:mb-[clamp(48px,8.3vw,120px)]" />

      <div className="relative mx-auto max-w-[1224px]" aria-roledescription="carousel" aria-label="Podcast and media appearances">
        {/* Mobile: active card + two thumbnails. */}
        <div className="md:hidden">
          <div className="relative aspect-[313/361] overflow-hidden rounded-[27px] bg-ink">
            <VideoCard key={at(0).id} item={at(0)} compact />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Thumb item={at(-1)} direction="prev" onClick={() => step(-1)} />
            <Thumb item={at(1)} direction="next" onClick={() => step(1)} />
          </div>
        </div>

        {/* Tablet and up: three-slot stage. */}
        <div className="hidden md:block">
          <div className="relative flex h-[clamp(420px,46vw,660px)] items-start justify-center">
            {slots.map(({ offset, item }) => {
              const centre = offset === 0;
              return (
                <motion.div
                  key={item.id}
                  layout={!reduce}
                  transition={SPRING}
                  aria-hidden={!centre || undefined}
                  className={cn(
                    "absolute top-0 overflow-hidden bg-ink",
                    centre
                      ? "z-10 h-full w-[clamp(280px,32vw,460px)] rounded-[32px] lg:rounded-[50px]"
                      : "top-[15%] h-[70%] w-[clamp(200px,25vw,360px)] rounded-[24px] lg:rounded-[40px]",
                    offset === -1 && "left-0",
                    offset === 1 && "right-0",
                  )}
                >
                  {centre ? <VideoCard item={item} /> : <SideCard item={item} />}
                </motion.div>
              );
            })}
          </div>
          <CarouselButton direction="prev" onClick={() => step(-1)} />
          <CarouselButton direction="next" onClick={() => step(1)} />
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {items[active].title}, {active + 1} of {count}
        </p>
      </div>
    </section>
  );
}

/* Mobile thumbnail: dimmed poster with the prev/next control in its lower corner (888:2583 / 888:2580). */
function Thumb({ item, direction, onClick }: { item: MediaItem; direction: "prev" | "next"; onClick: () => void }) {
  const prev = direction === "prev";
  return (
    <div className="relative aspect-square overflow-hidden rounded-[19px] bg-ink">
      <Image src={item.poster} alt="" fill sizes="45vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/50" />
      <button
        type="button"
        onClick={onClick}
        aria-label={prev ? `Previous: ${item.title}` : `Next: ${item.title}`}
        className={cn(
          "absolute bottom-2.5 flex size-10 touch-manipulation items-center justify-center rounded-full bg-white/70 transition-[transform,background-color] duration-200 ease-out-quint active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink",
          prev ? "left-2.5" : "right-2.5",
        )}
      >
        <img src={vectors.caretRight} alt="" width={20} height={20} loading="lazy" className={cn("size-5", prev && "rotate-180")} />
      </button>
    </div>
  );
}

function SideCard({ item }: { item: MediaItem }) {
  return (
    <motion.div layout className="absolute inset-0">
      <Image src={item.poster} alt="" fill sizes="(min-width: 1024px) 360px, 40vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/60" />
    </motion.div>
  );
}

function VideoCard({ item, compact = false }: { item: MediaItem; compact?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const playable = Boolean(item.videoSrc);
  /*
   * A <video> poster bypasses next/image, so it would fetch the original upload
   * (up to ~500 KB PNGs on Cloudinary). Route it through the optimizer instead,
   * sized for the largest card (460px wide) at 2x.
   */
  const poster = playable ? getImageProps({ src: item.poster, alt: "", width: 460, height: 660 }).props.src : undefined;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onPause);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onPause);
    };
  }, [item.id]);

  const toggle = () => {
    const el = video.current;
    if (!el || !playable) return;
    if (el.paused) void el.play().catch(() => setPlaying(false));
    else el.pause();
  };

  return (
    <motion.div layout={!compact} className="absolute inset-0">
      {playable ? (
        <video
          ref={video}
          src={item.videoSrc}
          poster={poster}
          muted={muted}
          playsInline
          loop
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image src={item.poster} alt={item.title} fill sizes={compact ? "90vw" : "(min-width: 1024px) 460px, 60vw"} className="object-cover" />
      )}
      <div className="absolute inset-0 bg-black/20" />
      {!compact && <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-b from-transparent to-black" />}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${item.title}` : `Play ${item.title}`}
        disabled={!playable}
        title={playable ? undefined : "Video coming soon"}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-default disabled:hover:scale-100",
          compact ? "size-[76px]" : "size-[clamp(72px,8.3vw,120px)]",
        )}
      >
        {playing ? <img src={vectors.pauseLarge} alt="" width={120} height={120} className="size-full" /> : <PlayIcon />}
      </button>

      <div className={cn("absolute inset-x-0 bottom-0 flex items-center", compact ? "gap-[15px] p-[15px]" : "gap-[30px] p-[clamp(20px,2.5vw,36px)]")}>
        <button
          type="button"
          onClick={toggle}
          disabled={!playable}
          aria-label={playing ? "Pause" : "Play"}
          className={cn("shrink-0 text-white", compact ? "size-[19px]" : "size-6")}
        >
          {playing ? <img src={vectors.pauseSmall} alt="" width={24} height={24} className="size-full" /> : <PlayIcon small />}
        </button>
        <div
          className={cn("flex-1", compact ? "h-1 rounded-full bg-white/30" : "h-1.5 bg-grey-lighter/30")}
          role="progressbar"
          aria-label={`${item.title} playback`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className={cn("h-full", compact ? "rounded-full bg-white" : "bg-grey-lighter")} style={{ width: `${Math.max(progress, playable ? 0 : 0.39) * 100}%` }} />
        </div>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          disabled={!playable}
          aria-pressed={muted}
          aria-label={muted ? "Unmute" : "Mute"}
          className={cn("shrink-0 transition-opacity", compact ? "size-[19px]" : "size-6", !muted && "opacity-50")}
        >
          <img src={vectors.speakerMuted} alt="" width={24} height={24} loading="lazy" className="size-full" />
        </button>
      </div>
    </motion.div>
  );
}

function CarouselButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 z-20 flex size-[clamp(56px,5.5vw,80px)] -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-[transform,background-color] duration-200 ease-out-quint hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink",
        prev ? "left-0 lg:-left-10" : "right-0 lg:-right-10",
      )}
    >
      <img src={vectors.caretRight} alt="" width={40} height={40} loading="lazy" className={cn("size-1/2", prev && "rotate-180")} />
    </button>
  );
}

/* No play glyph exists in the Figma export; this is the standard Material triangle. */
function PlayIcon({ small }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={small ? "size-full" : "size-full"} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
