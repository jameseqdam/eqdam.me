import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Presentation } from 'lucide-react';
import SubPageLayout from '@/components/SubPageLayout';
import { articles } from '@/lib/content';

const Articles = () => {
  return (
    <SubPageLayout
      segments={[{ label: 'Home', to: '/' }, { label: 'Articles' }]}
      backLabel="Back to Home"
      backTo="/"
      title="Essays & Articles"
      intro="Published writing on enterprise UX, conversational AI, trust, and the changing shape of design work."
    >
      <div className="space-y-6 lg:space-y-8">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="portfolio-card group block bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm text-muted-foreground">
              <span>{article.publishDate}</span>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
              {article.deck && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                  <Presentation className="h-3 w-3" />
                  {article.deck.slides.length}-slide {article.deck.kicker.toLowerCase()}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold leading-snug mb-3 transition-colors group-hover:text-primary">
              {article.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              {article.deck ? 'View the deck' : 'Read article'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </SubPageLayout>
  );
};

export default Articles;
