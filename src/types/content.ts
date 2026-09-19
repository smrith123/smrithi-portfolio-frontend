import type { StaticImageData } from "next/image";

/** Local static import today; a CDN URL once the backend serves media. */
export type ImageSrc = StaticImageData | string;

export interface Cta {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

/**
 * One line of a display heading; a line can mix default and accent (pink) runs.
 * `accent: "mobile"` is pink below lg only (the mobile and desktop frames differ).
 */
export type HeadingPart = { text: string; accent?: boolean | "mobile" };
export type HeadingLine = HeadingPart[];

export interface SectionHeading {
  eyebrow: string;
  lines: HeadingLine[];
}

export interface HeroContent {
  titleTop: string;
  titleMid: string;
  titleBottom: string;
  subtitle: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  portrait: ImageSrc;
  texture: ImageSrc;
}

export interface AboutContent {
  eyebrow: string;
  statement: string;
}

export interface ContentPiece {
  id: string;
  number: string;
  label: string;
  image: ImageSrc;
  href?: string;
}

export type PlatformId = "instagram" | "tiktok" | "youtube";

/** A photo in a platform grid, optionally linking to the post it came from. */
export interface PlatformImage {
  url: ImageSrc;
  link?: string;
  alt?: string;
}

/** Each platform has its own small label and heading, shown above the tabs while its tab is open. */
export interface Platform extends SectionHeading {
  id: PlatformId;
  name: string;
  followers: string;
  handle: string;
  description: string;
  profileUrl: string;
  followLabel: string;
  collabUrl: string;
  collabLabel: string;
  images: PlatformImage[];
}

export interface JourneyStep {
  id: string;
  category: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: ImageSrc;
  /** Card background colour from the design (each card has its own). */
  tint: string;
  href?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: ImageSrc;
  width: number;
  height: number;
}

export interface MediaItem {
  id: string;
  title: string;
  poster: ImageSrc;
  /** Absent until real podcast videos are supplied. */
  videoSrc?: string;
}

export interface CareerCard {
  id: string;
  lines: HeadingLine[];
  meta: string;
}

export interface CareerContent {
  cards: CareerCard[];
  portrait: ImageSrc;
  panel: {
    lines: HeadingLine[];
    description: string;
    downloadCta: Cta;
    contactCta: Cta;
  };
}

export interface ContactContent extends SectionHeading {
  description: string;
  instagram: { handle: string; url: string };
  email: string;
  background: ImageSrc;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
}

export interface HomeContent {
  nav: NavLink[];
  hero: HeroContent;
  about: AboutContent;
  contentPortfolio: SectionHeading & { pieces: ContentPiece[] };
  platforms: { items: Platform[] };
  journey: SectionHeading & { steps: JourneyStep[] };
  projects: SectionHeading & { items: Project[] };
  brands: SectionHeading & { items: Brand[] };
  media: SectionHeading & { items: MediaItem[] };
  career: CareerContent;
  contact: ContactContent;
}

/** One half of the /content split page. */
export interface ContentPanel {
  id: string;
  lines: HeadingLine[];
  image: ImageSrc;
  alt: string;
  href: string;
}

export interface ContentPageContent {
  title: string;
  panels: ContentPanel[];
}

/** /content/professional-work: masonry card, 400x500 ("tall") or 400x400 ("square") on the 1440 frame. */
export type WorkCardSize = "tall" | "square";

export interface WorkCard {
  id: string;
  tag: string;
  /** Explicit lines so the title breaks where the design breaks it. */
  title: string[];
  description?: string;
  image: ImageSrc;
  alt: string;
  size: WorkCardSize;
  href?: string;
}

export interface WorkBannerContent extends SectionHeading {
  image: ImageSrc;
  alt: string;
  cta: Cta;
}

/** Shape shared by /content/professional-work and /content/self-content. */
export interface WorkPageContent {
  title: string;
  banner: WorkBannerContent;
  cards: WorkCard[];
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}
