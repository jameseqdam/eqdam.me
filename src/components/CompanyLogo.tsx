import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  /** Path under /images/companies, e.g. "/images/companies/coupa.svg". */
  src: string;
  company: string;
  /** 'sm' fits the fixed-width homepage rail nodes; 'md' is the sub-page plate. */
  size?: 'md' | 'sm';
  className?: string;
}

/**
 * The wide plate sizes itself to the logo; the small one is dropped into a fixed
 * width by its caller, so its image is capped by the plate rather than by a
 * pixel maximum of its own.
 */
const SIZES = {
  md: { plate: 'h-12 px-3', image: 'h-8 max-w-[120px] flex-shrink-0' },
  sm: { plate: 'h-11 px-2.5', image: 'h-5 max-w-full' },
};

/**
 * Company logo on a fixed white plate.
 *
 * The logos are official full-colour brand marks drawn for a white ground, and
 * several are near-black (Cambio, Optimizely, Karolinska). Inverting or
 * recolouring them in dark mode would misrepresent the brands, so the plate
 * itself stays white in both themes and only its border adapts.
 */
const CompanyLogo = ({ src, company, size = 'md', className }: CompanyLogoProps) => (
  <span
    className={cn(
      'inline-flex flex-shrink-0 items-center justify-center rounded-lg',
      'border border-border bg-white shadow-sm dark:border-white/15',
      SIZES[size].plate,
      className
    )}
  >
    <img
      src={src}
      alt={`${company} logo`}
      loading="lazy"
      decoding="async"
      className={cn('w-auto object-contain', SIZES[size].image)}
    />
  </span>
);

export default CompanyLogo;
