import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  /** Path under /images/companies, e.g. "/images/companies/coupa.svg". */
  src: string;
  company: string;
  className?: string;
}

/**
 * Company logo on a fixed white plate.
 *
 * The logos are official full-colour brand marks drawn for a white ground, and
 * several are near-black (Cambio, Optimizely, Karolinska). Inverting or
 * recolouring them in dark mode would misrepresent the brands, so the plate
 * itself stays white in both themes and only its border adapts.
 */
const CompanyLogo = ({ src, company, className }: CompanyLogoProps) => (
  <span
    className={cn(
      'inline-flex h-12 flex-shrink-0 items-center justify-center rounded-lg',
      'border border-border bg-white px-3 shadow-sm dark:border-white/15',
      className
    )}
  >
    <img
      src={src}
      alt={`${company} logo`}
      loading="lazy"
      decoding="async"
      className="h-8 w-auto max-w-[120px] object-contain flex-shrink-0"
    />
  </span>
);

export default CompanyLogo;
