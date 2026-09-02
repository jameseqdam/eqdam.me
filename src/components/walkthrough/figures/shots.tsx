import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import type { Figure } from '@/lib/walkthrough';
import { FigureFrame, Shot, useReveal } from './primitives';

type Of<K extends Figure['kind']> = Extract<Figure, { kind: K }>;

/** One artefact, framed. */
export const SingleShot = ({ figure }: { figure: Of<'shot'> }) => (
  <FigureFrame caption={figure.caption} className="items-center">
    <Shot
      shot={{ src: figure.src, alt: figure.alt }}
      frame={figure.frame}
      fit={figure.fit}
      pan={figure.pan}
      className="mx-auto max-h-full"
    />
  </FigureFrame>
);

/**
 * Several artefacts at once.
 *
 * `row` for two or three things being compared, `grid` for a set, `filmstrip`
 * for a sequence that scrolls — sketches through wireframes through build — and
 * `stack` for the same screen at different depths, offset so the pile reads.
 */
export const ShotSet = ({ figure }: { figure: Of<'shots'> }) => {
  const count = figure.items.length;

  if (figure.layout === 'filmstrip') {
    return (
      <FigureFrame caption={figure.caption}>
        <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
          {figure.items.map((item, index) => (
            <Shot
              key={item.src}
              shot={item}
              frame={figure.frame}
              index={index}
              className="w-[min(62%,240px)] shrink-0 snap-start"
            />
          ))}
        </div>
      </FigureFrame>
    );
  }

  if (figure.layout === 'stack') {
    return (
      <FigureFrame caption={figure.caption}>
        {/* Each layer steps down and right, so the pile reads as depth without
            covering the edge of the one beneath it. */}
        <div
          className="relative mx-auto w-full max-w-md"
          style={{ paddingRight: `${(count - 1) * 6}%`, paddingBottom: `${(count - 1) * 4}%` }}
        >
          {figure.items.map((item, index) => (
            <Shot
              key={item.src}
              shot={item}
              frame={figure.frame}
              index={index}
              className={index === 0 ? 'relative' : 'absolute inset-x-0 top-0'}
              style={
                index === 0
                  ? undefined
                  : {
                      transform: `translate(${index * 6}%, ${index * 4}%)`,
                      zIndex: index,
                    }
              }
            />
          ))}
        </div>
      </FigureFrame>
    );
  }

  const columns =
    figure.layout === 'row'
      ? count === 2
        ? 'grid-cols-2'
        : 'grid-cols-2 sm:grid-cols-3'
      : count <= 4
        ? 'grid-cols-2'
        : count <= 6
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <FigureFrame caption={figure.caption}>
      <div className={`grid gap-2.5 sm:gap-3 ${columns}`}>
        {figure.items.map((item, index) => (
          <Shot key={item.src} shot={item} frame={figure.frame} index={index} />
        ))}
      </div>
    </FigureFrame>
  );
};

/**
 * Before and after, on one wipe.
 *
 * Two screenshots side by side make an audience look back and forth and find
 * nothing; the same two under a wipe make the difference land in one gesture.
 * Draggable by pointer, and by arrow keys once the handle has focus.
 */
export const Compare = ({ figure }: { figure: Of<'compare'> }) => {
  const shown = useReveal(80);
  const [position, setPosition] = useState(50);
  const container = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const bounds = container.current?.getBoundingClientRect();
    if (!bounds) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100)));
  }, []);

  return (
    <FigureFrame caption={figure.caption}>
      <div
        ref={container}
        className="relative mx-auto w-full select-none overflow-hidden rounded-lg border border-border
          bg-card shadow-[var(--shadow-card)] transition-opacity duration-700"
        style={{ opacity: shown ? 1 : 0, aspectRatio: figure.frame === 'phone' ? '9 / 16' : '16 / 10' }}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromClientX(event.clientX);
        }}
        onPointerMove={(event) => dragging.current && setFromClientX(event.clientX)}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <img
          src={figure.after.src}
          alt={figure.after.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={figure.before.src}
            alt={figure.before.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full bg-card object-contain"
          />
        </div>

        <span
          className="absolute left-2 top-2 rounded-md bg-foreground/70 px-2 py-1 text-[10px]
            font-semibold uppercase tracking-[0.08em] text-background sm:text-[11px]"
        >
          {figure.before.label}
        </span>
        <span
          className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold
            uppercase tracking-[0.08em] text-primary-foreground sm:text-[11px]"
        >
          {figure.after.label}
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary"
          style={{ left: `${position}%` }}
        />
        <button
          type="button"
          aria-label={`Wipe between ${figure.before.label} and ${figure.after.label}`}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.stopPropagation();
              setPosition((value) => Math.max(0, value - 4));
            }
            if (event.key === 'ArrowRight') {
              event.stopPropagation();
              setPosition((value) => Math.min(100, value + 4));
            }
          }}
          className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center
            rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-hover)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2"
          style={{ left: `${position}%` }}
        >
          <MoveHorizontal aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </FigureFrame>
  );
};
