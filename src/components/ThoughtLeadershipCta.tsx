import SectionCta from './SectionCta';
import { articles } from '@/lib/content';

/**
 * The homepage has no Thought Leadership section, so this compact band carries
 * the entry point to the essays and articles index.
 */
const ThoughtLeadershipCta = () => {
  return (
    <section id="articles" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Thought Leadership</h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          {articles.length} published essays on enterprise UX, conversational AI, trust, and the
          changing shape of design work.
        </p>

        <SectionCta to="/articles">Read All Essays &amp; Articles</SectionCta>
      </div>
    </section>
  );
};

export default ThoughtLeadershipCta;
