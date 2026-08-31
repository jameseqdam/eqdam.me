import { useEffect, useRef, useState } from 'react';
import { skillCategories } from '@/lib/content';

interface Chip {
  name: string;
  /** Index into skillCategories. */
  category: number;
  emphasised: boolean;
}

/** Flattened once at module scope: the source data is static. */
const chips: Chip[] = skillCategories.flatMap((category, index) =>
  category.skills.map((name) => ({
    name,
    category: index,
    emphasised: category.emphasis.includes(name),
  })),
);

/**
 * The whole toolkit, in one mosaic that filters in place.
 *
 * Every skill is on screen at once, because the point of this section is
 * coverage. What used to make it enormous was six
 * separate cards plus a block of self-scored proficiency meters; the meters are
 * gone and the cards have collapsed into a single weighted cloud, where the
 * skills that carry each discipline are drawn larger so the eye has somewhere
 * to land.
 *
 * The interaction runs both ways, and is unlike anything else on the page:
 * choosing a discipline dims the rest of the cloud without moving a single chip,
 * so you can see the shape of that discipline inside the whole; and hovering any
 * single skill lights up the discipline it belongs to in the legend, which turns
 * the legend into a reverse index.
 */
const SkillsSection = () => {
  const mosaicRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  /** Click or tap: sticky, because touch has no hover. */
  const [selected, setSelected] = useState<number | null>(null);
  /** Pointer or keyboard focus on a legend pill: transient. */
  const [preview, setPreview] = useState<number | null>(null);
  /** Pointer on a single chip. Lights the legend only — dimming the cloud on
      every chip the pointer crosses would strobe. */
  const [spotlight, setSpotlight] = useState<number | null>(null);

  useEffect(() => {
    const node = mosaicRef.current;
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

  if (!chips.length) return null;

  const active = preview ?? selected;

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-background px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Skills & Expertise</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            The whole toolkit at once. Pick a discipline to see where it sits inside the rest.
          </p>
        </div>

        {/* Legend, and the filter control. */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setSelected(null)}
            onMouseEnter={() => setPreview(null)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active === null
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
          >
            All
          </button>

          {skillCategories.map((category, index) => {
            const isActive = active === index;

            return (
              <button
                key={category.name}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelected((current) => (current === index ? null : index))}
                onMouseEnter={() => setPreview(index)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(index)}
                onBlur={() => setPreview(null)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all
                  duration-300 focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-ring ${
                    isActive
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  } ${
                    // The reverse index: a hovered skill names its discipline here.
                    spotlight === index && !isActive ? 'border-primary/40 text-primary' : ''
                  }`}
              >
                {category.name}
                <span className="ml-1.5 tabular-nums opacity-60">{category.skills.length}</span>
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-4 text-center text-xs text-muted-foreground tabular-nums"
        >
          {active === null
            ? `${chips.length} skills across ${skillCategories.length} disciplines`
            : `${skillCategories[active].skills.length} skills in ${skillCategories[active].name}`}
        </p>

        <div ref={mosaicRef} className="mt-6">
          <ul className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {chips.map((chip, index) => {
              const dimmed = active !== null && chip.category !== active;
              const lit = active !== null && chip.category === active;

              return (
                <li
                  key={`${chip.category}-${chip.name}`}
                  // Wrapper owns the entrance so its long delay never slows the
                  // filter transition on the chip itself.
                  className={`transition-all duration-500 ease-out motion-reduce:transition-none
                    motion-reduce:opacity-100 motion-reduce:scale-100 ${
                      visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                  // A 9ms step over a hundred chips reads as one wave crossing
                  // the cloud rather than as items arriving in turn.
                  style={{ transitionDelay: `${Math.min(index * 9, 700)}ms` }}
                >
                  <span
                    onMouseEnter={() => setSpotlight(chip.category)}
                    onMouseLeave={() => setSpotlight(null)}
                    className={`inline-block rounded-full border transition-all duration-300 ease-out
                      motion-reduce:transform-none motion-reduce:transition-none ${
                        chip.emphasised
                          ? 'px-3 py-1.5 text-xs sm:text-sm font-semibold border-primary/30 bg-primary/10 text-primary'
                          : 'px-2.5 py-1 text-[11px] sm:text-xs border-border bg-secondary text-secondary-foreground'
                      } ${lit ? 'border-primary/60 shadow-[var(--shadow-card)]' : ''} ${
                        dimmed ? 'opacity-40 saturate-0 scale-[0.97]' : ''
                      }`}
                  >
                    {chip.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
