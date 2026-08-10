import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SubPageLayout from '@/components/SubPageLayout';
import { workItems } from '@/lib/content';

const Work = () => {
  return (
    <SubPageLayout
      segments={[{ label: 'Home', to: '/' }, { label: 'Work' }]}
      backLabel="Back to Home"
      backTo="/"
      title="Selected Work"
      intro={`${workItems.length} case studies spanning enterprise UX, research operations, health technology, and AI strategy, each covering the problem, the approach, and the measured outcome.`}
    >
      <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
        {workItems.map((item) => (
          <Link
            key={item.slug}
            to={`/work/${item.slug}`}
            className="portfolio-card group flex flex-col bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                {item.category}
              </span>
              <span className="text-muted-foreground">{item.timeline}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-2 transition-colors group-hover:text-primary">
              {item.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{item.role}</p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-4">
              {item.overview}
            </p>

            <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Read case study
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </SubPageLayout>
  );
};

export default Work;
