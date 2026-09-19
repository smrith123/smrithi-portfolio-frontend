import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { HeadingLine } from "@/types/content";

type Tone = "dark" | "light";
/* "-lg" variants are left-aligned on the mobile frame and take the alignment from lg up. */
type Align = "left" | "center" | "right" | "center-lg" | "right-lg";

const alignClasses: Record<Align, string> = {
  left: "",
  center: "items-center text-center",
  right: "items-end text-right",
  "center-lg": "lg:items-center lg:text-center",
  "right-lg": "lg:items-end lg:text-right",
};

export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p className={cn("font-body font-light text-eyebrow", tone === "dark" ? "text-black/50" : "text-white/50", className)}>
      {children}
    </p>
  );
}

/**
 * Multi-line display heading; each line can mix black/white and pink runs.
 * Below lg, `flow="afterFirst"` keeps the first line on its own and lets the
 * rest wrap naturally (the mobile frame's career cards); `flow="all"` lets
 * every line wrap naturally (the mobile frame's CV panel title).
 */
export function DisplayHeading({
  lines,
  tone = "dark",
  as: Tag = "h2",
  className,
  flow = "none",
}: {
  lines: HeadingLine[];
  tone?: Tone;
  as?: ElementType;
  className?: string;
  flow?: "none" | "afterFirst" | "all";
}) {
  const accentClass = (accent: HeadingLine[number]["accent"]) => {
    if (accent === true) return "text-pink";
    if (accent === "mobile") return tone === "dark" ? "text-pink lg:text-black" : "text-pink lg:text-white";
    return undefined;
  };
  // Headings come from the API, which `fromApi` casts without validating, so a
  // section stored before a schema change can arrive without its lines. Every
  // section's heading routes through here, so one check keeps a bad payload
  // from taking down the whole page: the section renders, the heading does not.
  const safeLines = Array.isArray(lines) ? lines.filter(Array.isArray) : [];
  if (process.env.NODE_ENV !== "production" && safeLines.length !== (lines?.length ?? 0)) {
    console.warn("[DisplayHeading] heading content is missing or malformed:", lines);
  }
  return (
    <Tag
      className={cn(
        "font-display font-bold uppercase text-heading",
        tone === "dark" ? "text-black" : "text-white",
        className,
      )}
    >
      {safeLines.map((line, li) => {
        const flows = flow === "all" || (flow === "afterFirst" && li > 0);
        return (
          <span key={li} className={flows ? "inline lg:block" : "block"}>
            {line.map((part, pi) => (
              <span key={pi} className={accentClass(part.accent)}>
                {part.text}
              </span>
            ))}
            {/* A real space between lines, invisible at a line end, so the heading's text reads as words ("Work that hits different"). */}
            {li < safeLines.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  lines,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow: string;
  lines: HeadingLine[];
  align?: Align;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 lg:gap-6", alignClasses[align], className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <DisplayHeading lines={lines} tone={tone} />
    </div>
  );
}
