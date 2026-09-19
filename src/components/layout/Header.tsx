"use client";

/* eslint-disable @next/next/no-img-element -- icon vector exported from the design */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { vectors } from "@/content/assets";
import { cn } from "@/lib/cn";
import { offHomeHref } from "@/lib/links";
import { useReducedMotion } from "@/lib/useMediaQuery";
import type { NavLink } from "@/types/content";

/*
 * The menu's enter/exit motion is plain CSS (`.menu-*` in globals.css) with the
 * same durations, curves and stagger it had under motion's AnimatePresence. The
 * header is on every route, and this was the only motion code on the /content
 * pages, so those pages no longer download the animation library at all.
 *
 * The menu is always in the HTML, `hidden` while closed, so its links are the
 * site navigation search engines can follow (Google never clicks the button).
 * Showing it again restarts the CSS enter animations.
 */
type Phase = "closed" | "open" | "closing";
/* Longest exit: the backdrop's 0.3s fade after a 0.15s delay. */
const EXIT_MS = 450;

type HeaderProps = {
  nav: NavLink[];
  /**
   * "floating": the bare hamburger over the page (home).
   * "bar": the pill from the /content frame (485:202) with a back link and the toggle.
   */
  variant?: "floating" | "bar";
  back?: { label: string; href: string };
};

export function Header({ nav, variant = "floating", back }: HeaderProps) {
  // On the home page section links scroll in place; elsewhere About, Social media and Contact open their own pages.
  const links = usePathname() === "/" ? nav : nav.map((link) => ({ ...link, href: offHomeHref(link.href) }));
  const [phase, setPhase] = useState<Phase>("closed");
  const open = phase === "open";
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef(0);

  // Keep the overlay mounted while its exit plays, then unmount it.
  const close = useCallback(() => {
    setPhase("closing");
    toggleRef.current?.focus();
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => setPhase("closed"), reduce ? 0 : EXIT_MS);
  }, [reduce]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  /* The menu carries its own centred close button, so the trigger steps aside while open. */
  const toggle = (
    <button
      ref={toggleRef}
      type="button"
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label="Open menu"
      onClick={() => {
        window.clearTimeout(exitTimer.current);
        setPhase("open");
      }}
      className={cn(
        "flex touch-manipulation items-center justify-center transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
        variant === "bar"
          ? "size-6 text-white md:size-11"
          : /* Mobile frame: 24px glyph at (right 20, top 50); desktop frame: 44px at (right 108, top 60). */
            "fixed top-[50px] right-5 z-50 size-6 text-white mix-blend-difference md:top-[clamp(20px,4.2vw,60px)] md:right-[clamp(20px,7.5vw,108px)] md:size-11",
        open && "pointer-events-none opacity-0",
      )}
    >
      <MenuIcon />
    </button>
  );

  return (
    <header>
      {variant === "bar" ? (
        <div
          className={cn(
            "fixed inset-x-0 top-4 z-50 flex justify-center px-5 transition-opacity duration-200 md:top-[38px] md:px-[clamp(20px,9vw,130px)]",
            open && "pointer-events-none opacity-0",
          )}
        >
          <div className="flex w-full max-w-[1178px] items-center justify-between rounded-[40px] bg-pink/25 px-4 py-2 md:px-6">
            {back && (
              <Link
                href={back.href}
                className="flex items-center gap-2 font-body font-light text-[16px] text-white transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:gap-2.5 md:text-[24px]"
              >
                <img src={vectors.arrowBack} alt="" width={32} height={32} className="size-6 md:size-8" />
                {back.label}
              </Link>
            )}
            {toggle}
          </div>
        </div>
      ) : (
        toggle
      )}

      <MenuOverlay nav={links} phase={phase} onClose={close} />
    </header>
  );
}

/**
 * Reference: an inset pink card over the dimmed page, close glyph centred at
 * the top, links stacked beneath it, the whole group centred vertically.
 */
function MenuOverlay({ nav, phase, onClose }: { nav: NavLink[]; phase: Phase; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (phase === "open") closeRef.current?.focus();
  }, [phase]);

  // Modal dialog: Tab and Shift+Tab cycle inside it instead of reaching the page behind.
  const trapFocus = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      hidden={phase === "closed"}
      data-closing={phase === "closing" || undefined}
      onKeyDown={trapFocus}
      className="menu-overlay fixed inset-0 z-40 p-2"
    >
      <div aria-hidden className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="menu-card relative flex h-full w-full flex-col items-center justify-center gap-[clamp(18px,3vw,44px)] overflow-y-auto overscroll-contain rounded-[min(2vw,40px)] bg-pink-light">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-11 touch-manipulation items-center justify-center text-black transition-transform duration-200 hover:rotate-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <CloseIcon />
        </button>

        <nav>
          <ul className="flex flex-col items-center gap-[clamp(18px,3vw,44px)]">
            {nav.map((link, i) => (
              <li key={link.href} className="menu-link" style={{ "--i": i } as CSSProperties}>
                <ScrambleLink href={link.href} onClick={onClose}>
                  {link.label}
                </ScrambleLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_MS = 480;

/** Nav link whose letters shuffle and settle left-to-right on hover/focus. */
function ScrambleLink({ href, children, onClick }: { href: string; children: string; onClick: () => void }) {
  const [shown, setShown] = useState(children);
  const raf = useRef(0);
  const reduce = useReducedMotion();

  const scramble = useCallback(() => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SCRAMBLE_MS);
      const settled = Math.floor(t * children.length);
      setShown(
        Array.from(children, (ch, i) =>
          ch === " " || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        ).join(""),
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setShown(children);
    };
    raf.current = requestAnimationFrame(tick);
  }, [children, reduce]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={scramble}
      onFocus={scramble}
      aria-label={children}
      /* Weight 600 resolves to the Black cut, keeping the approved menu render; the Figma menu is not weight-specified. */
      className="block touch-manipulation font-display font-semibold uppercase text-pink text-[clamp(22px,2.6vw,38px)] leading-none transition-opacity duration-200 hover:opacity-80 focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-8 focus-visible:outline-none"
    >
      {/* Fixed-width glyph cell so the shuffle never shifts the centred layout. */}
      <span aria-hidden className="inline-block text-center" style={{ minWidth: `${children.length}ch` }}>
        {shown}
      </span>
    </Link>
  );
}

/* heroicons-solid:menu-alt-3, as exported from the Figma file (inlined so it can take currentColor). */
function MenuIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden className="size-full">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.6 11C6.6 10.4165 6.83178 9.85695 7.24436 9.44437C7.65694 9.03179 8.21652 8.8 8.8 8.8H35.2C35.7835 8.8 36.3431 9.03179 36.7556 9.44437C37.1682 9.85695 37.4 10.4165 37.4 11C37.4 11.5835 37.1682 12.1431 36.7556 12.5556C36.3431 12.9682 35.7835 13.2 35.2 13.2H8.8C8.21652 13.2 7.65694 12.9682 7.24436 12.5556C6.83178 12.1431 6.6 11.5835 6.6 11ZM6.6 22C6.6 21.4165 6.83178 20.8569 7.24436 20.4444C7.65694 20.0318 8.21652 19.8 8.8 19.8H35.2C35.7835 19.8 36.3431 20.0318 36.7556 20.4444C37.1682 20.8569 37.4 21.4165 37.4 22C37.4 22.5835 37.1682 23.1431 36.7556 23.5556C36.3431 23.9682 35.7835 24.2 35.2 24.2H8.8C8.21652 24.2 7.65694 23.9682 7.24436 23.5556C6.83178 23.1431 6.6 22.5835 6.6 22ZM19.8 33C19.8 32.4165 20.0318 31.8569 20.4444 31.4444C20.8569 31.0318 21.4165 30.8 22 30.8H35.2C35.7835 30.8 36.3431 31.0318 36.7556 31.4444C37.1682 31.8569 37.4 32.4165 37.4 33C37.4 33.5835 37.1682 34.1431 36.7556 34.5556C36.3431 34.9682 35.7835 35.2 35.2 35.2H22C21.4165 35.2 20.8569 34.9682 20.4444 34.5556C20.0318 34.1431 19.8 33.5835 19.8 33Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Thin X, proportioned like the reference (~2vw glyph, light stroke). */
function CloseIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="size-[clamp(24px,2vw,40px)]">
      <path d="M8 8L32 32M32 8L8 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
