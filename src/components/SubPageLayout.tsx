import { ReactNode } from 'react';
import Navigation from './Navigation';
import SiteFooter from './SiteFooter';
import Breadcrumb, { BreadcrumbSegment } from './Breadcrumb';

interface SubPageLayoutProps {
  segments: BreadcrumbSegment[];
  backLabel: string;
  backTo: string;
  title: string;
  intro?: string;
  /** Rendered under the intro, e.g. category / timeline metadata. */
  meta?: ReactNode;
  children: ReactNode;
}

const SubPageLayout = ({
  segments,
  backLabel,
  backTo,
  title,
  intro,
  meta,
  children,
}: SubPageLayoutProps) => {
  return (
    <div className="relative">
      <Navigation />
      {/* Offsets the fixed top navigation: 68px on mobile (menu button), 60px from md up. */}
      <div className="pt-[68px] md:pt-[60px]">
        <Breadcrumb segments={segments} backLabel={backLabel} backTo={backTo} />

        <main>
          <header className="section-gradient border-b border-border px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
            <div className="portfolio-container">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl">
                {title}
              </h1>
              {intro && (
                <p className="mt-4 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed text-justify hyphens-auto">
                  {intro}
                </p>
              )}
              {meta && <div className="mt-6">{meta}</div>}
            </div>
          </header>

          <div className="px-4 sm:px-6 py-12 sm:py-16">
            <div className="portfolio-container">{children}</div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SubPageLayout;
