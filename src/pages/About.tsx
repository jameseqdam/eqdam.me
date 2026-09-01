import SubPageLayout from '@/components/SubPageLayout';
import Markdown from '@/components/Markdown';
import { about as aboutContent } from '@/lib/content';

const About = () => {
  return (
    <SubPageLayout
      segments={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      backLabel="Back to Home"
      backTo="/"
      title="Philosophy"
      intro={aboutContent.intro}
    >
      <div className="space-y-12 lg:space-y-16">
        {aboutContent.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4 lg:mb-6">
              {section.heading}
            </h2>
            <Markdown content={section.body} />
          </section>
        ))}

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 lg:mb-8">Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {aboutContent.values.map((value) => (
              <div key={value.title} className="portfolio-card bg-background text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <span className="text-xl sm:text-2xl">{value.emoji}</span>
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">{value.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SubPageLayout>
  );
};

export default About;
