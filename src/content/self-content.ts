import { assets } from "@/content/assets";
import type { WorkPageContent } from "@/types/content";

/**
 * /content/self-content, from the approved reference (1440 frame): the same
 * 1440 x 620 banner treatment and three-column masonry as Professional Work,
 * with seven cards (col 1: 1, 4, 7 · col 2: 2, 5 · col 3: 3, 6). Sizes follow
 * the supplied assets (400 x 500 tall, 400 x 400 square). Only cards 1-3 have
 * visible titles in the reference; the rest are placeholders to replace.
 */
export const selfContent: WorkPageContent = {
  title: "Self content",
  banner: {
    eyebrow: "-Self content",
    lines: [[{ text: "made by" }], [{ text: "me,", accent: true }], [{ text: "for me" }]],
    image: assets.selfBanner,
    alt: "Smrithi resting her chin on her hands in warm window light",
    cta: { label: "Professional content", href: "/content/professional-work" },
  },
  cards: [
    {
      id: "morning-ritual",
      tag: "YouTube",
      title: ["Morning ritual", "series"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[0],
      alt: "Smrithi in a black blazer looking at the camera",
      size: "tall",
    },
    {
      id: "ootd-style-edits",
      tag: "Instagram / TikTok",
      title: ["OOTD &", "Style edits"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[1],
      alt: "Street-style outfit with a baseball cap and iced coffee outside a café",
      size: "square",
    },
    {
      id: "glow-diary",
      tag: "Reels",
      title: ["Glow diary-", "Beauty series"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[2],
      alt: "Flat lay of makeup products and hair clips",
      size: "tall",
    },
    {
      id: "podcast-sessions",
      tag: "Podcast",
      title: ["Podcast", "sessions"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[3],
      alt: "Studio light against a sheer curtain",
      size: "square",
    },
    {
      id: "coastal-escape",
      tag: "YouTube",
      title: ["Coastal escape", "vlog"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[4],
      alt: "Woman with arms outstretched facing green sea cliffs",
      size: "square",
    },
    {
      id: "airport-diaries",
      tag: "YouTube",
      title: ["Airport diaries-", "Travel series"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[5],
      alt: "Airport departures board",
      size: "tall",
    },
    {
      id: "behind-the-scenes",
      tag: "Reels",
      title: ["Behind the", "scenes"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.self[6],
      alt: "Behind the scenes on a shoot",
      size: "square",
    },
  ],
};
