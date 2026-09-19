import { assets } from "@/content/assets";
import type { HomeContent } from "@/types/content";

/**
 * Home page copy, verbatim from the approved Figma design. Bracketed values
 * ("[xx]k", "[X]", "Lorem Ipsum") are the designer’s placeholders and will be
 * replaced by client content via the admin panel / backend later.
 */
/** The design shows one label and heading on every platform tab. */
const platformHeading = () => ({
  eyebrow: "-Platforms",
  lines: [[{ text: "Platform", accent: true }], [{ text: "Native" }]],
});

export const homeContent: HomeContent = {
  /* Absolute hrefs so the menu works from any route, not just the home page. */
  nav: [
    { label: "Home", href: "/" },
    { label: "About me", href: "/#about" },
    { label: "Social media", href: "/#social" },
    { label: "Content", href: "/content" },
    { label: "Journey", href: "/#journey" },
    { label: "Contact", href: "/#contact" },
  ],

  hero: {
    titleTop: "Content",
    titleMid: "Meets",
    titleBottom: "Strategy",
    subtitle:
      "Where high-fashion editorial aesthetics meet the data-driven pulse of modern marketing. We build digital legacies that convert.",
    primaryCta: { label: "See my work", href: "#content" },
    secondaryCta: { label: "Let’s connect", href: "#contact" },
    portrait: assets.heroPortrait,
    texture: assets.heroTexture,
  },

  about: {
    eyebrow: "-About me",
    statement:
      "I didn’t pick between being a creator and being a strategist. I chose both — and built a career at the exact intersection. MBA in hand, platform instincts sharp, and a genuine love for fashion, beauty, and the kind of storytelling that makes people feel something.",
  },

  contentPortfolio: {
    eyebrow: "-Content portfolio",
    lines: [[{ text: "Work that" }], [{ text: "hits different", accent: true }]],
    pieces: [
      { id: "fashion", number: "01.", label: "-Fashion & Style", image: assets.content[0] },
      { id: "makeup", number: "02.", label: "-Makeup", image: assets.content[1] },
      { id: "lifestyle", number: "03.", label: "-Lifestyle", image: assets.content[2] },
      { id: "strategy", number: "04.", label: "-Strategy", image: assets.content[3] },
      { id: "professional", number: "05.", label: "-Professional", image: assets.content[4] },
    ],
  },

  platforms: {
    items: [
      {
        ...platformHeading(),
        id: "instagram",
        name: "Instagram",
        followers: "[xx]k Followers",
        handle: "@just.lailaaaaaa",
        description:
          "Fashion, lifestyle, and behind-the-scenes creator content. Shot on iPhone and intentionally real.",
        profileUrl: "https://instagram.com/",
        followLabel: "Follow",
        collabUrl: "#contact",
        collabLabel: "Collab enquiry",
        images: assets.platform.map((url) => ({ url })),
      },
      {
        ...platformHeading(),
        id: "tiktok",
        name: "TikTok",
        followers: "[xx]k Followers",
        handle: "@just.lailaaaaaa",
        description:
          "Short-form fashion and beauty edits, trend takes, and get-ready-with-me moments that move fast.",
        profileUrl: "https://tiktok.com/",
        followLabel: "Follow",
        collabUrl: "#contact",
        collabLabel: "Collab enquiry",
        images: [assets.platform[3], assets.platform[0], assets.platform[5], assets.platform[1], assets.platform[4], assets.platform[2]].map((url) => ({ url })),
      },
      {
        ...platformHeading(),
        id: "youtube",
        name: "YouTube",
        followers: "[xx]k Subscribers",
        handle: "@just.lailaaaaaa",
        description:
          "Long-form vlogs, campaign breakdowns, and the strategy behind the content, told in full.",
        profileUrl: "https://youtube.com/",
        followLabel: "Follow",
        collabUrl: "#contact",
        collabLabel: "Collab enquiry",
        images: [assets.platform[2], assets.platform[5], assets.platform[1], assets.platform[4], assets.platform[0], assets.platform[3]].map((url) => ({ url })),
      },
    ],
  },

  journey: {
    eyebrow: "-Professional journey",
    lines: [[{ text: "the" }], [{ text: "glow" }], [{ text: "up" }], [{ text: "timeline", accent: true }]],
    steps: [
      {
        id: "education",
        category: "Education",
        title: "MBA — Digital Marketing",
        description: "Built the strategic and analytical foundation that shapes every campaign and creative decision.",
      },
      {
        id: "marketing",
        category: "Marketing",
        title: "Digital Marketing Specialist",
        description: "Multi-channel campaigns, reporting frameworks, and platform-specific strategy at scale.",
      },
      {
        id: "leadership",
        category: "Leadership",
        title: "Digital Marketing Team Leader",
        description: "Led a team of [X] across content, paid, and social — from brief to performance review.",
      },
      {
        id: "creator",
        category: "Creator",
        title: "Content Creator",
        description: "Launched across IG, TikTok, and YouTube — building community around fashion, beauty, and lifestyle.",
      },
      {
        id: "podcast",
        category: "Podcast",
        title: "Podcast Host & Interviewer",
        description: "A show interviewing marketers and creators at the front edge of digital culture.",
      },
      {
        id: "brand",
        category: "Brand",
        title: "Creator × Strategist",
        description: "Merging creative instinct with strategic depth — for brands, collabs, and consulting.",
      },
    ],
  },

  projects: {
    eyebrow: "-Featured Projects & Campaigns",
    lines: [[{ text: "the work", accent: true }], [{ text: "speak for itself" }]],
    items: [
      {
        id: "project-1",
        title: "Lorem Ipsum",
        description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
        image: assets.project[0],
        tint: "#e8d5b5",
        href: "#",
      },
      {
        id: "project-2",
        title: "Lorem Ipsum",
        description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
        image: assets.project[1],
        tint: "#fe9dd2",
        href: "#",
      },
      {
        id: "project-3",
        title: "Lorem Ipsum",
        description: "Lorem Ipsum has been the industry’s standard dummy text ever since",
        image: assets.project[2],
        tint: "#e5e1da",
        href: "#",
      },
    ],
  },

  brands: {
    eyebrow: "-Collaborations",
    lines: [[{ text: "trusted", accent: true }], [{ text: "brands" }]],
    items: [
      { id: "brand-1", name: "Logoipsum", logo: assets.brand[0], width: 205, height: 41 },
      { id: "brand-2", name: "Logoipsum", logo: assets.brand[1], width: 207, height: 41 },
      { id: "brand-3", name: "Logoipsum", logo: assets.brand[2], width: 175, height: 41 },
    ],
  },

  media: {
    eyebrow: "-Podcast & Media",
    lines: [[{ text: "on the " }, { text: "mic.", accent: true }]],
    items: [
      { id: "media-1", title: "Podcast episode 1", poster: assets.media[0] },
      { id: "media-2", title: "Podcast episode 2", poster: assets.media[1] },
      { id: "media-3", title: "Podcast episode 3", poster: assets.media[2] },
    ],
  },

  career: {
    portrait: assets.careerPortrait,
    cards: [
      {
        id: "mba",
        lines: [[{ text: "MBA in" }], [{ text: "Digital", accent: true }], [{ text: "Marketing", accent: true }]],
        meta: "Duration",
      },
      {
        id: "lead",
        /* Desktop frame: MARKETING black; mobile frame: pink. */
        lines: [
          [{ text: "Digital" }],
          [{ text: "Marketing", accent: "mobile" }],
          [{ text: "Team Leader", accent: true }],
          [{ text: "& Specialist", accent: true }],
        ],
        meta: "Company & Year",
      },
      {
        id: "creator",
        lines: [[{ text: "Strategist &" }], [{ text: "Content", accent: true }], [{ text: "Creator", accent: true }]],
        meta: "Small detail",
      },
    ],
    panel: {
      lines: [[{ text: "Want the" }], [{ text: "Full picture?", accent: true }]],
      description: "Download the full CV or hit the button to start a conversation",
      // ponytail: CV file not supplied yet; backend will serve the real URL
      downloadCta: { label: "Download", href: "#" },
      contactCta: { label: "Get in touch", href: "#contact" },
    },
  },

  contact: {
    eyebrow: "-Contact",
    lines: [[{ text: "let’s" }], [{ text: "build" }], [{ text: "something", accent: true }], [{ text: "iconic" }]],
    description:
      "Brand collab, marketing strategy, content partnership, or just a good conversation about the creator economy - slide into my inbox.",
    instagram: { handle: "@just.lailaaaaaa", url: "https://instagram.com/" },
    email: "just.laila@gmail.com",
    background: assets.contactBackground,
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "Your @gmail.com",
      messageLabel: "Message",
      messagePlaceholder: "Tell me about the project",
      submitLabel: "Submit",
    },
  },
};
