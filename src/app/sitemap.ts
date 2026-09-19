import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";

/**
 * Every public page, as absolute canonical URLs (no #section fragments: Google
 * treats those as the same page). No lastmod/changefreq/priority: Google ignores
 * the last two and only trusts lastmod when it is verifiably accurate, which a
 * CMS-driven page without edit timestamps cannot promise. New public routes
 * (e.g. case-study pages) are added to ROUTES in lib/site.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
