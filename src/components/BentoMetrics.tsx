import { useEffect, useRef, useState, MouseEvent } from 'react';

export interface Metric {
  value: string;
  label: string;
}

interface BentoMetricsProps {
  metrics: Metric[];
  /** Card promoted to the wide bento tile. Defaults to the first metric. */
  featureIndex?: number;
}

interface MetricCardProps {
  metric: Metric;
  featured: boolean;
  index: number;
  visible: boolean;
}

/**
 * Tracks the cursor inside the card and publishes it as CSS custom properties.
 * Writing straight to the node keeps every mousemove off the React render path.
 */
const handleSpotlight = (event: MouseEvent<HTMLDivElement>) => {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
};

const MetricCard = ({ metric, featured, index, visible }: MetricCardProps) => {
  return (
    // Outer wrapper owns the staggered entrance so it never competes with the
    // hover lift transform on the card itself.
    <div
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        featured ? 'md:col-span-2' : ''
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        onMouseMove={handleSpotlight}
        className={`group relative h-full overflow-hidden rounded-lg border p-6 backdrop-blur-sm
          transition-[transform,box-shadow,border-color] duration-300 ease-out
          hover:-translate-y-1.5 hover:shadow-[var(--shadow-hover)]
          motion-reduce:transform-none motion-reduce:transition-none
          ${
            featured
              ? 'border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-card/70 hover:border-primary/50'
              : 'border-border/60 bg-card/70 hover:border-primary/40'
          }`}
      >
        {/* Cursor spotlight: follows the pointer, fades in on hover. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(240px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), hsl(var(--primary) / 0.14), transparent 65%)',
          }}
        />

        <div className="relative">
          <div
            className={`font-bold mb-2 ${
              featured
                ? 'portfolio-gradient-text text-4xl lg:text-5xl'
                : 'text-primary text-3xl lg:text-4xl'
            }`}
          >
            {metric.value}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed text-justify hyphens-auto">
            {metric.label}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Impact metrics laid out as a bento grid: one wide feature tile plus
 * single-span secondary tiles, revealed with a staggered scroll-in.
 */
const BentoMetrics = ({ metrics, featureIndex = 0 }: BentoMetricsProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = gridRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!metrics?.length) return null;

  return (
    <div ref={gridRef} className="grid gap-4 lg:gap-6 grid-cols-1 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <MetricCard
          key={`${metric.value}-${metric.label}`}
          metric={metric}
          featured={index === featureIndex}
          index={index}
          visible={visible}
        />
      ))}
    </div>
  );
};

export default BentoMetrics;
