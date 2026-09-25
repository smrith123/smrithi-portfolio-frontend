import { cache } from "react";
import { contentPageContent } from "@/content/content-page";
import { homeContent } from "@/content/home";
import { professionalWorkContent } from "@/content/professional-work";
import { selfContent } from "@/content/self-content";
import { API_URL } from "@/lib/api";
import type { ContentPageContent, HomeContent, NavLink, WorkPageContent } from "@/types/content";

/**
 * The one seam between the UI and its data. Sections receive plain props, so
 * swapping the static files for the backend never touched a component.
 *
 * Pages stay statically rendered. Every fetch is tagged CONTENT_TAG, and the
 * backend calls /api/revalidate after each admin save, which expires the tag so
 * the next visit renders fresh content. The 10-second timer is only a safety net
 * for changes that bypass the admin (scripts) or a webhook that failed.
 */
const REVALIDATE_SECONDS = 10;

/** Cache tag on every content fetch; expired by /api/revalidate. */
export const CONTENT_TAG = "content";

/**
 * An API that accepts the connection but never answers would otherwise hold a
 * render for Node's 300-second default. 30s (not less) because a sleeping
 * Render instance takes up to about a minute to wake: a shorter timeout during
 * a Vercel build would bake the bundled seed copy into the pages. It stays
 * under Next's 60s per-page build limit.
 *
 * ponytail: Next drops this signal when it revalidates a *stale* cached
 * response in the foreground (a rebuild with a warm `.next/cache`), and then
 * waits on that request itself, so a hung API during such a rebuild is bounded
 * only by Next's 60s page timeout and retries (~90s measured). Capping the wait
 * in this function does not help, since Next still awaits its own request.
 */
const API_TIMEOUT_MS = 30_000;

/**
 * What happens when the API is down depends on when:
 * - During `next build` and in development the bundled content stands in, so a
 *   build never fails and the site still shows the approved design.
 * - On the running production server the error is rethrown. A background
 *   revalidation that throws keeps the last successfully generated page in the
 *   cache, so a brief API outage never swaps the client's edited copy for the
 *   bundled seed copy.
 */
const useFallbackOnError =
  process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV !== "production";

/*
 * React's cache() shares one request per path across a render pass (layout,
 * metadata and page). The timeout signal opts fetch out of Next's own
 * memoization, so this is what keeps the sub-pages' nav lookup to one call.
 */
const fromApi = cache(async <T,>(path: string, fallback: T): Promise<T> => {
  if (!API_URL) return fallback;
  try {
    const res = await fetch(`${API_URL}/api/public/${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (error) {
    if (!useFallbackOnError) throw error;
    console.error(`[content] falling back to bundled content for "${path}":`, error);
    return fallback;
  }
});

export async function getHomeContent(): Promise<HomeContent> {
  return fromApi("home", homeContent);
}

export async function getContentPageContent(): Promise<ContentPageContent> {
  return fromApi("content-page", contentPageContent);
}

export async function getProfessionalWorkContent(): Promise<WorkPageContent> {
  return fromApi("works/professional-work", professionalWorkContent);
}

export async function getSelfContent(): Promise<WorkPageContent> {
  return fromApi("works/self-content", selfContent);
}

export async function getNav(): Promise<NavLink[]> {
  return (await getHomeContent()).nav;
}
