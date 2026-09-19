import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { ContentSplit } from "@/components/sections/ContentSplit";
import { getContentPageContent, getNav } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { breadcrumbGraph, JsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Content Portfolio | Smrithi",
  description:
    "Smrithi's content portfolio: professional marketing work and campaigns, alongside the fashion, beauty and lifestyle content she makes for herself.",
  path: "/content",
});

export default async function ContentPage() {
  const [content, nav] = await Promise.all([getContentPageContent(), getNav()]);

  return (
    <>
      <JsonLd data={breadcrumbGraph("/content")} />
      <SkipLink />
      <Header nav={nav} variant="bar" back={{ label: "Home", href: "/" }} />
      <main id="main">
        <h1 className="sr-only">{content.title}</h1>
        <ContentSplit panels={content.panels} />
      </main>
    </>
  );
}
