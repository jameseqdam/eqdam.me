import { Award, Calendar, TrendingUp } from 'lucide-react';
import SubPageLayout from '@/components/SubPageLayout';
import { experience } from '@/lib/content';

const Experience = () => {
  const timeline = [...experience.timeline].sort((a, b) => b.year - a.year);

  return (
    <SubPageLayout
      segments={[{ label: 'Home', to: '/' }, { label: 'Experience' }]}
      backLabel="Back to Home"
      backTo="/"
      title="Leadership Timeline"
      intro={experience.summary}
    >
      {/* Key milestones */}
      <section className="mb-14 lg:mb-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 lg:mb-8 flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Key Milestones
        </h2>

        <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
          {experience.keyMilestones.map((milestone) => (
            <div key={milestone.milestone} className="portfolio-card bg-background">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-semibold leading-snug">{milestone.milestone}</h3>
                <span className="flex-shrink-0 text-xs sm:text-sm text-primary font-medium">
                  {milestone.year}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">
                {milestone.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Year-by-year timeline */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 lg:mb-8 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Year by Year
        </h2>

        <div className="space-y-6 lg:space-y-8">
          {timeline.map((entry) => (
            <article key={entry.year} className="portfolio-card bg-background">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">{entry.role}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{entry.company}</p>
                </div>
                <div className="flex flex-col lg:items-end gap-1">
                  <span className="text-primary font-semibold whitespace-nowrap">
                    {entry.period ?? entry.year}
                  </span>
                  {entry.rating && (
                    <span className="text-xs sm:text-sm text-muted-foreground">{entry.rating}</span>
                  )}
                </div>
              </div>

              <p
                className={`text-sm sm:text-base text-muted-foreground leading-relaxed text-justify hyphens-auto ${
                  entry.achievements?.length || entry.productImpact?.length ? 'mb-6' : ''
                }`}
              >
                {entry.summary}
              </p>

              {/* Early roles carry a summary only, so each block stands on its own. */}
              <div className="grid gap-6 lg:grid-cols-2 empty:hidden">
                {entry.achievements?.length ? (
                  <div>
                    <h4 className="font-semibold text-primary mb-3 text-sm sm:text-base">
                      Achievements
                    </h4>
                    <ul className="space-y-2 list-disc pl-5">
                      {entry.achievements.map((achievement, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto pl-1"
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {entry.productImpact?.length ? (
                  <div>
                    <h4 className="font-semibold text-primary mb-3 text-sm sm:text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Product Impact
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.productImpact.map((product) => (
                        <span
                          key={product}
                          className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </SubPageLayout>
  );
};

export default Experience;
