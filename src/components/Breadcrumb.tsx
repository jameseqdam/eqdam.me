import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface BreadcrumbSegment {
  label: string;
  /** Omit on the final segment so it renders as the current page. */
  to?: string;
}

interface BreadcrumbProps {
  /** Full trail including the leading "Home" segment. */
  segments: BreadcrumbSegment[];
  /** Quick action anchor, e.g. "Back to Case Studies". */
  backLabel: string;
  backTo: string;
}

const Breadcrumb = ({ segments, backLabel, backTo }: BreadcrumbProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="portfolio-container px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 sm:py-4">
          <Link
            to={backTo}
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary w-fit"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>

          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;

              return (
                <li key={`${segment.label}-${index}`} className="flex items-center gap-x-2 min-w-0">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-border select-none">
                      /
                    </span>
                  )}
                  {segment.to && !isLast ? (
                    <Link
                      to={segment.to}
                      className="transition-colors hover:text-primary whitespace-nowrap"
                    >
                      {segment.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className="font-medium text-foreground truncate max-w-[16rem] sm:max-w-sm lg:max-w-md"
                      title={segment.label}
                    >
                      {segment.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
