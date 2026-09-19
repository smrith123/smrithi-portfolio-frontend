import type { HomeContent, ImageSrc } from "@/types/content";
import { ROUTE_NAMES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES, type Route } from "@/lib/site";

/*
 * Schema.org JSON-LD. Everything here restates what the pages already show:
 * the name, the roles and the MBA come from the site's own copy (hero, About,
 * Career Snapshot, Journey), the image is the hero portrait, and `sameAs` is
 * only filled from SITE_SOCIAL_PROFILES, i.e. accounts confirmed as hers.
 */
const absolute = (path: string) => new URL(path, SITE_URL).href;
const imageUrl = (src: ImageSrc) => absolute(typeof src === "string" ? src : src.src);

const PERSON_ID = absolute("/#person");
const WEBSITE_ID = absolute("/#website");

function person(home: HomeContent) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: absolute("/"),
    image: imageUrl(home.hero.portrait),
    description: SITE_DESCRIPTION,
    jobTitle: "Content Creator & Digital Marketer",
    knowsAbout: ["Digital marketing", "Content creation", "Social media strategy", "Fashion", "Beauty", "Lifestyle"],
    hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "MBA in Digital Marketing" },
    ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
  };
}

/** Home page only: Google reads the site name from WebSite markup on the root URL. */
export function homeGraph(home: HomeContent) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": WEBSITE_ID, url: absolute("/"), name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: "en", publisher: { "@id": PERSON_ID } },
      person(home),
    ],
  };
}

/** The About page is the profile page Google's ProfilePage markup is meant for. */
export function profileGraph(home: HomeContent) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": absolute("/about"), url: absolute("/about"), name: `About ${SITE_NAME}`, isPartOf: { "@id": WEBSITE_ID }, mainEntity: person(home) },
      breadcrumbs("/about"),
    ],
  };
}

/** Home > … > this page, following the URL path. */
export function breadcrumbs(path: Route) {
  const trail: Route[] = ["/"];
  if (path.startsWith("/content/")) trail.push("/content");
  if (path !== "/") trail.push(path);
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((route, i) => ({ "@type": "ListItem", position: i + 1, name: ROUTE_NAMES[route], item: absolute(route) })),
  };
}

export function breadcrumbGraph(path: Route) {
  return { "@context": "https://schema.org", ...breadcrumbs(path) };
}

/** Renders one JSON-LD block; `<` is escaped so no string in the data can close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
