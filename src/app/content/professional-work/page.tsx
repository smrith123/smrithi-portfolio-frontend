import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { WorkBanner } from "@/components/sections/WorkBanner";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { getNav, getProfessionalWorkContent } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { breadcrumbGraph, JsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Professional Work: Brand Strategy & Campaigns | Smrithi",
  description:
    "Team leadership, beauty and fashion campaigns, a social-first brand relaunch and podcast growth: highlights from Smrithi's digital marketing career.",
  path: "/content/professional-work",
});

export default async function ProfessionalWorkPage() {
  const [content, nav] = await Promise.all([getProfessionalWorkContent(), getNav()]);

  return (
    <>
      <JsonLd data={breadcrumbGraph("/content/professional-work")} />
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
