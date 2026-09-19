/*
 * The home page is one long page, and the admin's menu and CTA links point at
 * its sections ("/#about", "#contact"). Three of those sections also have a
 * page of their own; away from the home page a link to one of them opens that
 * page instead of sending the visitor back to the top of the home page. Any
 * other section link resolves to the home page section ("#journey" -> "/#journey").
 * Kept free of server-only code, because the menu uses it too.
 */
const SECTION_PAGES: Record<string, string> = { about: "/about", social: "/social-media", contact: "/contact" };

export function offHomeHref(href: string): string {
  const section = href.match(/^\/?#([\w-]+)$/)?.[1];
  if (!section) return href;
  return SECTION_PAGES[section] ?? `/#${section}`;
}
