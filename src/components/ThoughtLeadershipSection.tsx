import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCta from './SectionCta';
import { articles } from '@/lib/content';

/**
 * Opening clause, capped. One line per row, so the cap only has to stop a
 * runaway sentence — the clamp trims whatever is left over at the current width.
 */
const teaser = (excerpt: string) => {
  const sentence = excerpt.split(/(?<=\.)\s/)[0];
  return sentence.length > 120 ? `${sentence.slice(0, 117).trimEnd()}…` : sentence;
};

const entries = articles.map((article, index) => ({
  slug: article.slug,
  title: article.title,
  /** Slide count on the deck-native pieces, reading time on the prose ones. */
  format: article.deck ? `${article.deck.slides.length} slides` : article.readTime,
  teaser: teaser(article.excerpt),
  ordinal: String(index + 1).padStart(2, '0'),
}));

/**
 * The essays, as the index of the page they lead to.
 *
 * This section used to be a headline and a button — a promise with nothing
 * behind it. Now every essay is named before you click, in two columns of
 * two-line entries, which is the compact form: a title, its format, and its
 * opening clause, with no dates and nothing that only appears on hover.
 *
 * The motion is typesetting, which is nothing like the rest of the page. Entries
 * settle upward in sequence and each hairline rule sweeps out to the right just
 * behind its own row, so the index appears to be ruled onto the page a line at a
 * time. Pointing at an entry re-rules it: a second rule in the accent colour
 * sweeps across the first.
 */
const ThoughtLeadershipSection = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState(false);

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

  if (!entries.length) return null;

  return (
    <section id="articles" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Thought Leadership</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {entries.length} essays and decks on enterprise UX, conversational AI, and the changing
            shape of design work.
          </p>
        </div>

        {/* Two columns, so six entries take three rows of height instead of six. */}
        <ol ref={listRef} className="mx-auto grid max-w-5xl sm:grid-cols-2 sm:gap-x-8 lg:gap-x-12">
          {entries.map((entry, index) => {
            const delay = index * 70;

            return (
              // The group lives on the row, not the link, so the rule underneath
              // can answer to the same hover and focus as the text above it.
              <li key={entry.slug} className="group">
                <Link
                  to={`/articles/${entry.slug}`}
                  style={{ transitionDelay: `${delay}ms` }}
                  className={`block rounded-sm pb-3 pt-3.5 transition-all duration-500 ease-out
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                    motion-reduce:transition-none motion-reduce:translate-y-0
                    motion-reduce:opacity-100 ${
                      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xs tabular-nums text-muted-foreground/70
                        transition-colors duration-300 group-hover:text-primary"
                    >
                      {entry.ordinal}
                    </span>
                    <h3
                      className="text-sm font-semibold leading-snug transition-colors duration-300
                        group-hover:text-primary sm:text-base"
                    >
                      {entry.title}
                    </h3>
                  </div>

                  <p className="mt-1 line-clamp-1 pl-[1.9rem] text-xs text-muted-foreground">
                    <span className="tabular-nums text-foreground/70">{entry.format}</span>
                    <span aria-hidden="true"> · </span>
                    {entry.teaser}
                  </p>
                </Link>

                {/* The rule, sweeping out just behind its row — then re-ruled in
                    the accent colour when the row is pointed at or focused. */}
                <div className="relative h-px">
                  <span
                    aria-hidden="true"
                    style={{ transitionDelay: `${delay + 120}ms` }}
                    className={`absolute inset-0 origin-left bg-border transition-transform
                      duration-700 ease-out motion-reduce:transition-none
                      motion-reduce:scale-x-100 ${visible ? 'scale-x-100' : 'scale-x-0'}`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 bg-primary
                      transition-transform duration-500 ease-out group-hover:scale-x-100
                      group-focus-within:scale-x-100 motion-reduce:transition-none"
                  />
                </div>
              </li>
            );
          })}
        </ol>

        <SectionCta to="/articles">Read All Essays &amp; Articles</SectionCta>
      </div>
    </section>
  );
};

export default ThoughtLeadershipSection;
