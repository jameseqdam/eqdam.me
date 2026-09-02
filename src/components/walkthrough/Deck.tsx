import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  LayoutGrid,
  Maximize,
  Minimize,
  NotebookPen,
  Rows3,
  X,
} from 'lucide-react';
import type { Walkthrough } from '@/lib/walkthrough';
import { LightboxProvider } from './figures/primitives';
import { SlideView } from './SlideView';

const SWIPE_THRESHOLD = 48;

/** Slide numbering skips the bookends, so "03" means the third argument. */
const ordinals = (deck: Walkthrough) => {
  let counter = 0;
  return deck.slides.map((slide) =>
    slide.kind === 'cover' || slide.kind === 'close'
      ? undefined
      : String(++counter).padStart(2, '0'),
  );
};

/**
 * The presentation shell.
 *
 * Built for the room rather than for the browser: arrow keys and space advance,
 * `G` opens an overview to jump from, `N` shows the notes only the presenter can
 * see, `F` goes fullscreen, and `R` drops out of slides into a single scrollable
 * read of the whole deck for anyone who was sent the link instead of shown it.
 *
 * The stage is keyed by slide index so React remounts it on every move. That is
 * deliberate: every figure animates on mount, so remounting is what makes a
 * chart draw itself again when you step back to it.
 */
export const Deck = ({ deck, backTo }: { deck: Walkthrough; backTo: string }) => {
  const numbers = useMemo(() => ordinals(deck), [deck]);
  const total = deck.slides.length;

  const [index, setIndex] = useState(() => {
    const fromHash = Number(window.location.hash.replace('#', ''));
    return Number.isInteger(fromHash) && fromHash >= 1 && fromHash <= total ? fromHash - 1 : 0;
  });
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [reading, setReading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex(Math.min(total - 1, Math.max(0, next))),
    [total],
  );

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Some browsers refuse outside a user gesture; the deck works either way.
    }
  }, []);

  // Keeps the URL on the current slide, so a reload mid-presentation does not
  // send you back to the cover. replaceState rather than the router, because the
  // router would scroll the page and remount the stage twice.
  useEffect(() => {
    window.history.replaceState(null, '', `${window.location.pathname}#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          event.preventDefault();
          setOverview(false);
          go(index + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          setOverview(false);
          go(index - 1);
          break;
        case 'Home':
          event.preventDefault();
          go(0);
          break;
        case 'End':
          event.preventDefault();
          go(total - 1);
          break;
        case 'g':
        case 'G':
          setOverview((open) => !open);
          break;
        case 'n':
        case 'N':
          setNotes((open) => !open);
          break;
        case 'r':
        case 'R':
          setReading((open) => !open);
          break;
        case 'f':
        case 'F':
          void toggleFullscreen();
          break;
        case '?':
          setShortcuts((open) => !open);
          break;
        case 'Escape':
          if (overview || shortcuts) {
            event.preventDefault();
            setOverview(false);
            setShortcuts(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, total, overview, shortcuts, toggleFullscreen]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const slide = deck.slides[index];

  if (reading) {
    return (
      <LightboxProvider>
        <ReadMode deck={deck} numbers={numbers} backTo={backTo} onPresent={() => setReading(false)} />
      </LightboxProvider>
    );
  }

  return (
    <LightboxProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
        {/* -------------------------------------------------------------- bar */}
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-2 sm:px-4">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground
              transition-colors hover:text-primary sm:text-sm"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Case study</span>
          </Link>

          <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-foreground sm:text-sm">
            {deck.title}
          </p>

          <div className="flex shrink-0 items-center gap-0.5">
            <IconButton label="Overview (G)" active={overview} onClick={() => setOverview((o) => !o)}>
              <LayoutGrid aria-hidden="true" className="h-4 w-4" />
            </IconButton>
            <IconButton label="Presenter notes (N)" active={notes} onClick={() => setNotes((o) => !o)}>
              <NotebookPen aria-hidden="true" className="h-4 w-4" />
            </IconButton>
            <IconButton label="Read as one page (R)" onClick={() => setReading(true)}>
              <Rows3 aria-hidden="true" className="h-4 w-4" />
            </IconButton>
            <IconButton label="Shortcuts (?)" active={shortcuts} onClick={() => setShortcuts((o) => !o)}>
              <Keyboard aria-hidden="true" className="h-4 w-4" />
            </IconButton>
            <IconButton label="Fullscreen (F)" onClick={() => void toggleFullscreen()}>
              {fullscreen ? (
                <Minimize aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Maximize aria-hidden="true" className="h-4 w-4" />
              )}
            </IconButton>
          </div>
        </header>

        {/* ------------------------------------------------------------ stage */}
        <div
          ref={stage}
          className="relative min-h-0 flex-1"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(delta) > SWIPE_THRESHOLD) go(index + (delta < 0 ? 1 : -1));
            touchStart.current = null;
          }}
        >
          <div
            key={index}
            className="h-full overflow-y-auto animate-in fade-in slide-in-from-right-4
              duration-500 motion-reduce:animate-none"
          >
            <SlideView slide={slide} ordinal={numbers[index]} />
          </div>

          <StageArrow side="left" disabled={index === 0} onClick={() => go(index - 1)} />
          <StageArrow side="right" disabled={index === total - 1} onClick={() => go(index + 1)} />

          {overview && (
            <Overview
              deck={deck}
              numbers={numbers}
              current={index}
              onPick={(next) => {
                go(next);
                setOverview(false);
              }}
              onClose={() => setOverview(false)}
            />
          )}

          {shortcuts && <Shortcuts onClose={() => setShortcuts(false)} />}
        </div>

        {/* ------------------------------------------------------------ notes */}
        {notes && (
          <div className="shrink-0 border-t border-border bg-secondary/60 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              Presenter note
            </p>
            <p className="mt-1 max-h-24 overflow-y-auto text-xs leading-relaxed text-foreground sm:text-sm">
              {slide.notes ?? 'No note for this slide.'}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------- rail */}
        <footer className="flex shrink-0 items-center gap-3 border-t border-border px-3 py-2 sm:px-4">
          <p className="shrink-0 text-[11px] tabular-nums text-muted-foreground sm:text-xs">
            {index + 1} / {total}
          </p>
          <div className="flex min-w-0 flex-1 gap-[3px]">
            {deck.slides.map((item, position) => (
              <button
                key={position}
                type="button"
                onClick={() => go(position)}
                aria-label={`Slide ${position + 1}: ${item.title}`}
                aria-current={position === index}
                title={item.title}
                className={`h-1.5 min-w-0 flex-1 rounded-full transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    position === index
                      ? 'bg-primary'
                      : position < index
                        ? 'bg-primary/40'
                        : 'bg-border hover:bg-primary/25'
                  }`}
              />
            ))}
          </div>
        </footer>
      </div>
    </LightboxProvider>
  );
};

/* ------------------------------------------------------------------- controls */

const IconButton = ({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    aria-pressed={active}
    className={`rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-ring ${
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
  >
    {children}
  </button>
);

/**
 * Edge arrows.
 *
 * Deliberately faint until hovered: a projected slide should not have a pair of
 * buttons competing with the content, but a laptop trackpad still needs them.
 */
const StageArrow = ({
  side,
  disabled,
  onClick,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={side === 'left' ? 'Previous slide' : 'Next slide'}
    className={`group absolute inset-y-0 z-10 hidden w-[7%] items-center justify-center
      disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none md:flex
      ${side === 'left' ? 'left-0' : 'right-0'}`}
  >
    <span
      className="grid h-9 w-9 place-items-center rounded-full bg-card/80 text-muted-foreground
        opacity-0 shadow-[var(--shadow-card)] backdrop-blur transition-opacity duration-200
        group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {side === 'left' ? (
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      ) : (
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      )}
    </span>
  </button>
);

/* ------------------------------------------------------------------- overview */

const KIND_LABEL: Record<string, string> = {
  cover: 'Cover',
  section: 'Section',
  statement: 'Statement',
  split: 'Split',
  full: 'Figure',
  cards: 'Cards',
  close: 'Close',
};

/** Jump list. Titles, not thumbnails — thirty live figures would crawl. */
const Overview = ({
  deck,
  numbers,
  current,
  onPick,
  onClose,
}: {
  deck: Walkthrough;
  numbers: (string | undefined)[];
  current: number;
  onPick: (index: number) => void;
  onClose: () => void;
}) => (
  <div className="absolute inset-0 z-30 overflow-y-auto bg-background/97 p-4 animate-in fade-in duration-200 sm:p-6">
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{deck.title} · {deck.slides.length} slides</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close overview"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {deck.slides.map((slide, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onPick(index)}
            className={`rounded-md border p-3 text-left transition-all hover:-translate-y-0.5
              hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring ${
                index === current ? 'border-primary bg-primary/[0.06]' : 'border-border bg-card'
              }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                {numbers[index] ?? KIND_LABEL[slide.kind]}
              </span>
              <span className="text-[10px] tabular-nums text-muted-foreground">{index + 1}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
              {slide.title}
            </p>
            {slide.standfirst && (
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                {slide.standfirst}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ shortcuts */

const KEYS: [string, string][] = [
  ['→ / Space', 'Next slide'],
  ['←', 'Previous slide'],
  ['Home / End', 'First / last slide'],
  ['G', 'Slide overview'],
  ['N', 'Presenter notes'],
  ['R', 'Read as one page'],
  ['F', 'Fullscreen'],
  ['Click a figure', 'Open it full size'],
];

const Shortcuts = ({ onClose }: { onClose: () => void }) => (
  <div
    onClick={onClose}
    className="absolute inset-0 z-40 grid place-items-center bg-foreground/40 p-4 animate-in fade-in duration-200"
  >
    <div
      onClick={(event) => event.stopPropagation()}
      className="w-full max-w-sm rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-hover)]"
    >
      <p className="text-sm font-semibold text-foreground">Keyboard</p>
      <dl className="mt-3 space-y-2">
        {KEYS.map(([key, action]) => (
          <div key={key} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-foreground">
              {key}
            </dt>
            <dd className="text-right text-xs text-muted-foreground">{action}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
);

/* ------------------------------------------------------------------ read mode */

/**
 * The whole deck as one page.
 *
 * A walkthrough sent as a link is read, not presented, and stepping through
 * thirty slides with a mouse is a chore. This stacks them, notes included, so the
 * deck doubles as a document.
 */
const ReadMode = ({
  deck,
  numbers,
  backTo,
  onPresent,
}: {
  deck: Walkthrough;
  numbers: (string | undefined)[];
  backTo: string;
  onPresent: () => void;
}) => (
  <div className="min-h-[100dvh] bg-background">
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Case study</span>
      </Link>
      <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-foreground sm:text-sm">
        {deck.title}
      </p>
      <button type="button" onClick={onPresent} className="portfolio-button portfolio-button-outline text-xs">
        Present
      </button>
    </header>

    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {deck.slides.map((slide, index) => (
        <section key={index} className="mb-10 last:mb-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              {numbers[index] ?? KIND_LABEL[slide.kind]}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="min-h-[62vh]">
              <SlideView slide={slide} ordinal={numbers[index]} />
            </div>
          </div>
          {slide.notes && (
            <p className="mt-2 border-l-2 border-border pl-3 text-xs leading-relaxed text-muted-foreground">
              {slide.notes}
            </p>
          )}
        </section>
      ))}
    </div>
  </div>
);
