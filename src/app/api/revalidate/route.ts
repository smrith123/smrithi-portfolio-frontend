import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";

/**
 * Called by the backend after every admin save. `expire: 0` means the next
 * request for any page renders fresh content instead of serving the cached copy
 * once more (the default, stale-while-revalidate, is what made an edit need two
 * refreshes). Pages re-render as they are visited, not all at once.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const sent = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!secret || !matches(sent, secret)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}

/** Constant-time compare; the digests also make both sides equal length. */
const matches = (a: string, b: string) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
