import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Presentation } from 'lucide-react';
import SubPageLayout from '@/components/SubPageLayout';
import BentoMetrics from '@/components/BentoMetrics';
import { getWorkItem, workItems } from '@/lib/content';
import { hasWalkthrough } from '@/lib/walkthrough';

const WorkDetail = () => {
  const { slug } = useParams();
  const item = getWorkItem(slug);

  if (!item) {
    return (
      <SubPageLayout
        segments={[{ label: 'Home', to: '/' }, { label: 'Work', to: '/work' }, { label: 'Not found' }]}
        backLabel="Back to Case Studies"
        backTo="/work"
        title="Case study not found"
        intro="This case study does not exist or may have been renamed."
      >
        <Link
          to="/work"
          className="portfolio-button portfolio-button-primary gap-2 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse all case studies
        </Link>
      </SubPageLayout>
    );
  }

  const currentIndex = workItems.findIndex((entry) => entry.slug === item.slug);
  const nextItem = workItems[(currentIndex + 1) % workItems.length];

  const meta = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">{item.category}</span>
        <span className="text-muted-foreground">{item.timeline}</span>
        <span aria-hidden="true" className="text-border">
          /
        </span>
        <span className="text-muted-foreground">{item.role}</span>
      </div>

      {/* The presenting version of this case study, behind a passphrase. */}
      {hasWalkthrough(item.slug) && (
        <Link
          to={`/work/${item.slug}/walkthrough`}
          className="portfolio-button portfolio-button-outline group gap-2 text-sm"
        >
          <Presentation className="h-4 w-4" />
          Walkthrough
          <Lock aria-hidden="true" className="h-3 w-3 text-muted-foreground" />
        </Link>
      )}
    </div>
  );

  return (
    <SubPageLayout
      segments={[
        { label: 'Home', to: '/' },
        { label: 'Work', to: '/work' },
        { label: item.title },
      ]}
      backLabel="Back to Case Studies"
      backTo="/work"
      title={item.title}
      intro={item.overview}
      meta={meta}
    >
      <div className="space-y-12 lg:space-y-16">
        {/* Impact metrics */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 lg:mb-8">Impact</h2>
          <BentoMetrics metrics={item.roiMetrics} />
        </section>

        {/* Narrative */}
        <section className="space-y-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3">
              The Problem
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-justify hyphens-auto">
              {item.problemStatement}
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3">The Solution</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-justify hyphens-auto">
              {item.solution}
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3">The Challenge</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-justify hyphens-auto">
              {item.challenge}
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Methodology</h2>
          <div className="flex flex-wrap gap-2">
            {item.methodology.map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </section>

        {/* Next case study */}
        {nextItem && nextItem.slug !== item.slug && (
          <section className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-2">Next case study</p>
            <Link
              to={`/work/${nextItem.slug}`}
              className="group inline-flex items-start gap-2 text-lg sm:text-xl font-semibold transition-colors hover:text-primary"
            >
              {nextItem.title}
              <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        )}
      </div>
    </SubPageLayout>
  );
};

export default WorkDetail;
