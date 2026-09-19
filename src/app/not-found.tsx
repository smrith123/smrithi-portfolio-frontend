import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { Button } from "@/components/ui/Button";
import { DisplayHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { getNav } from "@/lib/content";

export const metadata: Metadata = { title: "Page not found" };

/** Answers with a real 404 status (Next also adds noindex), so a mistyped URL never looks like a page. */
export default async function NotFound() {
  const nav = await getNav();
  return (
    <>
      <SkipLink />
      <Header nav={nav} />
      <main id="main" className="gutter flex min-h-[70dvh] flex-1 flex-col items-start justify-center gap-6 py-24 lg:gap-8">
        <div className="flex flex-col gap-1 lg:gap-6">
          <Eyebrow>-404</Eyebrow>
          <DisplayHeading as="h1" lines={[[{ text: "Page" }], [{ text: "not found", accent: true }]]} />
        </div>
        <p className="max-w-[506px] font-body text-[15px] leading-[24px] text-black/50 lg:text-body-lg lg:leading-[1.4]">
          This page doesn’t exist or has moved.
        </p>
        <Button href="/" size="sm">
          Back to home
        </Button>
      </main>
      <Footer />
    </>
  );
}
