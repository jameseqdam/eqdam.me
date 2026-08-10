import { Link } from 'react-router-dom';

interface SectionCtaProps {
  to: string;
  children: string;
  /** Use the outline treatment on sections that already sit on a tinted background. */
  variant?: 'primary' | 'outline';
}

/**
 * Shared so a section can lay out its own CTA row — e.g. an internal link beside
 * an external one — without the two drifting apart visually.
 */
export const sectionCtaClasses = (variant: 'primary' | 'outline' = 'primary') =>
  `portfolio-button ${
    variant === 'outline' ? 'portfolio-button-outline' : 'portfolio-button-primary'
  } group gap-2 text-sm sm:text-base shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300`;

/**
 * Section-closing call to action that promotes a homepage summary to its
 * dedicated Level 2 page.
 */
const SectionCta = ({ to, children, variant = 'primary' }: SectionCtaProps) => {
  return (
    <div className="mt-10 lg:mt-12 flex justify-center">
      <Link to={to} className={sectionCtaClasses(variant)}>
        {children}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>
  );
};

export default SectionCta;
