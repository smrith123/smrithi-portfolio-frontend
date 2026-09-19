import Image from "next/image";
import type { ContentPanel } from "@/types/content";

/**
 * /content split page, from Figma "Desktop - 9" (473:422): two 720 x 840 link
 * panels side by side, each an image with a bottom gradient (transparent from
 * 66% to black) and a two-line Starleague Bold heading 73px in, 100px up.
 * Below md the panels stack, each half the viewport tall. The hover/focus
 * zoom lives in globals.css (.split / .split-panel / .split-media).
 */
export function ContentSplit({ panels }: { panels: ContentPanel[] }) {
  return (
    <div className="split flex min-h-[100dvh] flex-col bg-pink-soft md:flex-row">
      {panels.map((panel) => (
        <a
          key={panel.id}
          id={panel.id}
          href={panel.href}
          /* Named by its content (photo alt + heading); an aria-label of the heading alone hid the photo's alt from the name. */
          className="split-panel group relative flex min-h-[50dvh] flex-1 items-end overflow-hidden focus-visible:outline-none md:min-h-0"
        >
          <div className="split-media absolute inset-0 will-change-transform">
            {/*
              Both panels are above the fold at every width (side by side, or stacked at
              half the viewport each), and either can be the LCP element, so both load
              eagerly at high priority rather than preloading one of them.
            */}
            <Image
              src={panel.image}
              alt={panel.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent from-[66%] to-black" />

          <h2 className="relative px-6 pb-8 font-display font-bold uppercase text-[clamp(32px,3.9vw,56px)] leading-[1.07] text-white group-focus-visible:underline group-focus-visible:decoration-2 group-focus-visible:underline-offset-8 md:px-[clamp(24px,5vw,73px)] md:pb-[clamp(40px,7vw,100px)]">
            {panel.lines.map((line, li) => (
              <span key={li} className="block">
                {line.map((part, pi) => (
                  <span key={pi} className={part.accent ? "text-pink" : undefined}>
                    {part.text}
                  </span>
                ))}
                {/* A real space between the lines, so the visible text reads as the link's accessible name does. */}
                {li < panel.lines.length - 1 && " "}
              </span>
            ))}
          </h2>
        </a>
      ))}
    </div>
  );
}
