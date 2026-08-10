import { useEffect, useRef, useState } from 'react';
import PreloaderLogoSVG from '@/components/PreloaderLogoSVG';

const STORAGE_KEY = 'hasSeenPreloader';
/** The navigation mark the splash logo flies into. */
const HANDOFF_TARGET_ID = 'site-logo';

/*
 * Entrance timeline. The wheel sets the pace: 7 segments at 150ms apart means
 * the last one starts at 900ms and finishes its 450ms fade at 1350ms. The head
 * assembly is fitted into the same window so both land together, then the whole
 * splash holds briefly before the logo flies up into the navigation.
 */
const SEGMENT_STAGGER_MS = 150;
const SEGMENT_COUNT = 7;
const SEGMENT_FADE_MS = 450;
const ASSEMBLY_MS = (SEGMENT_COUNT - 1) * SEGMENT_STAGGER_MS + SEGMENT_FADE_MS;
const HOLD_MS = 300;
/** Logo flight to the navigation; also the backdrop's fade-out window. */
const FLIGHT_MS = 700;
/** Plain fade used when there is no navigation mark to fly into. */
const FADE_MS = 450;

/** sessionStorage throws in Safari private mode, so every access is guarded. */
const hasSeenPreloader = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};

const markPreloaderSeen = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // A session that cannot persist the flag simply shows the splash again.
  }
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * First-visit splash. Renders only when the session flag is absent, assembles the
 * logo, then hands that same logo off to the navigation: it flies into the
 * header mark's slot while the backdrop clears, and the two swap in one commit
 * so the site simply inherits the logo the splash was holding.
 */
const Preloader = () => {
  const [mounted, setMounted] = useState(() => !hasSeenPreloader());
  const [leaving, setLeaving] = useState(false);
  /** Set when no handoff target exists — falls back to the old fade-and-scale. */
  const [fallbackExit, setFallbackExit] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  // Keeps the navigation mark hidden underneath; the cleanup reveals it in the
  // same commit that unmounts this overlay, so there is no gap between the two.
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.add('preloader-active');
    return () => document.documentElement.classList.remove('preloader-active');
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    /** Measures both marks and drives the splash logo onto the navigation's. */
    const startExit = () => {
      setLeaving(true);

      const node = logoRef.current;
      const target = document.getElementById(HANDOFF_TARGET_ID);
      const from = node?.getBoundingClientRect();
      const to = target?.getBoundingClientRect();

      // No navigation on this route, or a target that has not been laid out.
      if (!node || !from || !to || !to.width || !from.width || prefersReducedMotion()) {
        setFallbackExit(true);
        return;
      }

      const scale = to.width / from.width;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      node.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    };

    const exitAt = ASSEMBLY_MS + HOLD_MS;
    const exitTimer = window.setTimeout(startExit, exitAt);
    const unmountTimer = window.setTimeout(() => {
      markPreloaderSeen();
      setMounted(false);
    }, exitAt + Math.max(FLIGHT_MS, FADE_MS));

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [mounted]);

  // Hold the page still underneath rather than letting it scroll behind the overlay.
  useEffect(() => {
    if (!mounted) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading eqdam.me"
      // Above the z-50 navigation so nothing bleeds through the splash.
      className={`fixed inset-0 z-[60] ${fallbackExit ? 'animate-preloader-out' : ''}`}
    >
      <div
        className={`absolute inset-0 bg-background/95 backdrop-blur-2xl transition-opacity duration-500 ease-out ${
          leaving ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={logoRef}
          className="transition-transform duration-700 will-change-transform [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        >
          <PreloaderLogoSVG
            assemblyMs={ASSEMBLY_MS}
            segmentStaggerMs={SEGMENT_STAGGER_MS}
            className="w-48 sm:w-56 lg:w-64"
          />
        </div>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
};

export default Preloader;
