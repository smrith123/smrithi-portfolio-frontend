import type { ContactInput } from "@/types/content";

/**
 * Origin of smrithi-portfolio-backend, WITHOUT /api (e.g. https://smrithi-api.onrender.com).
 * A trailing slash or a trailing /api is tolerated. Empty falls back to the bundled content.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "").replace(/\/api$/, "");

export async function submitContact(input: ContactInput): Promise<void> {
  if (!API_URL) {
    // Without an API a message would be lost, so production says so instead of pretending.
    if (process.env.NODE_ENV === "production") throw new Error("Contact form is not connected to the API");
    await new Promise((r) => setTimeout(r, 600)); // development: simulate latency so the pending state is real
    return;
  }
  const res = await fetch(`${API_URL}/api/public/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Contact submission failed (${res.status})`);
}
