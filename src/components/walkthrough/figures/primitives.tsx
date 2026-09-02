import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Maximize2, X } from 'lucide-react';
import type { ShotFrame, ShotRef } from '@/lib/walkthrough';

/**
 * Every figure animates on entry rather than on load, because a deck's figures
 * are almost never on screen when the page mounts. The deck remounts its stage
 * per slide, so "entry" is simply the first frame after mount — which is what
 * `useReveal` reports.
 */
export const useReveal = (delay = 0) => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    // A frame first, so the from-state is committed before the transition runs;
    // anything with a stagger waits out its delay on top of that.
    let timer = 0;
    const frame = requestAnimationFrame(() => {
      timer = window.setTimeout(() => setShown(true), delay);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [delay]);

  return shown;
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts a number up on entry.
 *
 * Deck metrics are not all numbers — "6 to 40+", "Multi-EMR", "~100" — so this
 * animates the leading numeral where there is one and leaves the rest of the
 * string alone. Anything unparseable simply appears.
 */
export const useCountUp = (value: string, duration = 900) => {
  const match = value.match(/^([^\d-]*)(-?[\d\s,.]*\d)(.*)$/s);
  const target = match ? Number(match[2].replace(/[\s,]/g, '')) : NaN;
  const animatable = Boolean(match) && Number.isFinite(target) && !prefersReducedMotion();

  const [current, setCurrent] = useState(animatable ? 0 : target);

  useEffect(() => {
    if (!animatable) return;
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      // Ease-out cubic: fast off the mark, settled at the end.
      setCurrent(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animatable, target, duration]);

  if (!match || !animatable) return value;

  const decimals = (match[2].split('.')[1] ?? '').length;
  const shown = decimals
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString('en-US');

  return `${match[1]}${shown}${match[3]}`;
};

export const Caption = ({ children }: { children?: ReactNode }) =>
  children ? (
    <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
      {children}
    </figcaption>
  ) : null;

/* ------------------------------------------------------------------ lightbox */

interface LightboxValue {
  open: (shot: ShotRef) => void;
}

const LightboxContext = createContext<LightboxValue>({ open: () => {} });

/**
 * A projected screenshot is always too small to read. Every shot is therefore
 * clickable, and opens full-viewport over the deck — which is also how you show
 * an audience the detail they just asked about.
 */
export const LightboxProvider = ({ children }: { children: ReactNode }) => {
  const [shot, setShot] = useState<ShotRef | null>(null);
  const value = useMemo(() => ({ open: setShot }), []);

  useEffect(() => {
    if (!shot) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setShot(null);
      }
    };
    // Capture, so Escape closes the lightbox before the deck sees it.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [shot]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {shot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
          onClick={() => setShot(null)}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4
            bg-foreground/95 p-4 animate-in fade-in duration-200 sm:p-8"
        >
          <img
            src={shot.src}
            alt={shot.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-md object-contain shadow-2xl"
          />
          <p className="max-w-3xl text-center text-sm text-background/80">
            {shot.label ?? shot.alt}
          </p>
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-md p-2 text-background/70 transition-colors
              hover:bg-background/10 hover:text-background focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-background"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      )}
    </LightboxContext.Provider>
  );
};

export const useLightbox = () => useContext(LightboxContext);

/* --------------------------------------------------------------------- frames */

/**
 * Device chrome.
 *
 * Screenshots pulled out of a deck have no edges, so on a white stage they bleed
 * into it and stop reading as artefacts. A frame gives each one a boundary and,
 * more usefully, says what kind of thing you are looking at: a browser tab, a
 * handset, a photograph of paper on a wall.
 */
const FRAME_ASPECT: Record<ShotFrame, string> = {
  browser: 'aspect-[16/10]',
  phone: 'aspect-[9/17]',
  tablet: 'aspect-[4/3]',
  paper: 'aspect-[4/3]',
  plain: 'aspect-[16/10]',
};

const BrowserChrome = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
    <div className="flex items-center gap-1.5 border-b border-border bg-secondary px-3 py-2">
      {['bg-muted-foreground/30', 'bg-muted-foreground/20', 'bg-muted-foreground/20'].map(
        (tone, index) => (
          <span key={index} className={`h-2 w-2 rounded-full ${tone}`} />
        ),
      )}
      <span className="ml-2 h-2 flex-1 rounded-full bg-muted-foreground/10" />
    </div>
    {children}
  </div>
);

const PhoneChrome = ({ children }: { children: ReactNode }) => (
  <div
    className="relative mx-auto overflow-hidden rounded-[1.75rem] border-[6px] border-foreground/85
      bg-foreground/85 shadow-[var(--shadow-hover)]"
  >
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-background/25"
    />
    <div className="overflow-hidden rounded-[1.35rem] bg-card">{children}</div>
  </div>
);

const PaperChrome = ({ children }: { children: ReactNode }) => (
  <div className="rotate-[-0.4deg] rounded-sm border border-border bg-card p-1.5 shadow-[var(--shadow-card)]">
    {children}
  </div>
);

const chromeFor = (frame: ShotFrame) => {
  if (frame === 'browser') return BrowserChrome;
  if (frame === 'phone') return PhoneChrome;
  if (frame === 'paper') return PaperChrome;
  if (frame === 'tablet') return BrowserChrome;
  return ({ children }: { children: ReactNode }) => (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
      {children}
    </div>
  );
};

interface ShotProps {
  shot: ShotRef;
  frame?: ShotFrame;
  fit?: 'contain' | 'cover';
  /** Slow drift across a wide artefact that will not fit legibly on a slide. */
  pan?: boolean;
  /** Stagger index when several shots come in together. */
  index?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * One artefact, framed, revealed, and expandable.
 *
 * `pan` exists for the blueprint-shaped source images: 6,000 pixels wide and
 * two lanes tall. Shrunk to fit they are a texture rather than a diagram, so
 * they drift instead, and the lightbox carries the reading.
 */
export const Shot = ({
  shot,
  frame = 'plain',
  fit = 'contain',
  pan = false,
  index = 0,
  className = '',
  style,
}: ShotProps) => {
  const shown = useReveal(index * 90);
  const { open } = useLightbox();
  const Chrome = chromeFor(frame);

  return (
    <button
      type="button"
      onClick={() => open(shot)}
      title="Open full size"
      style={style}
      className={`group relative block w-full text-left transition-all duration-700 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        } ${className}`}
    >
      <Chrome>
        <div className={`relative overflow-hidden bg-secondary/40 ${FRAME_ASPECT[frame]}`}>
          <img
            src={shot.src}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            className={`h-full w-full ${
              fit === 'cover' ? 'object-cover' : 'object-contain'
            } ${pan ? 'walkthrough-pan' : 'transition-transform duration-700 group-hover:scale-[1.02]'}`}
          />
        </div>
      </Chrome>

      <span
        aria-hidden="true"
        className="absolute right-2 top-2 rounded-md bg-foreground/70 p-1.5 text-background
          opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </span>

      {shot.label && (
        <span className="mt-2 block text-xs font-medium text-muted-foreground">{shot.label}</span>
      )}
    </button>
  );
};

/**
 * Axis and grid ink for the hand-drawn charts.
 *
 * The deck's own charts were Google Sheets exports in six different palettes;
 * redrawing them against the site's tokens is the only way a dozen figures read
 * as one deck. `currentColor` throughout, so a figure inherits its surface.
 */
export const GRID_STROKE = 'hsl(var(--border))';
export const AXIS_TEXT = 'hsl(var(--muted-foreground))';

/** Series colours, in the order a chart should reach for them. */
export const SERIES = [
  'hsl(var(--primary))',
  'hsl(211 60% 72%)',
  'hsl(213 16% 45%)',
  'hsl(190 65% 55%)',
] as const;

/**
 * Frames a figure and its caption, and gives every figure the same maximum
 * height so a slide's text block does not move between slides.
 */
export const FigureFrame = ({
  children,
  caption,
  className = '',
}: {
  children: ReactNode;
  caption?: string;
  className?: string;
}) => (
  <figure className={`flex min-h-0 w-full flex-col justify-center ${className}`}>
    <div className="flex min-h-0 flex-1 flex-col justify-center">{children}</div>
    <Caption>{caption}</Caption>
  </figure>
);
