import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { About } from "@/components/sections/About";
import { CareerSnapshot } from "@/components/sections/CareerSnapshot";
import { Journey } from "@/components/sections/Journey";
import { getHomeContent } from "@/lib/content";
import { offHomeHref } from "@/lib/links";
import { pageMetadata } from "@/lib/site";
import { JsonLd, profileGraph } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "About Smrithi | MBA, Digital Marketing & Content Creation",
  description:
    "From an MBA in digital marketing to leading a digital marketing team and creating her own content: Smrithi's professional journey.",
  path: "/about",
  homeShareImage: true,
});

/**
 * The home page's About, Journey and Career Snapshot sections on a page of
 * their own, unchanged. Only the panel's "#contact" link is pointed at the
 * contact page, since this page has no contact section to scroll to.
 */
export default async function AboutPage() {
  const c = await getHomeContent();
  const contactCta = { ...c.career.panel.contactCta, href: offHomeHref(c.career.panel.contactCta.href) };
  const career = { ...c.career, panel: { ...c.career.panel, contactCta } };

  return (
    <>
      <JsonLd data={profileGraph(c)} />
      <SkipLink />
      <Header nav={c.nav} />
      <main id="main">
        <h1 className="sr-only">About Smrithi</h1>
        <About about={c.about} />
        <Journey {...c.journey} />
        <CareerSnapshot career={career} />
      </main>
      <Footer />
    </>
  );
}
