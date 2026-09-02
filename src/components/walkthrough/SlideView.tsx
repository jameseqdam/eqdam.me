import type { Slide } from '@/lib/walkthrough';
import { renderInline } from '@/lib/inline';
import { FigureView } from './figures';

/**
 * One slide.
 *
 * Seven layouts, and the only real difference between them is how the room is
 * divided between the argument and the evidence: `statement` is all argument,
 * `full` is all evidence, `split` is the workhorse in between. Type scales with
 * the viewport rather than sitting at fixed sizes, because the same slide has to
 * survive a laptop, a projector, and someone's phone.
 */
export const SlideView = ({ slide, ordinal }: { slide: Slide; ordinal?: string }) => {
  if (slide.kind === 'cover' || slide.kind === 'close') return <Bookend slide={slide} />;
  if (slide.kind === 'section') return <Section slide={slide} ordinal={ordinal} />;
  if (slide.kind === 'statement') return <Statement slide={slide} />;
  if (slide.kind === 'full') return <Full slide={slide} />;
  if (slide.kind === 'cards') return <Cards slide={slide} />;
  return <Split slide={slide} />;
};

/* ------------------------------------------------------------------- fragments */

const Eyebrow = ({ children, tone = 'primary' }: { children?: string; tone?: 'primary' | 'light' }) =>
  children ? (
    <p
      className={`text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs ${
        tone === 'light' ? 'text-primary-foreground/70' : 'text-primary'
      }`}
    >
      {children}
    </p>
  ) : null;

const Title = ({ children, className = '' }: { children: string; className?: string }) => (
  <h2
    className={`text-balance font-bold leading-[1.1] tracking-tight
      text-[clamp(1.35rem,3.1vw,2.6rem)] ${className}`}
  >
    {renderInline(children)}
  </h2>
);

const Standfirst = ({ children, className = '' }: { children?: string; className?: string }) =>
  children ? (
    <p
      className={`max-w-2xl text-pretty leading-relaxed text-[clamp(0.85rem,1.25vw,1.1rem)] ${
        className || 'text-muted-foreground'
      }`}
    >
      {renderInline(children, 'font-semibold text-foreground')}
    </p>
  ) : null;

const Bullets = ({ items }: { items: NonNullable<Slide['bullets']> }) => (
  <ul className="space-y-2.5">
    {items.map((bullet, index) => (
      <li
        key={bullet.text}
        className="flex gap-2.5 leading-snug text-[clamp(0.8rem,1.1vw,1rem)]
          animate-in fade-in slide-in-from-left-2 fill-mode-both motion-reduce:animate-none"
        style={{ animationDelay: `${140 + index * 90}ms`, animationDuration: '500ms' }}
      >
        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        <span className="text-muted-foreground">
          {bullet.lead && <span className="font-semibold text-foreground">{bullet.lead} </span>}
          {renderInline(bullet.text)}
        </span>
      </li>
    ))}
  </ul>
);

const Callout = ({ callout }: { callout: NonNullable<Slide['callout']> }) => (
  <div
    className="rounded-md border-l-2 border-primary bg-primary/[0.07] px-3.5 py-3
      animate-in fade-in slide-in-from-bottom-2 fill-mode-both motion-reduce:animate-none"
    style={{ animationDelay: '360ms', animationDuration: '500ms' }}
  >
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[11px]">
      {callout.lead}
    </p>
    <p className="mt-1 leading-relaxed text-foreground text-[clamp(0.8rem,1.05vw,0.98rem)]">
      {renderInline(callout.text)}
    </p>
  </div>
);

/* --------------------------------------------------------------------- layouts */

/** Cover and close, on the hero gradient. The only slides that invert. */
const Bookend = ({ slide }: { slide: Slide }) => (
  <div className="portfolio-hero-bg flex h-full flex-col justify-center px-[6%] py-10 text-primary-foreground">
    <div className="mx-auto w-full max-w-4xl">
      <Eyebrow tone="light">{slide.eyebrow}</Eyebrow>
      <h1
        className="mt-3 text-balance font-bold leading-[1.05] tracking-tight
          text-[clamp(1.75rem,4.4vw,3.6rem)]
          animate-in fade-in slide-in-from-bottom-3 fill-mode-both motion-reduce:animate-none"
        style={{ animationDuration: '600ms' }}
      >
        {renderInline(slide.title, 'text-primary-foreground')}
      </h1>
      {slide.standfirst && (
        <p
          className="mt-4 max-w-2xl text-pretty leading-relaxed text-primary-foreground/85
            text-[clamp(0.9rem,1.5vw,1.25rem)]
            animate-in fade-in fill-mode-both motion-reduce:animate-none"
          style={{ animationDelay: '200ms', animationDuration: '600ms' }}
        >
          {renderInline(slide.standfirst, 'font-semibold text-primary-foreground')}
        </p>
      )}
      {slide.bullets && (
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {slide.bullets.map((bullet, index) => (
            <li
              key={bullet.text}
              className="animate-in fade-in fill-mode-both motion-reduce:animate-none"
              style={{ animationDelay: `${320 + index * 110}ms`, animationDuration: '500ms' }}
            >
              {bullet.lead && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/60">
                  {bullet.lead}
                </p>
              )}
              <p className="text-sm font-medium text-primary-foreground sm:text-base">
                {renderInline(bullet.text, 'text-primary-foreground')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

/** Divider. Large numeral, one line of intent, nothing else. */
const Section = ({ slide, ordinal }: { slide: Slide; ordinal?: string }) => (
  <div className="section-gradient flex h-full flex-col justify-center px-[6%] py-10">
    <div className="mx-auto w-full max-w-4xl">
      {ordinal && (
        <p className="font-bold leading-none text-primary/20 text-[clamp(3rem,9vw,7rem)]">{ordinal}</p>
      )}
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <Title className="mt-2 text-foreground">{slide.title}</Title>
      <Standfirst className="mt-3 text-muted-foreground">{slide.standfirst}</Standfirst>
    </div>
  </div>
);

/** One sentence, given the whole stage. Used where the point *is* the point. */
const Statement = ({ slide }: { slide: Slide }) => (
  <div className="flex h-full flex-col justify-center px-[6%] py-10">
    <div className="mx-auto w-full max-w-3xl">
      <Eyebrow>{slide.eyebrow}</Eyebrow>
      <Title className="mt-2 text-foreground">{slide.title}</Title>
      <Standfirst className="mt-4">{slide.standfirst}</Standfirst>
      {slide.bullets && (
        <div className="mt-5">
          <Bullets items={slide.bullets} />
        </div>
      )}
      {slide.callout && (
        <div className="mt-5">
          <Callout callout={slide.callout} />
        </div>
      )}
      {slide.figure && (
        <div className="mt-6">
          <FigureView figure={slide.figure} />
        </div>
      )}
    </div>
  </div>
);

/** Argument left, evidence right. The layout most slides want. */
const Split = ({ slide }: { slide: Slide }) => (
  <div className="flex h-full flex-col justify-center px-[5%] py-8">
    <div
      className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]
        lg:gap-10"
    >
      <div className="min-w-0">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <Title className="mt-2 text-foreground">{slide.title}</Title>
        <Standfirst className="mt-3">{slide.standfirst}</Standfirst>
        {slide.bullets && (
          <div className="mt-4">
            <Bullets items={slide.bullets} />
          </div>
        )}
        {slide.callout && (
          <div className="mt-4">
            <Callout callout={slide.callout} />
          </div>
        )}
      </div>
      {slide.figure && (
        <div className="flex min-h-0 min-w-0 items-center justify-center">
          <FigureView figure={slide.figure} />
        </div>
      )}
    </div>
  </div>
);

/** Figure first, title reduced to a caption above it. */
const Full = ({ slide }: { slide: Slide }) => (
  <div className="flex h-full flex-col px-[5%] py-8">
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-4">
      <div>
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <h2 className="mt-1.5 text-balance font-bold leading-tight tracking-tight text-foreground text-[clamp(1.1rem,2.2vw,1.8rem)]">
          {renderInline(slide.title)}
        </h2>
        <Standfirst className="mt-2">{slide.standfirst}</Standfirst>
      </div>
      {slide.figure && (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <FigureView figure={slide.figure} />
        </div>
      )}
      {slide.callout && <Callout callout={slide.callout} />}
    </div>
  </div>
);

/** Two to four cards. For a set of parallel points with no ranking between them. */
const Cards = ({ slide }: { slide: Slide }) => {
  const cards = slide.cards ?? [];

  return (
    <div className="flex h-full flex-col justify-center px-[5%] py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <Title className="mt-2 text-foreground">{slide.title}</Title>
        <Standfirst className="mt-3">{slide.standfirst}</Standfirst>

        <div
          className={`mt-5 grid gap-3 sm:gap-4 ${
            cards.length <= 2
              ? 'sm:grid-cols-2'
              : cards.length === 3
                ? 'sm:grid-cols-3'
                : 'sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="rounded-lg border border-border bg-card p-3.5 shadow-[var(--shadow-card)]
                animate-in fade-in slide-in-from-bottom-3 fill-mode-both motion-reduce:animate-none sm:p-4"
              style={{ animationDelay: `${140 + index * 100}ms`, animationDuration: '500ms' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-1.5 font-semibold leading-snug text-foreground text-[clamp(0.85rem,1.15vw,1.05rem)]">
                {card.title}
              </p>
              <p className="mt-1.5 leading-snug text-muted-foreground text-[clamp(0.75rem,1vw,0.9rem)]">
                {renderInline(card.text)}
              </p>
            </div>
          ))}
        </div>

        {slide.figure && (
          <div className="mt-5">
            <FigureView figure={slide.figure} />
          </div>
        )}
      </div>
    </div>
  );
};
