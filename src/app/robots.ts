import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everything public is crawlable, including /_next assets (CSS, JS, images),
 * which Google needs to render the pages. /api/ is reserved for route handlers.
 * The admin panel and the backend API run on their own origins and carry their
 * own robots.txt / noindex, since a rule here cannot cover another host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
