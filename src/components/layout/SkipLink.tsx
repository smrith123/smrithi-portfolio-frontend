/** First focusable element on every page: jumps keyboard users past the header to <main id="main">. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-pink focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>
  );
}
