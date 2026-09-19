import { vectors } from "@/content/assets";

/** Torn-paper pink band that closes the page (Figma "Group 47"). */
export function Footer() {
  return (
    <footer className="-mt-px w-full bg-cream">
      {/* eslint-disable-next-line @next/next/no-img-element -- exact vector from the design */}
      <img src={vectors.footerTornEdge} alt="" aria-hidden width={1440} height={120} loading="lazy" className="block h-auto w-full" />
      {/* The mobile frame's band is 60px at 390 wide; the 1440 vector renders 32px there, so pad the rest in solid pink. */}
      <div aria-hidden className="h-7 bg-pink md:hidden" />
    </footer>
  );
}
