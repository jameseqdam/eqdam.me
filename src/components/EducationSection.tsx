import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import { sectionCtaClasses } from './SectionCta';
import { education, researchItems } from '@/lib/content';

const degrees = [...education.degrees].sort((a, b) => b.year - a.year);

const publicationCount = researchItems.length;
const years = researchItems.map((item) => item.year);
const firstYear = Math.min(...years);
const lastYear = Math.max(...years);

/**
 * Part-to-whole, so a stacked bar — but this design system has one hue and no
 * categorical palette, and inventing three brand colours for a portfolio would
 * be a worse trade than reading the three classes off a single-hue ordinal ramp.
 * The alphas below are the validated steps: composited against both the light and
 * the dark surface they hold monotone lightness, adjacent ΔL ≥ 0.06, and clear
 * the 2:1 light-end contrast floor. Identity comes from the legend, not the hue.
 */
const segments = [
  {
    label: 'Journal articles',
    count: researchItems.filter((item) => item.type === 'Journal Article').length,
    alpha: 1,
  },
  {
    label: 'Conference papers',
    count: researchItems.filter((item) => item.type === 'Conference Paper').length,
    alpha: 0.75,
  },
  {
    label: 'Theses',
    count: researchItems.filter((item) => item.type.includes('Thesis')).length,
    alpha: 0.55,
  },
].filter((segment) => segment.count > 0);

/**
 * Education and the research record, side by side.
 *
 * Two mechanisms, neither of them borrowed from the sections above. The degrees
 * are a vertical ladder whose spine fills as it scrolls past the reader, each
 * step lighting when it crosses the upper part of the viewport — so the motion is
 * driven by scroll position rather than by a single reveal or a hover. The
 * publication record is a proportion bar that grows its segments from the
 * baseline, standing in for the six publication cards this section used to list.
 */
const EducationSection = () => {
  const ladderRef = useRef<HTMLOListElement>(null);
  const recordRef = useRef<HTMLDivElement>(null);
  const [litCount, setLitCount] = useState(0);
  const [recordVisible, setRecordVisible] = useState(false);

  useEffect(() => {
    const node = ladderRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setLitCount(degrees.length);
      return;
    }

    const steps = Array.from(node.querySelectorAll('[data-step]'));

    // Bottom margin pulled up past halfway, so a step counts as reached once it
    // has scrolled into the upper part of the viewport rather than merely peeked
    // in. Lit steps stay lit: a spine that drains on the way back up reads as a
    // glitch, not as progress.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = steps.indexOf(entry.target);
          setLitCount((current) => Math.max(current, index + 1));
        });
      },
      { rootMargin: '0px 0px -55% 0px' },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = recordRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRecordVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRecordVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" className="py-12 sm:py-16 lg:py-20 section-gradient px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-10 lg:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Education & Publications</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Three degrees and {publicationCount} publications, {firstYear} to {lastYear}.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Degrees: the scroll-lit ladder. */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Academic Background
            </h3>

            <ol ref={ladderRef} className="relative">
              {/* Track, and the fill that climbs it. */}
              <span
                aria-hidden="true"
                className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
              />
              <span
                aria-hidden="true"
                style={{ height: `${(litCount / degrees.length) * 100}%` }}
                className="absolute left-[7px] top-2 w-px bg-primary transition-[height] duration-700
                  ease-out motion-reduce:transition-none"
              />

              {degrees.map((entry, index) => {
                const lit = index < litCount;

                return (
                  <li key={entry.year} data-step className="relative pl-8 pb-7 last:pb-0">
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2
                        transition-all duration-500 ease-out motion-reduce:transition-none ${
                          lit
                            ? 'border-primary bg-primary scale-100'
                            : 'border-border bg-background scale-90'
                        }`}
                    />

                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h4 className="font-semibold text-sm sm:text-base">{entry.degree}</h4>
                      <span
                        className={`text-sm tabular-nums transition-colors duration-500 ${
                          lit ? 'text-primary font-semibold' : 'text-muted-foreground'
                        }`}
                      >
                        {entry.year}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.institution} · {entry.location}
                    </p>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                      {entry.note}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Publications: the proportion bar. */}
          <div ref={recordRef}>
            <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Research Record
            </h3>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold tabular-nums text-primary">
                {publicationCount}
              </span>
              <span className="text-sm text-muted-foreground">
                publications
                <br />
                {firstYear} – {lastYear}
              </span>
            </div>

            {/*
              Thin mark, square at the baseline and 4px rounded at the data end,
              with a 2px gap in the surface colour doing the separating — no
              strokes around the segments.
            */}
            <div className="mt-5 flex h-2.5 gap-[2px] overflow-hidden rounded-r">
              {segments.map((segment, index) => (
                <span
                  key={segment.label}
                  title={`${segment.count} ${segment.label.toLowerCase()}`}
                  style={{
                    width: recordVisible
                      ? `${(segment.count / publicationCount) * 100}%`
                      : '0%',
                    backgroundColor: `hsl(var(--primary) / ${segment.alpha})`,
                    transitionDelay: `${index * 120}ms`,
                  }}
                  className="h-full transition-[width] duration-700 ease-out
                    motion-reduce:transition-none"
                />
              ))}
            </div>

            {/* Legend carries identity and the values, so the segments need no
                inline labels they are too narrow to hold. */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {segments.map((segment) => (
                <li key={segment.label} className="flex items-center gap-2 text-xs sm:text-sm">
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: `hsl(var(--primary) / ${segment.alpha})` }}
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                  />
                  <span className="tabular-nums font-semibold">{segment.count}</span>
                  <span className="text-muted-foreground">{segment.label}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Published in</span>{' '}
              {education.venueHighlights.join(' · ')} and others.
            </p>
          </div>
        </div>

        {/* Certifications: a line, where four cards used to be. */}
        <p className="mt-10 lg:mt-14 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs sm:text-sm text-muted-foreground">
          <Award aria-hidden="true" className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Certified in</span>
          <span>{education.certifications.join(' · ')}</span>
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link to="/research" className={sectionCtaClasses()}>
            Browse Academic Publications
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <a
            href="https://scholar.google.com/citations?user=AijTeogAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className={sectionCtaClasses()}
          >
            Publications on Google Scholar
            <ExternalLink
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
