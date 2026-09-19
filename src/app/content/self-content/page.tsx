import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { WorkBanner } from "@/components/sections/WorkBanner";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { getNav, getSelfContent } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { breadcrumbGraph, JsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Self Content: Fashion, Beauty & Lifestyle | Smrithi",
  description:
    "Morning rituals, style edits, beauty diaries and travel vlogs: the fashion, beauty and lifestyle content Smrithi makes for YouTube, Instagram and TikTok.",
  path: "/content/self-content",
});

export default async function SelfContentPage() {
  const [content, nav] = await Promise.all([getSelfContent(), getNav()]);

  return (
    <>
      <JsonLd data={breadcrumbGraph("/content/self-content")} />
      <SkipLink />
      <Header nav={nav} variant="bar" back={{ label: "Home", href: "/" }} />
      <main id="main">
        <h1 className="sr-only">{content.title}</h1>
        <WorkBanner banner={content.banner} />
        <WorkGrid cards={content.cards} />
      </main>
    </>
  );
}
