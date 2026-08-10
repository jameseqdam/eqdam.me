import { Link } from 'react-router-dom';

interface SectionCtaProps {
  to: string;
  children: string;
  /** Use the outline treatment on sections that already sit on a tinted background. */
  variant?: 'primary' | 'outline';
}

/**
 * Section-closing call to action that promotes a homepage summary to its
 * dedicated Level 2 page.
 */
const SectionCta = ({ to, children, variant = 'primary' }: SectionCtaProps) => {
  const variantClass =
    variant === 'outline' ? 'portfolio-button-outline' : 'portfolio-button-primary';

  return (
    <div className="mt-10 lg:mt-12 flex justify-center">
      <Link
        to={to}
        className={`portfolio-button ${variantClass} group gap-2 text-sm sm:text-base shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300`}
      >
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
