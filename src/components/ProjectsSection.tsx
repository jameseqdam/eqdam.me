import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import SectionCta from './SectionCta';
import { workItems, type WorkItem } from '@/lib/content';

/** Fades the belt into the section edges instead of clipping cards mid-word. */
const EDGE_MASK =
  'linear-gradient(to right, transparent, black 5%, black 95%, transparent)';

/**
 * Case-study titles are written for the /work index, where the full subtitle
 * earns its space. On a teaser card the part before the colon is the headline.
 */
const shortTitle = (title: string) => title.split(':')[0].trim();

/**
 * ROI labels are full sentences. The first clause is the readable fragment —
 * "Articles screened in the systematic review" out of "…, of which only 7 met
 * inclusion criteria".
 */
const shortLabel = (label: string) => label.split(/[,(]/)[0].trim();

const ProjectCard = ({ item, duplicate = false }: { item: WorkItem; duplicate?: boolean }) => {
  const metric = item.roiMetrics?.[0];

  return (
    <div
      // The duplicated half exists only to close the loop, so it stays out of
      // the accessibility tree and out of the tab order.
      aria-hidden={duplicate || undefined}
      className="mr-4 w-[16rem] flex-shrink-0 sm:w-[18rem]"
    >
      <Link
        to={`/work/${item.slug}`}
        tabIndex={duplicate ? -1 : undefined}
        className="group relative flex h-40 flex-col overflow-hidden rounded-lg border border-border
          bg-card p-4 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color]
          duration-300 ease-out hover:-translate-y-1 hover:border-primary/50
          hover:shadow-[var(--shadow-hover)] focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring motion-reduce:transform-none motion-reduce:transition-none"
      >
        <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider">
          <span className="truncate font-semibold text-primary">{item.category}</span>
          <span className="flex-shrink-0 tabular-nums text-muted-foreground">{item.timeline}</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
          {shortTitle(item.title)}
        </h3>

        {metric && (
          <div className="mt-auto flex items-end gap-2">
            <span
              className="text-xl font-bold tabular-nums text-primary transition-transform
                duration-300 ease-out group-hover:scale-110 origin-left
                motion-reduce:transform-none"
            >
              {metric.value}
            </span>
            <span className="line-clamp-2 pb-0.5 text-[11px] leading-tight text-muted-foreground">
              {shortLabel(metric.label)}
            </span>
          </div>
        )}

        {/* Reads as the card underlining itself on approach. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r
            from-primary/40 to-primary transition-transform duration-500 ease-out
            group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </Link>
    </div>
  );
};

const Belt = ({
  items,
  direction,
  running,
}: {
  items: WorkItem[];
  direction: 'left' | 'right';
  running: boolean;
}) => (
  // The vertical padding is headroom for the hover lift and its shadow, which
  // the horizontal clipping would otherwise cut off.
  <div className="overflow-hidden py-3" style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}>
    <div
      className={`flex w-max ${
        direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
      }`}
      style={{ animationPlayState: running ? 'running' : 'paused' }}
    >
      {items.map((item) => (
        <ProjectCard key={item.slug} item={item} />
      ))}
      {items.map((item) => (
        <ProjectCard key={`${item.slug}-loop`} item={item} duplicate />
      ))}
    </div>
  </div>
);

/**
 * Key projects as a drifting belt of case-study cards.
 *
 * The homepage used to carry four long-form case studies inline, which the /work
 * index and its detail pages already do properly. This shows all twelve instead:
 * two rows drifting in opposite directions, each card down to its category, its
 * headline number and one clause of context. Hovering anywhere stops the belt so
 * a card can be read and clicked, and a pause control does the same for anyone
 * not using a pointer.
 *
 * The motion is deliberately unlike the experience rail above it — ambient and
 * continuous rather than a stepped playhead — so the two sections do not read as
 * the same widget twice.
 */
const ProjectsSection = () => {
  const beltRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;

    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const node = beltRef.current;
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
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!workItems.length) return null;

  // Alternating split, so each row carries a spread of recent and older work
  // rather than one row of everything current.
  const topRow = workItems.filter((_, index) => index % 2 === 0);
  const bottomRow = workItems.filter((_, index) => index % 2 === 1);
  const areas = [...new Set(workItems.map((item) => item.category))];
  const running = visible && !hovered && !userPaused;

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Key Projects</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {workItems.length} case studies across {areas.length} practice areas, each carrying the
            problem, the approach and the measured outcome.
          </p>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground/80">{areas.join(' · ')}</p>
        </div>

        <div
          ref={beltRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
          // Entrance: the belt resolves out of a blur rather than sliding in, so
          // it does not echo the staggered rise used by the sections around it.
          className={`transition-[opacity,filter] duration-700 ease-out
            motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:blur-0 ${
              visible ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px]'
            }`}
        >
          {reducedMotion ? (
            // No belt at all: the cards sit still and wrap, since a paused
            // marquee would hide half of them off-screen.
            <div className="flex flex-wrap justify-center">
              {workItems.map((item) => (
                <div key={item.slug} className="mb-4">
                  <ProjectCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Belt items={topRow} direction="left" running={running} />
              <Belt items={bottomRow} direction="right" running={running} />
            </>
          )}
        </div>

        {!reducedMotion && (
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setUserPaused((current) => !current)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border
                bg-background px-3 py-1.5 font-medium transition-colors hover:text-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {userPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {userPaused ? 'Play' : 'Pause'}
              <span className="sr-only"> the case study belt</span>
            </button>
            <span aria-hidden="true" className="hidden sm:inline">
              Hover to stop the belt, then open any case study
              <ArrowRight className="ml-1 inline h-3 w-3" />
            </span>
          </div>
        )}

        <SectionCta to="/work">{`Explore All ${workItems.length} Case Studies`}</SectionCta>
      </div>
    </section>
  );
};

export default ProjectsSection;
