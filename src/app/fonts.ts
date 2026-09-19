import { Abril_Fatface, DM_Mono, DM_Sans, Quicksand } from "next/font/google";
import localFont from "next/font/local";

/**
 * Display face: Starleague, as specified in the Figma file, in the three cuts
 * the design uses: Regular (follower counts, journey titles, career cards),
 * Bold (section headings, hero MEETS) and Black (hero CONTENT / STRATEGY).
 * Ranges are contiguous so every weight class resolves to exactly one cut:
 * 100-400 Regular, 401-699 Black, 700 Bold, 701-900 Black.
 *
 * Body face: the design's Grift is still unavailable; Quicksand stands in.
 * Components read the CSS variables, so a swap touches only this file.
 *
 * Every family here is preloaded on every route unless it opts out. DM Sans
 * (61 KB, one desktop-only paragraph in Platforms) and Abril Fatface (the
 * Content Portfolio numbers) sit far below the fold, so they skip the preload
 * and load when their text is laid out instead of competing with the hero.
 * With `display: swap` and next/font's metric-matched fallback, nothing moves.
 */
export const display = localFont({
  src: [
    { path: "../../public/fonts/Starleague-Regular.woff2", weight: "100 400", style: "normal" },
    { path: "../../public/fonts/Starleague-Black.woff2", weight: "401 699", style: "normal" },
    { path: "../../public/fonts/Starleague-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Starleague-Black.woff2", weight: "701 900", style: "normal" },
  ],
  variable: "--font-starleague",
  display: "swap",
});

export const body = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const sans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});

export const serif = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abril",
  display: "swap",
  preload: false,
});

export const fontVariables = [display, body, mono, sans, serif].map((f) => f.variable).join(" ");
