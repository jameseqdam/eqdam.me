import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Wheel segments lifted verbatim from public/logo-preloader.svg, ordered
 * clockwise so the stagger reads as a sweep around the ring.
 */
const SEGMENTS = [
  { id: 'segment-purple', fill: '#870052', d: 'M393.685 142.713C376.119 85.6319 334.054 39.3379 278.906 16.3965L253.265 78.0506C290.065 93.3633 318.137 124.266 329.865 162.362L393.685 142.713Z' },
  { id: 'segment-indigo', fill: '#4B0082', d: 'M276.163 15.2859C220.691 -6.83735 158.247 -3.12182 105.79 25.4324L137.716 84.0825C172.729 65.0305 214.406 62.5482 251.431 77.3116L276.163 15.2859Z' },
  { id: 'segment-blue', fill: '#0066FF', d: 'M102.32 27.3771C50.4407 56.963 14.4277 108.107 4.05583 166.927L69.8168 178.524C76.7419 139.262 100.774 105.131 135.4 85.3789L102.32 27.3771Z' },
  { id: 'segment-green', fill: '#33CC33', d: 'M3.64088 169.334C-6.0116 228.269 11.0799 288.445 50.259 333.513L100.652 289.709C74.5048 259.625 63.1013 219.462 69.5442 180.121L3.64088 169.334Z' },
  { id: 'segment-yellow', fill: '#FFFF00', d: 'M51.8677 335.344C91.5962 379.942 149.112 404.531 208.802 402.448L206.465 335.711C166.638 337.106 128.246 320.695 101.735 290.923L51.8677 335.344Z' },
  { id: 'segment-orange', fill: '#FF9933', d: 'M211.24 402.345C270.89 399.535 326.2 370.317 362.142 322.616L308.817 282.433C284.824 314.268 247.909 333.766 208.094 335.648L211.24 402.345Z' },
  { id: 'segment-red', fill: '#FF3300', d: 'M365.451 318.102C400.049 269.42 411.179 207.857 395.819 150.148L331.291 167.322C341.541 205.845 334.114 246.926 311.022 279.417L365.451 318.102Z' },
] as const;

const HEAD_ASSET = '/logo-preloader-head.svg';

/** Per-piece travel; matches --piece-duration in index.css. */
const PIECE_DURATION_MS = 400;
/**
 * Pieces land in batches rather than individually. All 72 staggered separately
 * would sit ~13ms apart against a 400ms travel, so ~30 are always mid-flight and
 * the assembly reads as a blur; ~15 groups land visibly one after another inside
 * the same window. Batches follow source order, which is the paint order of the
 * overlapping line art, so each group builds on the ones beneath it.
 */
const BATCH_COUNT = 15;
/** Centre of the 404×404 viewBox: where every piece is stacked before it settles. */
const CANVAS_CENTRE = 202;

interface PreloaderLogoSVGProps {
  /** Milliseconds the whole assembly gets; the piece stagger is fitted into it. */
  assemblyMs: number;
  /** Cadence between wheel segments, mirrored from the caller's timeline. */
  segmentStaggerMs: number;
  className?: string;
}

/**
 * Composites the two logo layers over one shared 404×404 box, so the wheel and
 * the head stay in register while they animate independently.
 *
 * Only the wheel is inlined (~2 KB). The head is 390 KB of path data across 72
 * jigsaw pieces, so it is fetched at runtime and injected — that keeps it out of
 * the JS bundle while still giving every piece a DOM node to animate.
 */
const PreloaderLogoSVG = ({ assemblyMs, segmentStaggerMs, className }: PreloaderLogoSVGProps) => {
  const headRef = useRef<HTMLDivElement>(null);
  const [markup, setMarkup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // First-party static asset, so the injected markup is trusted.
    fetch(HEAD_ASSET)
      .then((response) => (response.ok ? response.text() : Promise.reject(response.status)))
      .then((text) => {
        if (!cancelled) setMarkup(text);
      })
      .catch(() => {
        // A missing head just means the wheel plays alone; never block the splash.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const node = headRef.current;
    if (!node || !markup) return;

    const pieces = node.querySelectorAll<SVGPathElement>('.puzzle-piece');
    if (pieces.length < 2) return;

    // Spread the batches across whatever time is left once the final batch has
    // finished travelling, so the last piece lands exactly on assemblyMs.
    const batchSize = Math.ceil(pieces.length / BATCH_COUNT);
    const batches = Math.ceil(pieces.length / batchSize);
    const window = Math.max(assemblyMs - PIECE_DURATION_MS, 0);
    const stagger = batches > 1 ? window / (batches - 1) : 0;

    node.style.setProperty('--piece-duration', `${PIECE_DURATION_MS}ms`);
    node.style.setProperty('--piece-stagger', `${stagger.toFixed(2)}ms`);

    // Each piece needs its own offset to the canvas centre, so measure the real
    // geometry rather than guessing from the path data.
    pieces.forEach((piece, index) => {
      const box = piece.getBBox();
      const dx = CANVAS_CENTRE - (box.x + box.width / 2);
      const dy = CANVAS_CENTRE - (box.y + box.height / 2);
      piece.style.setProperty('--piece-dx', `${dx.toFixed(2)}px`);
      piece.style.setProperty('--piece-dy', `${dy.toFixed(2)}px`);
      piece.style.setProperty('--piece-batch', String(Math.floor(index / batchSize)));
    });
  }, [assemblyMs, markup]);

  return (
    <div className={cn('relative aspect-square', className)}>
      <div
        ref={headRef}
        // The art is black line work, so invert it if the dark palette is ever enabled.
        className="preloader-head absolute inset-0 dark:invert"
        aria-hidden="true"
        dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
      />

      <svg
        id="color-wheel"
        viewBox="0 0 404 404"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full origin-center animate-wheel-spin motion-reduce:animate-none"
      >
        {SEGMENTS.map((segment, index) => (
          <path
            key={segment.id}
            id={segment.id}
            className="color-segment animate-segment-sweep motion-reduce:animate-none"
            d={segment.d}
            fill={segment.fill}
            fillRule="evenodd"
            clipRule="evenodd"
            stroke="white"
            strokeWidth="1.51783"
            strokeMiterlimit="10"
            style={{ animationDelay: `${index * segmentStaggerMs}ms` }}
          />
        ))}
      </svg>
    </div>
  );
};

export default PreloaderLogoSVG;
