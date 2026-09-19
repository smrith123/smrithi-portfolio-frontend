import { assets } from "@/content/assets";
import type { WorkPageContent } from "@/types/content";

/**
 * /content/professional-work, from the approved reference (1440 frame):
 * a 1440 x 620 banner and six masonry cards in three columns, ordered
 * left-to-right then down (col 1: cards 1 & 4, col 2: 2 & 5, col 3: 3 & 6).
 * Descriptions are the design's placeholder copy. Card hrefs are absent
 * until case-study pages exist; the design's "STARTEGY" tag is spelled out.
 */
export const professionalWorkContent: WorkPageContent = {
  title: "Professional work",
  banner: {
    eyebrow: "-professional work",
    lines: [[{ text: "brand" }], [{ text: "strategy", accent: true }], [{ text: "results" }]],
    image: assets.workBanner,
    alt: "Model in a grey turtleneck against a graffiti wall with autumn posters",
    cta: { label: "Self content", href: "/content#self-content" },
  },
  cards: [
    {
      id: "team-leadership",
      tag: "Team management",
      title: ["Team leadership-", "Marketing Dept"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.work[0],
      alt: "Speaker addressing a full auditorium",
      size: "tall",
    },
    {
      id: "beauty-culture",
      tag: "Campaign",
      title: ["Beauty culture", "campaign"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.work[1],
      alt: "Smiling woman surrounded by hairstyling tools",
      size: "square",
    },
    {
      id: "fashion-editorial",
      tag: "Campaign",
      title: ["Fashion editorial", "campaign"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.work[2],
      alt: "Black and white portrait in a white dress under a spotlight",
      size: "tall",
    },
    {
      id: "podcast-growth-press",
      tag: "Brand strategy",
      title: ["Podcast", "Growth initiative"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.work[3],
      alt: "Woman reading a newspaper at a café table",
      size: "square",
    },
    {
      id: "podcast-growth-studio",
      tag: "Brand strategy",
      title: ["Podcast", "Growth initiative"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.work[4],
      alt: "Two chairs and microphones in a podcast studio",
      size: "square",
    },
    {
      id: "brand-relaunch",
      tag: "Brand campaign",
      title: ["Brand relaunch", "social first"],
      description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
      image: assets.work[5],
      alt: "Two people working at a laptop over coffee",
      size: "tall",
    },
  ],
};
