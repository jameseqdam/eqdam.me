import { ExternalLink } from 'lucide-react';
import SubPageLayout from '@/components/SubPageLayout';
import { researchItems } from '@/lib/content';

const TYPE_ORDER = ['PhD Thesis', 'Master Thesis', 'Journal Article', 'Conference Paper'];

const Research = () => {
  const years = researchItems.map((item) => item.year);
  const groups = TYPE_ORDER.map((type) => ({
    type,
    items: researchItems.filter((item) => item.type === type),
  })).filter((group) => group.items.length > 0);

  // Anything with an unexpected type still gets rendered rather than silently dropped.
  const ungrouped = researchItems.filter((item) => !TYPE_ORDER.includes(item.type));
  if (ungrouped.length) {
    groups.push({ type: 'Other', items: ungrouped });
  }

  return (
    <SubPageLayout
      segments={[{ label: 'Home', to: '/' }, { label: 'Research' }]}
      backLabel="Back to Home"
      backTo="/"
      title="Academic Publications"
      intro={`${researchItems.length} peer-reviewed publications and theses spanning ${Math.min(
        ...years,
      )} to ${Math.max(...years)}, covering consumer health informatics, cognitive accessibility, usability evaluation, and clinical decision support.`}
    >
      <div className="space-y-12 lg:space-y-16">
        {groups.map((group) => (
          <section key={group.type}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 lg:mb-8">
              {group.type}
              <span className="ml-3 text-sm font-normal text-muted-foreground">
                {group.items.length}
              </span>
            </h2>

            <div className="space-y-6">
              {group.items.map((item) => (
                <article key={item.title} className="portfolio-card bg-background">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {item.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground italic mb-1">{item.venue}</p>
                  <p className="text-sm text-muted-foreground mb-4">{item.authors}</p>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-justify hyphens-auto">
                    {item.abstract}
                  </p>

                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.doi && (
                    <a
                      href={item.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View publication
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SubPageLayout>
  );
};

export default Research;
