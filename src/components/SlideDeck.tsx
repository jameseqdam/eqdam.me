import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, Presentation } from 'lucide-react';
import { renderInline } from '@/lib/inline';
import type { Deck, DeckLine, DeckSlide } from '@/lib/content';

/** Distance a touch has to travel before it counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 48;

/**
 * The opening and closing slides are inverted, the argument in between sits on
 * the card surface. Bookending is what gives a deck its rhythm, and it is the
 * one place this site already inverts — the hero gradient.
 */
const isInverted = (slide: DeckSlide) => slide.kind === 'title' || slide.kind === 'close';

/** Bold text has to lift off whichever surface the slide is standing on. */
const strongInk = (inverted: boolean) => (inverted ? 'text-primary-foreground' : 'text-foreground');

const Line = ({ line, inverted }: { line: DeckLine; inverted: boolean }) => (
  <p
    className={`text-sm leading-relaxed sm:text-base lg:text-lg ${
      inverted ? 'text-primary-foreground/85' : 'text-muted-foreground'
    }`}
  >
    {line.lead && (
      <span className={`font-semibold ${inverted ? 'text-primary-foreground' : 'text-foreground'}`}>
        {line.lead}:{' '}
      </span>
    )}
    {renderInline(line.text, strongInk(inverted))}
  </p>
);

const Callout = ({ line, inverted }: { line: DeckLine & { lead: string }; inverted: boolean }) => (
  <div
    className={`rounded-md border px-4 py-3 text-sm leading-relaxed sm:text-base ${
      inverted
        ? 'border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground/90'
        : 'border-primary/20 bg-primary/5 text-muted-foreground'
    }`}
  >
    <span
      className={`font-semibold ${inverted ? 'text-primary-foreground' : 'text-primary'}`}
    >
      {line.lead}:{' '}
    </span>
    {renderInline(line.text, strongInk(inverted))}
  </div>
);

/**
 * One slide's contents, laid out by kind. Deliberately free of any positioning
 * of its own so the same markup serves both the stage and the grid view.
 */
const SlideBody = ({ slide }: { slide: DeckSlide }) => {
  const inverted = isInverted(slide);
  const centred = slide.kind !== 'point';

  const eyebrow = slide.eyebrow && (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-xs ${
        inverted ? 'text-primary-foreground/75' : 'text-primary'
      }`}
    >
      {slide.eyebrow}
    </p>
  );

  const headline = (
    <h2
      className={`font-bold leading-[1.1] tracking-tight ${
        slide.kind === 'point' ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-2xl sm:text-4xl lg:text-5xl'
      } ${inverted ? 'text-primary-foreground' : 'text-foreground'}`}
    >
      {renderInline(slide.headline, strongInk(inverted))}
    </h2>
  );

  return (
    <div className={`flex w-full flex-col gap-4 sm:gap-5 ${centred ? 'items-center text-center' : ''}`}>
      {slide.kind === 'point' ? (
        // The numbered slides lead with the figure, the way the source decks do:
        // an oversized, recessive numeral the eye passes on its way to the title.
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span
            aria-hidden="true"
            className="shrink-0 text-4xl font-light leading-none tabular-nums text-primary/30 sm:text-5xl lg:text-6xl"
          >
            {slide.ordinal}
          </span>
          <div className="space-y-1.5">
            {eyebrow}
            {headline}
          </div>
        </div>
      ) : (
        <div className={`space-y-2 ${centred ? 'flex flex-col items-center' : ''}`}>
          {eyebrow}
          {headline}
        </div>
      )}

      {slide.standfirst && (
        <p
          className={`max-w-2xl text-sm sm:text-base lg:text-lg ${
            inverted ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}
        >
          {renderInline(slide.standfirst, strongInk(inverted))}
        </p>
      )}

      {slide.body && (
        <div className={`max-w-2xl space-y-3 ${slide.kind === 'point' ? 'sm:pl-[3.5rem] lg:pl-[4.5rem]' : ''}`}>
          {slide.body.map((line, index) => (
            <Line key={index} line={line} inverted={inverted} />
          ))}
        </div>
      )}

      {slide.callout && (
        <div className={`max-w-2xl ${slide.kind === 'point' ? 'sm:ml-[3.5rem] lg:ml-[4.5rem]' : ''}`}>
          <Callout line={slide.callout} inverted={inverted} />
        </div>
      )}

      {slide.link && (
        <Link
          to={slide.link.to}
          className={`group mt-1 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm
            font-medium transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-offset-2 sm:text-base ${
              inverted
                ? 'bg-background text-foreground hover:bg-background/90 focus-visible:ring-primary-foreground focus-visible:ring-offset-transparent'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-offset-background'
            }`}
        >
          {slide.link.label}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
};

const surfaceClasses = (slide: DeckSlide) =>
  isInverted(slide) ? 'portfolio-hero-bg border-transparent' : 'bg-card border-border';

/**
 * A LinkedIn carousel, presented as a deck rather than transcribed into prose.
 *
 * These four pieces were authored as slides, so reading them as a wall of
 * headings and paragraphs lost the form they were made in. The slides are
 * rebuilt here in this site's own design language rather than in the four
 * different visual identities of the source PDFs — one stage, the site's type
 * scale and tokens, and the opening and closing slides inverted onto the hero
 * gradient to bookend the argument.
 *
 * Two views, because a deck is worse than prose at being read and better at
 * being presented: the stage advances one slide at a time, and the grid lays the
 * whole argument out at once for scanning, printing, and screen readers.
 */
const SlideDeck = ({ deck }: { deck: Deck }) => {
  const [index, setIndex] = useState(0);
  /** Which way the last move went, so the incoming slide enters from that side. */
  const [direction, setDirection] = useState<1 | -1>(1);
  const [grid, setGrid] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = deck.slides.length;
  const slide = deck.slides[index];

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    if (clamped === index) return;
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
  };

  return (
    <section
      role="group"
      aria-roledescription="carousel"
      aria-label={`${deck.kicker}, ${total} slides`}
      onKeyDown={(event) => {
        // Bubbles up from the controls, so the arrows work once the deck has
        // focus without the page's own arrow-key scrolling being hijacked.
        if (event.key === 'ArrowRight') go(index + 1);
        if (event.key === 'ArrowLeft') go(index - 1);
        if (event.key === 'Home') go(0);
        if (event.key === 'End') go(total - 1);
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Presentation aria-hidden="true" className="h-4 w-4 text-primary" />
          {deck.kicker}
          <span className="text-muted-foreground/60">·</span>
          <span className="tabular-nums">{total} slides</span>
        </p>

        <button
          type="button"
          onClick={() => setGrid((current) => !current)}
          aria-pressed={grid}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5
            text-xs font-medium text-muted-foreground transition-colors hover:text-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
          {grid ? 'One at a time' : 'All slides'}
        </button>
      </div>

      {grid ? (
        <ol className="grid gap-4 sm:grid-cols-2">
          {deck.slides.map((entry, entryIndex) => (
            <li
              key={entryIndex}
              className={`flex rounded-xl border p-5 sm:p-6 ${surfaceClasses(entry)}`}
            >
              <SlideBody slide={entry} />
            </li>
          ))}
        </ol>
      ) : (
        <>
          <div
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current;
              touchStartX.current = null;
              if (start === null) return;
              const delta = event.changedTouches[0].clientX - start;
              if (Math.abs(delta) < SWIPE_THRESHOLD) return;
              go(delta < 0 ? index + 1 : index - 1);
            }}
            aria-live="polite"
            className={`flex aspect-[4/5] items-center overflow-hidden rounded-xl border p-6
              shadow-[var(--shadow-card)] sm:aspect-[16/10] sm:p-10 lg:p-14 ${surfaceClasses(slide)}`}
          >
            {/*
              Remounted per slide so the entrance replays. The travel direction
              follows the move, which is what makes a deck feel like a deck
              rather than like a set of tabs.
            */}
            <div
              key={index}
              className={`w-full animate-in fade-in duration-500 motion-reduce:animate-none ${
                direction === 1 ? 'slide-in-from-right-6' : 'slide-in-from-left-6'
              }`}
            >
              <SlideBody slide={slide} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous slide"
              className="portfolio-button portfolio-button-outline h-10 w-10 shrink-0 p-0"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>

            {/* Segmented rail: position and length in one mark, and every
                segment is a jump target. */}
            <ol className="flex flex-1 items-center gap-1">
              {deck.slides.map((entry, entryIndex) => (
                <li key={entryIndex} className="flex-1">
                  <button
                    type="button"
                    onClick={() => go(entryIndex)}
                    aria-label={`Slide ${entryIndex + 1}: ${entry.headline}`}
                    aria-current={entryIndex === index ? 'true' : undefined}
                    className="group flex w-full items-center py-2 focus-visible:outline-none"
                  >
                    <span
                      className={`h-1 w-full rounded-full transition-colors duration-300
                        group-focus-visible:ring-2 group-focus-visible:ring-ring
                        group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background ${
                          entryIndex <= index
                            ? 'bg-primary'
                            : 'bg-border group-hover:bg-muted-foreground/40'
                        }`}
                    />
                  </button>
                </li>
              ))}
            </ol>

            <p className="shrink-0 text-xs tabular-nums text-muted-foreground sm:text-sm">
              {index + 1} / {total}
            </p>

            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === total - 1}
              aria-label="Next slide"
              className="portfolio-button portfolio-button-outline h-10 w-10 shrink-0 p-0"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default SlideDeck;
