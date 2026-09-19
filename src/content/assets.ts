/**
 * Single map from semantic asset names to the files the client supplied.
 * Static imports give next/image intrinsic sizes + blur placeholders.
 * When media moves to the backend/CDN, only this file (and its types) changes.
 */
import heroPortrait from "../../public/assets/912849DA-8C83-4B9C-9A28-CB4292CA6340 1.png";
import heroTexture from "../../public/assets/image 20 (2).png";

import content01 from "../../public/assets/smirthi-100.jpg";
import content02 from "../../public/assets/smrithi-102.jpg";
import content03 from "../../public/assets/smrithi-105.jpg";
import content04 from "../../public/assets/smrithi-106.jpg";
import content05 from "../../public/assets/smrithi-109.jpg";

import platform01 from "../../public/assets/image 26.png";
import platform02 from "../../public/assets/image 28.png";
import platform03 from "../../public/assets/image 30.png";
import platform04 from "../../public/assets/image 29.png";
import platform05 from "../../public/assets/image 27.png";
import platform06 from "../../public/assets/image 31.png";

import project01 from "../../public/assets/Mask group (3).png";
import project02 from "../../public/assets/Mask group (1).png";
import project03 from "../../public/assets/Mask group (2).png";

import brand01 from "../../public/assets/Vector.png";
import brand02 from "../../public/assets/logo.png";
import brand03 from "../../public/assets/Vector (2).png";

import media01 from "../../public/assets/image 40 (1).png";
import media02 from "../../public/assets/Frame 73 (1).png";
import media03 from "../../public/assets/image 84.png";

import careerPortrait from "../../public/assets/3EB00A70-DDE1-4D04-B922-DC366A8742C4 5.png";
import contactBackground from "../../public/assets/image 47 (1).png";

import contentProfessional from "../../public/assets/image 69.png";
import contentSelf from "../../public/assets/683922ED-17FC-49B9-AF05-1AD78C37EE79 3.png";

import workBanner from "../../public/assets/image 70.png";
import work01 from "../../public/assets/image 80.png";
import work02 from "../../public/assets/image 78 (1).png";
import work03 from "../../public/assets/image 27.png";
import work04 from "../../public/assets/image 81 (2).png";
import work05 from "../../public/assets/image 79.png";
import work06 from "../../public/assets/image 77 (1).png";

import selfBanner from "../../public/assets/683922ED-17FC-49B9-AF05-1AD78C37EE79 5 (1).png";
import self01 from "../../public/assets/21BAC758-7BEB-4032-A811-7F18991E55E5 2.png";
import self02 from "../../public/assets/image 73.png";
import self03 from "../../public/assets/21BAC758-7BEB-4032-A811-7F18991E55E5 2 (1).png";
import self04 from "../../public/assets/image 74.png";
import self05 from "../../public/assets/image 76.png";
import self06 from "../../public/assets/image 72.png";
import self07 from "../../public/assets/image 75.png";

export const assets = {
  heroPortrait,
  heroTexture,
  content: [content01, content02, content03, content04, content05],
  platform: [platform01, platform02, platform03, platform04, platform05, platform06],
  project: [project01, project02, project03],
  brand: [brand01, brand02, brand03],
  media: [media01, media02, media03],
  careerPortrait,
  contactBackground,
  contentProfessional,
  contentSelf,
  workBanner,
  work: [work01, work02, work03, work04, work05, work06],
  selfBanner,
  self: [self01, self02, self03, self04, self05, self06, self07],
} as const;

/** Vector assets exported from the Figma file (icons, torn-paper edges, masks). */
export const vectors = {
  arrowSmall: "/assets/figma/icon.svg",
  arrowSmallPink: "/assets/figma/icon1.svg",
  arrowUpRight: "/assets/figma/arrow-up-right.svg",
  arrowUpRightWhite: "/assets/figma/arrow-up-right1.svg",
  arrowUpRightLarge: "/assets/figma/arrow-up-right2.svg",
  arrowUpRightSubmit: "/assets/figma/arrow-up-right3.svg",
  caretRight: "/assets/figma/caret-right.svg",
  pauseLarge: "/assets/figma/pause.svg",
  pauseSmall: "/assets/figma/pause1.svg",
  speakerMuted: "/assets/figma/speaker-simple-slash.svg",
  download: "/assets/figma/storage-download.svg",
  mail: "/assets/figma/mail.svg",
  mailLarge: "/assets/figma/mail1.svg",
  instagram: "/assets/figma/instagram.svg",
  heroGlow: "/assets/figma/group28.svg",
  /* Mobile frame (864:625) exports: 16px arrows used by the full-width buttons. */
  arrowUpRightWhiteSm: "/assets/figma/m-arrow-icon.svg",
  arrowUpRightPinkSm: "/assets/figma/m-arrow-icon1.svg",
  /* /content page header (473:455): ic:round-arrow-back-ios, 32px. */
  arrowBack: "/assets/figma/arrow-back.svg",
  careerTornEdge: "/assets/figma/group43.svg",
  footerTornEdge: "/assets/figma/group47.svg",
} as const;
