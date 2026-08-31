import { useEffect, useRef, useState } from 'react';
import CompanyLogo from './CompanyLogo';
import SectionCta from './SectionCta';
import { experience } from '@/lib/content';

/** Long enough to read a glimpse line, short enough to see all eight in a sitting. */
const AUTOPLAY_MS = 3800;

const chapters = [...experience.chapters].sort((a, b) => a.startYear - b.startYear);

/**
 * Career at a glance: a chronological rail of company chapters with one short
 * glimpse beneath it.
 *
 * The homepage deliberately carries no achievement lists — this section used to
 * repeat six full role write-ups that the /experience page already tells better.
 * Instead the rail plays itself through all eight chapters on scroll-in, so a
 * visitor sees the whole shape of the career without scrolling, and anyone who
 * wants substance is one click from the full timeline.
 */
const ExperienceSection = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Opens on the current role, then plays backwards through history via the wrap.
  const [active, setActive] = useState(chapters.length - 1);
  // Autoplay is a hint that the rail is interactive, not a carousel: the first
  // hover, tap or focus hands control over for good.
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const node = railRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || interacted) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % chapters.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [visible, interacted]);

  if (!chapters.length) return null;

  const select = (index: number) => {
    setInteracted(true);
    setActive(index);
  };

  const chapter = chapters[active];
  const years = new Date().getFullYear() - chapters[0].startYear;
  // Fraction of the rail the active chapter sits at, used to fill the line.
  const progress = chapters.length > 1 ? active / (chapters.length - 1) : 1;

  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 bg-background px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Professional Experience</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {years} years across {chapters.length} organisations, from software engineering into UX
            research leadership.
          </p>
        </div>

        <div ref={railRef} className="relative">
          {/*
            The connecting line is desktop-only: the mobile grid wraps to two
            rows, where a single horizontal rule would cut across the nodes.
            The offsets land it on the plate centres: 44px in from each edge
            clears the button's own padding plus half of a w-20 plate, and 26px
            down is half of an h-11 plate below that same padding.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-11 top-[1.625rem] hidden h-px bg-border md:block"
          />
          <div
            aria-hidden="true"
            style={{ transform: `scaleX(${visible ? progress : 0})` }}
            className="pointer-events-none absolute inset-x-11 top-[1.625rem] hidden h-px origin-left
              bg-gradient-to-r from-primary/40 via-primary/70 to-primary
              transition-transform duration-700 ease-out motion-reduce:transition-none md:block"
          />

          <ol className="relative grid grid-cols-4 gap-x-2 gap-y-6 md:flex md:justify-between md:gap-4">
            {chapters.map((entry, index) => {
              const isActive = index === active;

              return (
                <li
                  key={`${entry.company}-${entry.startYear}`}
                  // Outer wrapper owns the staggered entrance so it never
                  // competes with the active-state transform on the plate.
                  className={`flex justify-center transition-all duration-700 ease-out
                    motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0
                    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <button
                    type="button"
                    aria-label={`${entry.company}, ${entry.period}`}
                    aria-pressed={isActive}
                    onMouseEnter={() => select(index)}
                    onFocus={() => select(index)}
                    onClick={() => select(index)}
                    className="group flex flex-col items-center gap-2 rounded-lg p-1
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <CompanyLogo
                      src={entry.logo}
                      company={entry.company}
                      size="sm"
                      className={`w-16 md:w-20 transition-all duration-500 ease-out
                        motion-reduce:transform-none motion-reduce:transition-none
                        ${
                          isActive
                            ? 'scale-105 ring-2 ring-primary/70 shadow-[var(--shadow-hover)]'
                            : 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'
                        }`}
                    />
                    <span
                      className={`text-[11px] sm:text-xs tabular-nums transition-colors duration-300 ${
                        isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {entry.startYear}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <p
          aria-hidden="true"
          className={`mt-6 text-center text-xs text-muted-foreground transition-opacity duration-500 ${
            interacted ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Hover or tap a chapter for the short version
        </p>

        {/* Announced only once the visitor is driving; autoplay changes would
            otherwise interrupt a screen reader mid-sentence. */}
        <div className="mt-3" aria-live={interacted ? 'polite' : 'off'}>
          <div
            key={active}
            className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]
              min-h-[12rem] sm:min-h-[10.5rem]
              animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-primary">{chapter.role}</h3>
              <span className="text-sm font-medium text-muted-foreground sm:whitespace-nowrap">
                {chapter.company} · {chapter.period}
              </span>
            </div>

            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {chapter.glimpse}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {chapter.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <SectionCta to="/experience">View Full Leadership Timeline</SectionCta>
      </div>
    </section>
  );
};

export default ExperienceSection;
