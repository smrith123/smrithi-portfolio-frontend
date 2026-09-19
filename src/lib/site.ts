import type { Metadata } from "next";

/**
 * Public origin used for canonical URLs, the sitemap, robots.txt, structured
 * data and social cards. Set NEXT_PUBLIC_SITE_URL to the production domain
 * before launch; on Vercel it otherwise falls back to the project's production
 * URL, and only local builds ever see localhost.
 */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

export const SITE_NAME = "Smrithi";
export const SITE_TITLE = "Smrithi | Content Creator & Digital Marketer";
export const SITE_DESCRIPTION =
  "Smrithi is a social media content creator and digital marketer with an MBA in digital marketing. Fashion, beauty and lifestyle content with the strategy to back it up.";

/**
 * Social profiles confirmed to be Smrithi's own, for the Person `sameAs` in the
 * structured data (comma-separated SITE_SOCIAL_PROFILES). Kept as explicit
 * configuration rather than read from the admin content: the handle on the
 * site today came from the design file and the TikTok/YouTube links point at
 * those sites' home pages, and `sameAs` is an identity claim.
 */
export const SOCIAL_PROFILES = (process.env.SITE_SOCIAL_PROFILES ?? "")
  .split(",")
  .map((url) => url.trim())
  .filter((url) => /^https:\/\/\S+\/\S+/.test(url));

/** Public, indexable routes. The sitemap is built from this list. */
export const ROUTES = ["/", "/about", "/social-media", "/content", "/content/professional-work", "/content/self-content", "/contact"] as const;
export type Route = (typeof ROUTES)[number];

/** Titles used for breadcrumbs and the structured data, per route. */
export const ROUTE_NAMES: Record<Route, string> = {
  "/": "Home",
  "/about": "About",
  "/social-media": "Social media",
  "/content": "Content",
  "/content/professional-work": "Professional work",
  "/content/self-content": "Self content",
  "/contact": "Contact",
};

/** The home page's share card (src/app/opengraph-image.jpg), for pages without a card of their own. */
const HOME_SHARE_IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Smrithi smiling beside the headline Content Meets Strategy" };

/**
 * Per-page metadata. Next merges metadata one top-level key at a time, so each
 * page sets its whole `openGraph` object (and its own canonical) here rather
 * than inheriting a partial one from the layout. The share image comes from
 * the page's own `opengraph-image.jpg`; a page that has none must say so with
 * `homeShareImage`, because a page-level `openGraph` object does not inherit
 * the root image file.
 */
export function pageMetadata({ title, description, path, homeShareImage = false }: { title: string; description: string; path: Route; homeShareImage?: boolean }): Metadata {
  // Only set when used: even `images: undefined` would switch off the page's own image file.
  const images = homeShareImage ? { images: [HOME_SHARE_IMAGE] } : {};
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, url: path, title, description, ...images },
    twitter: { card: "summary_large_image", title, description, ...images },
  };
}
