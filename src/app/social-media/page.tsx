import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { Platforms } from "@/components/sections/Platforms";
import { getHomeContent } from "@/lib/content";
import { offHomeHref } from "@/lib/links";
import { pageMetadata } from "@/lib/site";
import { breadcrumbGraph, JsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Smrithi on Instagram, TikTok & YouTube",
  description:
    "Fashion, lifestyle and behind-the-scenes content on Instagram, fashion and beauty edits on TikTok, and long-form vlogs and campaign breakdowns on YouTube.",
  path: "/social-media",
  homeShareImage: true,
});

/** The home page's Platforms section on its own; "Collab enquiry" opens the contact page. */
export default async function SocialMediaPage() {
  const c = await getHomeContent();
  const items = c.platforms.items.map((platform) => ({ ...platform, collabUrl: offHomeHref(platform.collabUrl) }));

  return (
    <>
      <JsonLd data={breadcrumbGraph("/social-media")} />
      <SkipLink />
      <Header nav={c.nav} />
      <main id="main" className="pb-[clamp(64px,8.3vw,120px)]">
        <h1 className="sr-only">Smrithi on social media</h1>
        <Platforms items={items} />
      </main>
      <Footer />
    </>
  );
}
