import { assets } from "@/content/assets";
import type { ContentPageContent } from "@/types/content";

/**
 * /content split page, from the Figma frame "Desktop - 9" (473:422).
 */
export const contentPageContent: ContentPageContent = {
  title: "Content",
  panels: [
    {
      id: "professional-work",
      lines: [[{ text: "professional", accent: true }], [{ text: "work" }]],
      image: assets.contentProfessional,
      alt: "Model in a grey turtleneck against a graffiti wall",
      href: "/content/professional-work",
    },
    {
      id: "self-content",
      lines: [[{ text: "self", accent: true }], [{ text: "content" }]],
      image: assets.contentSelf,
      alt: "Smrithi resting her chin on her hands in warm window light",
      href: "/content/self-content",
    },
  ],
};
