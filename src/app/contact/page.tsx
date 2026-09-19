import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { Contact } from "@/components/sections/Contact";
import { getHomeContent } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { breadcrumbGraph, JsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Contact & Brand Collaborations | Smrithi",
  description:
    "Brand collaborations, marketing strategy, content partnerships or a good conversation about the creator economy: get in touch with Smrithi.",
  path: "/contact",
  homeShareImage: true,
});

/** The home page's Contact section on its own. */
export default async function ContactPage() {
  const c = await getHomeContent();

  return (
    <>
      <JsonLd data={breadcrumbGraph("/contact")} />
      <SkipLink />
      <Header nav={c.nav} />
      <main id="main">
        <h1 className="sr-only">Contact Smrithi</h1>
        <Contact contact={c.contact} />
      </main>
      <Footer />
    </>
  );
}
