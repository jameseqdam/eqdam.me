import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCta from './SectionCta';
import { articles } from '@/lib/content';

/**
 * Opening sentence, capped. The row reserves two lines for it and clamps the
 * overflow, so the cap only has to stop a runaway paragraph, not fit exactly.
 */
const teaser = (excerpt: string) => {
  const sentence = excerpt.split(/(?<=\.)\s/)[0];
  return sentence.length > 170 ? `${sentence.slice(0, 167).trimEnd()}…` : sentence;
};

const entries = articles.map((article, index) => ({
  slug: article.slug,
  title: article.title,
  publishDate: article.publishDate,
  /** Slide count on the deck-native pieces, reading time on the prose ones. */
  format: article.deck ? `${article.deck.slides.length} slides` : article.readTime,
  /** Two tags is enough to place a piece; the article page carries the rest. */
  tags: article.tags.slice(0, 2),
  teaser: teaser(article.excerpt),
  ordinal: String(index + 1).padStart(2, '0'),
}));

/**
 * The essays, as the index of the page they lead to.
 *
 * This section used to be a headline and a button — a promise with nothing
 * behind it. Now every essay is named before you click, so the button leads
 * somewhere you have already seen.
 *
 * The motion is typesetting, which is nothing like the rest of the page. Rows
 * settle upward in sequence and each hairline rule sweeps out to the right just
 * behind its row, so the index appears to be ruled onto the page a line at a
 * time. Then a single marker travels between rows as the pointer moves — one
 * continuous object covering a discrete choice — and the row's second line swaps
 * from its date and tags to its opening sentence. Every row keeps that line at a
 * fixed height, so nothing on the page shifts while you read down the list.
 */
const ThoughtLeadershipSection = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (observed) => {
        if (observed.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // The marker is measured rather than computed, because rows grow taller when a
  // long title wraps and a hardcoded row height would drift away from them.
  useEffect(() => {
    const place = () => {
      const row = rowRefs.current[active];
      if (!row) return;
      setMarker({ top: row.offsetTop, height: row.offsetHeight });
    };

    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  if (!entries.length) return null;

  return (
    <section id="articles" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Thought Leadership</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {entries.length} essays on enterprise UX, conversational AI, and the changing shape of
            design work — every one of them listed below.
          </p>
        </div>

        <ul ref={listRef} className="relative mx-auto max-w-3xl">
          {/* The travelling marker. */}
          <span
            aria-hidden="true"
            style={marker ? { transform: `translateY(${marker.top}px)`, height: marker.height } : undefined}
            className={`absolute left-0 top-0 w-[2px] rounded-full bg-primary transition-all
              duration-500 ease-out motion-reduce:transition-none ${
                marker && visible ? 'opacity-100' : 'opacity-0'
              }`}
          />

          {entries.map((entry, index) => {
            const isActive = active === index;
            const delay = index * 70;

            return (
              <li
                key={entry.slug}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
                onMouseEnter={() => setActive(index)}
                className="relative"
              >
                <Link
                  to={`/articles/${entry.slug}`}
                  onFocus={() => setActive(index)}
                  style={{ transitionDelay: `${delay}ms` }}
                  className={`group block rounded-sm py-4 pl-5 pr-1 transition-all duration-500
                    ease-out focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring motion-reduce:transition-none
                    motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                >
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-xs tabular-nums transition-colors duration-300 ${
                        isActive ? 'text-primary font-semibold' : 'text-muted-foreground/70'
                      }`}
                    >
                      {entry.ordinal}
                    </span>

                    <h3
                      className={`flex-1 text-sm font-semibold leading-snug transition-colors
                        duration-300 sm:text-base ${isActive ? 'text-primary' : ''}`}
                    >
                      {entry.title}
                    </h3>

                    <span className="hidden shrink-0 text-xs text-muted-foreground tabular-nums sm:block">
                      {entry.format}
                    </span>
                  </div>

                  {/*
                    One slot, two lines high, holding whichever of the two lines
                    is called for. Reserving it is what keeps the list still.
                  */}
                  <div className="relative mt-1.5 h-10 overflow-hidden pl-[1.9rem] sm:pl-[2.4rem]">
                    <p
                      className={`absolute inset-x-0 top-0 text-xs leading-relaxed text-muted-foreground
                        transition-all duration-300 ease-out motion-reduce:transition-none
                        motion-reduce:translate-y-0 ${
                          isActive ? '-translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                        }`}
                    >
                      {entry.publishDate} · {entry.tags.join(' · ')}
                    </p>
                    <p
                      className={`absolute inset-x-0 top-0 line-clamp-2 text-xs leading-relaxed
                        text-foreground/80 transition-all duration-300 ease-out
                        motion-reduce:transition-none motion-reduce:translate-y-0 ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                        }`}
                    >
                      {entry.teaser}
                    </p>
                  </div>
                </Link>

                {/* The rule, sweeping out just behind its row. */}
                <span
                  aria-hidden="true"
                  style={{ transitionDelay: `${delay + 120}ms` }}
                  className={`block h-px origin-left bg-border transition-transform duration-700
                    ease-out motion-reduce:transition-none motion-reduce:scale-x-100 ${
                      visible ? 'scale-x-100' : 'scale-x-0'
                    }`}
                />
              </li>
            );
          })}
        </ul>

        <SectionCta to="/articles">Read All Essays &amp; Articles</SectionCta>
      </div>
    </section>
  );
};

export default ThoughtLeadershipSection;
