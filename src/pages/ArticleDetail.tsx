import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import SubPageLayout from '@/components/SubPageLayout';
import Markdown from '@/components/Markdown';
import { articles, getArticle } from '@/lib/content';

const ArticleDetail = () => {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <SubPageLayout
        segments={[
          { label: 'Home', to: '/' },
          { label: 'Articles', to: '/articles' },
          { label: 'Not found' },
        ]}
        backLabel="Back to Articles"
        backTo="/articles"
        title="Article not found"
        intro="This article does not exist or may have been renamed."
      >
        <Link
          to="/articles"
          className="portfolio-button portfolio-button-primary gap-2 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse all articles
        </Link>
      </SubPageLayout>
    );
  }

  const currentIndex = articles.findIndex((entry) => entry.slug === article.slug);
  const nextArticle = articles[(currentIndex + 1) % articles.length];

  const meta = (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span>{article.publishDate}</span>
      <span aria-hidden="true">•</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {article.readTime}
      </span>
    </div>
  );

  return (
    <SubPageLayout
      segments={[
        { label: 'Home', to: '/' },
        { label: 'Articles', to: '/articles' },
        { label: article.title },
      ]}
      backLabel="Back to Articles"
      backTo="/articles"
      title={article.title}
      intro={article.excerpt}
      meta={meta}
    >
      <article>
        <Markdown content={article.bodyMarkdown} />

        <div className="mt-10 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {article.originalUrl && (
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Read the original publication
          </a>
        )}
      </article>

      {nextArticle && nextArticle.slug !== article.slug && (
        <section className="border-t border-border mt-12 pt-8">
          <p className="text-sm text-muted-foreground mb-2">Next article</p>
          <Link
            to={`/articles/${nextArticle.slug}`}
            className="group inline-flex items-start gap-2 text-lg sm:text-xl font-semibold transition-colors hover:text-primary"
          >
            {nextArticle.title}
            <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      )}
    </SubPageLayout>
  );
};

export default ArticleDetail;
