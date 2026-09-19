import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

/*
 * NEXT_PUBLIC_API_URL is baked in at build time. On Vercel, a build without it
 * (or with a localhost value) would ship a site that silently shows the bundled
 * copy and cannot send contact messages, so it fails here instead.
 */
function assertApiUrl(phase: string) {
  if (phase !== PHASE_PRODUCTION_BUILD || !process.env.VERCEL) return;
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || /localhost|127\.0\.0\.1/.test(url)) throw new Error("NEXT_PUBLIC_API_URL must be the deployed API origin (see .env.example).");
}

export default function config(phase: string): NextConfig {
  assertApiUrl(phase);
  return {
    images: {
      // Only the client's own Cloudinary cloud: otherwise anyone could run other accounts' images through this site's optimizer quota.
      remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/xpkfxmgn/**" }],
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ],
        },
      ];
    },
  };
}
