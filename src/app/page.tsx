import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { About } from "@/components/sections/About";
import { Brands } from "@/components/sections/Brands";
import { CareerSnapshot } from "@/components/sections/CareerSnapshot";
import { Contact } from "@/components/sections/Contact";
import { ContentStack } from "@/components/sections/ContentStack";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Media } from "@/components/sections/Media";
import { Platforms } from "@/components/sections/Platforms";
import { Projects } from "@/components/sections/Projects";
import { getHomeContent } from "@/lib/content";
import { pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import { homeGraph, JsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" });

export default async function Home() {
  const c = await getHomeContent();

  return (
    <>
      <JsonLd data={homeGraph(c)} />
      <SkipLink />
      <Header nav={c.nav} />
      <main id="main">
        <Hero hero={c.hero} />
        <About about={c.about} />
        <ContentStack {...c.contentPortfolio} />
        <Platforms {...c.platforms} />
        <Journey {...c.journey} />
        {/* Shown unless hidden in the admin panel (Show / Hide on each of these three). */}
        {c.projects.visible !== false && <Projects {...c.projects} />}
        {c.brands.visible !== false && <Brands {...c.brands} />}
        {c.media.visible !== false && <Media {...c.media} />}
        <CareerSnapshot career={c.career} />
        <Contact contact={c.contact} />
      </main>
      <Footer />
    </>
  );
}
