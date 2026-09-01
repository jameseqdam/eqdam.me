import { useState } from 'react';
import SectionCta from './SectionCta';
import { about } from '@/lib/content';
import { renderInline } from '@/lib/inline';

/** Blank-line separated, as the bodies are authored in about.json. */
const panels = about.sections.map((section) => ({
  heading: section.heading,
  short: section.short,
  paragraphs: section.body.split(/\n{2,}/).map((line) => line.trim()).filter(Boolean),
}));

/**
 * The philosophy, one strand at a time.
 *
 * This was the last section still in the page's original shape: two tall cards
 * of prose side by side, then a separately headed row of three 64px emoji
 * plates. Stacked on a phone that came to six full-width blocks in a column, for
 * 220 words and three short phrases.
 *
 * Nothing has been cut. The two strands now share one panel behind a toggle
 * built from the same pills as the skills filter, and the values have lost their
 * heading and their plates but kept every word. Both panels stay in the grid
 * cell so its height is the taller of the two, which means switching can never
 * shift the page — and no magic number has to be maintained to promise that.
 */
const AboutSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">About Me</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {about.intro}
          </p>
        </div>

        {/* Toggle. Click only: switching under the pointer would move the
            paragraph out from under anyone reading it. */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {panels.map((panel, index) => {
            const isActive = index === active;

            return (
              <button
                key={panel.heading}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(index)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
              >
                {panel.short}
              </button>
            );
          })}
        </div>

        {/* One grid cell, both panels in it: the cell is as tall as the longer
            strand, so the toggle never jumps. `invisible` keeps the inactive
            one out of the tab order and out of the accessibility tree. */}
        <div className="mt-4 grid max-w-3xl mx-auto">
          {panels.map((panel, index) => (
            <div
              key={panel.heading}
              className={`col-start-1 row-start-1 rounded-lg border border-border bg-background
                p-4 sm:p-6 shadow-[var(--shadow-card)] transition-opacity duration-300
                motion-reduce:transition-none ${
                  index === active ? 'opacity-100' : 'invisible opacity-0'
                }`}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
                {panel.heading}
              </h3>
              <div className="space-y-3 lg:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {panel.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{renderInline(paragraph)}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core values: the same three, minus the heading and the plates. */}
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-6 max-w-3xl mx-auto">
          {about.values.map((value) => (
            <li key={value.title} className="text-center">
              <p className="text-sm font-semibold">
                <span aria-hidden="true" className="mr-1.5">
                  {value.emoji}
                </span>
                {value.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          English (fluent) · Swedish (professional)
        </p>

        <SectionCta to="/about">Read Full Philosophy</SectionCta>
      </div>
    </section>
  );
};

export default AboutSection;
