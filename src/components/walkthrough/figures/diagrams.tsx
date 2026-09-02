import { useMemo } from 'react';
import { ArrowRight, Check, Quote } from 'lucide-react';
import type { Figure } from '@/lib/walkthrough';
import { FigureFrame, SERIES, Shot, useReveal } from './primitives';

type Of<K extends Figure['kind']> = Extract<Figure, { kind: K }>;

/* ------------------------------------------------------------------ blueprint */

/**
 * Service blueprint, re-drawn.
 *
 * The source blueprints are single images six thousand pixels wide — unreadable
 * on a slide and unreadable in a lightbox. Rebuilding them as a grid means the
 * lanes wrap, the named lines (interaction, visibility, internal interaction)
 * stay put, and the whole thing reveals lane by lane as you talk down it.
 */
export const Blueprint = ({ figure }: { figure: Of<'blueprint'> }) => {
  const shown = useReveal(80);
  const columns = figure.stages.length;

  return (
    <FigureFrame caption={figure.caption}>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `minmax(96px, 0.7fr) repeat(${columns}, minmax(0, 1fr))` }}
          >
            <div />
            {figure.stages.map((stage, index) => (
              <p
                key={stage}
                className="rounded-sm bg-primary/10 px-2 py-1 text-center text-[10px] font-semibold
                  uppercase tracking-[0.08em] text-primary transition-opacity duration-500 sm:text-[11px]"
                style={{ opacity: shown ? 1 : 0, transitionDelay: `${index * 60}ms` }}
              >
                {stage}
              </p>
            ))}
          </div>

          {figure.lanes.map((lane, laneIndex) => {
            const divider = figure.dividers?.find((line) => line.after === lane.name);
            return (
              <div key={lane.name}>
                <div
                  className="mt-1.5 grid gap-1.5 transition-all [transition-duration:600ms] ease-out"
                  style={{
                    gridTemplateColumns: `minmax(96px, 0.7fr) repeat(${columns}, minmax(0, 1fr))`,
                    opacity: shown ? 1 : 0,
                    transform: shown ? 'none' : 'translateX(-6px)',
                    transitionDelay: `${180 + laneIndex * 110}ms`,
                  }}
                >
                  <div className="flex flex-col justify-center pr-1">
                    <p className="text-[10px] font-semibold leading-tight text-foreground sm:text-[11px]">
                      {lane.name}
                    </p>
                    {lane.role && (
                      <p className="text-[9px] leading-tight text-muted-foreground sm:text-[10px]">
                        {lane.role}
                      </p>
                    )}
                  </div>

                  {Array.from({ length: columns }, (_, column) => {
                    const step = lane.steps[column] ?? null;
                    return step ? (
                      <p
                        key={column}
                        className="rounded-sm border border-border bg-card px-2 py-1.5 text-[9.5px]
                          leading-snug text-muted-foreground sm:text-[10.5px]"
                      >
                        {step}
                      </p>
                    ) : (
                      <div key={column} className="rounded-sm bg-secondary/40" />
                    );
                  })}
                </div>

                {divider && (
                  <div
                    className="mt-1.5 flex items-center gap-2 transition-opacity duration-500"
                    style={{ opacity: shown ? 1 : 0, transitionDelay: `${260 + laneIndex * 110}ms` }}
                  >
                    <span className="h-px flex-1 border-t border-dashed border-primary/50" />
                    <span className="text-[9px] uppercase tracking-[0.1em] text-primary/80 sm:text-[10px]">
                      {divider.label}
                    </span>
                    <span className="h-px flex-1 border-t border-dashed border-primary/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FigureFrame>
  );
};

/* ----------------------------------------------------------------------- flow */

const FLOW_TONE = {
  primary: 'border-primary bg-primary text-primary-foreground',
  neutral: 'border-border bg-card text-foreground',
  accent: 'border-primary/40 bg-primary/10 text-primary',
  warn: 'border-amber-400/60 bg-amber-50 text-amber-900',
} as const;

/**
 * Node-and-edge diagram.
 *
 * Laid out on the declared column/row grid and connected with SVG paths measured
 * from grid fractions, so authoring a flow in JSON is a matter of saying where
 * each box sits rather than computing coordinates.
 */
export const Flow = ({ figure }: { figure: Of<'flow'> }) => {
  const shown = useReveal(80);

  const cols = Math.max(...figure.nodes.map((node) => node.col)) + 1;
  const rows = Math.max(...figure.nodes.map((node) => node.row)) + 1;

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    figure.nodes.forEach((node) => {
      map.set(node.id, {
        x: ((node.col + 0.5) / cols) * 100,
        y: ((node.row + 0.5) / rows) * 100,
      });
    });
    return map;
  }, [figure.nodes, cols, rows]);

  return (
    <FigureFrame caption={figure.caption}>
      <div className="relative w-full" style={{ aspectRatio: `${cols * 3} / ${rows * 1.35}` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {figure.edges.map((edge, index) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const path =
              from.y === to.y
                ? `M${from.x} ${from.y} L${to.x} ${to.y}`
                : `M${from.x} ${from.y} C${midX} ${from.y} ${midX} ${to.y} ${to.x} ${to.y}`;
            return (
              <path
                key={`${edge.from}-${edge.to}-${index}`}
                d={path}
                fill="none"
                stroke="hsl(var(--primary) / 0.4)"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={shown ? 0 : 1}
                style={{
                  transition: 'stroke-dashoffset 700ms ease-out',
                  transitionDelay: `${200 + index * 90}ms`,
                }}
              />
            );
          })}
        </svg>

        <div
          className="relative grid h-full w-full gap-1.5 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {figure.nodes.map((node, index) => (
            <div
              key={node.id}
              className={`flex items-center justify-center whitespace-pre-line rounded-md border px-2
                py-1.5 text-center text-[10px] font-medium leading-snug shadow-[var(--shadow-card)]
                transition-all duration-500 ease-out sm:text-xs
                ${FLOW_TONE[node.tone ?? 'neutral']}`}
              style={{
                gridColumn: node.col + 1,
                gridRow: node.row + 1,
                opacity: shown ? 1 : 0,
                transform: shown ? 'none' : 'scale(0.94)',
                transitionDelay: `${index * 70}ms`,
              }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
};

/* --------------------------------------------------------------------- phases */

/** The project ribbon: Planning & Defining → Ideation → Conceptualization → Development. */
export const Phases = ({ figure }: { figure: Of<'phases'> }) => {
  const shown = useReveal(80);

  return (
    <FigureFrame caption={figure.caption}>
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {figure.items.map((item, index) => {
          const active = figure.active === undefined || figure.active === index;
          return (
            <li
              key={item.label}
              className="flex flex-1 items-center gap-2 transition-all duration-500 ease-out"
              style={{
                opacity: shown ? (active ? 1 : 0.42) : 0,
                transform: shown ? 'none' : 'translateY(8px)',
                transitionDelay: `${index * 110}ms`,
              }}
            >
              <div
                className={`flex-1 rounded-md border px-3 py-2.5 sm:px-3.5 sm:py-3 ${
                  active
                    ? 'border-primary/40 bg-primary/10 shadow-[var(--shadow-card)]'
                    : 'border-border bg-card'
                }`}
              >
                <p
                  className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-1 text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  {item.label}
                </p>
                {item.detail && (
                  <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                    {item.detail}
                  </p>
                )}
              </div>
              {index < figure.items.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="hidden h-4 w-4 shrink-0 text-primary/45 sm:mx-1 sm:block"
                />
              )}
            </li>
          );
        })}
      </ol>
    </FigureFrame>
  );
};

/* -------------------------------------------------------------------- journey */

/** Journey map. Phases across, observation rows down. */
export const Journey = ({ figure }: { figure: Of<'journey'> }) => {
  const shown = useReveal(80);
  const columns = figure.phases.length;
  const template = `minmax(80px, 0.62fr) repeat(${columns}, minmax(0, 1fr))`;

  return (
    <FigureFrame caption={figure.caption}>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px] space-y-1.5">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: template }}>
            <div />
            {figure.phases.map((phase, index) => (
              <p
                key={phase}
                className="rounded-sm bg-gradient-to-r from-primary/15 to-primary/5 px-2 py-1.5
                  text-center text-[10px] font-semibold leading-tight text-primary
                  transition-opacity duration-500 sm:text-[11px]"
                style={{ opacity: shown ? 1 : 0, transitionDelay: `${index * 60}ms` }}
              >
                {phase}
              </p>
            ))}
          </div>

          {figure.rows.map((row, rowIndex) => (
            <div
              key={row.label}
              className="grid gap-1.5 transition-all duration-500 ease-out"
              style={{
                gridTemplateColumns: template,
                opacity: shown ? 1 : 0,
                transform: shown ? 'none' : 'translateX(-6px)',
                transitionDelay: `${180 + rowIndex * 110}ms`,
              }}
            >
              <p className="flex items-center text-[10px] font-semibold leading-tight text-foreground sm:text-[11px]">
                {row.label}
              </p>
              {row.cells.map((cell, cellIndex) => (
                <p
                  key={cellIndex}
                  className="rounded-sm border border-border bg-card px-2 py-1.5 text-[9.5px]
                    leading-snug text-muted-foreground sm:text-[10.5px]"
                >
                  {cell}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
};

/* -------------------------------------------------------------------- network */

/**
 * Social network graph.
 *
 * Not real coordinates — the study's own graph is 1,310 nodes and would render
 * as a smudge. This draws the *proportion*: how much of a community is visibly
 * active. Positions come from a seeded generator so the picture never jumps
 * between renders, and only the highlighted share lights up.
 */
export const Network = ({ figure }: { figure: Of<'network'> }) => {
  const shown = useReveal(100);

  const points = useMemo(() => {
    // Mulberry32. Deterministic, and small enough to read.
    let state = (figure.seed ?? 42) >>> 0;
    const random = () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    return Array.from({ length: figure.nodes }, (_, index) => {
      // Golden-angle spiral, jittered: even coverage without visible rings.
      const t = (index + 0.5) / figure.nodes;
      const radius = Math.sqrt(t) * 46 + random() * 3;
      const angle = index * 2.399963;
      return {
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle) * 0.86,
        r: 0.9 + random() * 1.1,
        active: index < figure.highlight,
        delay: random() * 700,
      };
    });
  }, [figure.nodes, figure.highlight, figure.seed]);

  return (
    <FigureFrame caption={figure.caption}>
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="0 0 100 100" className="w-full max-w-[min(100%,460px)]" role="img">
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={point.r}
              fill={point.active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.28)'}
              style={{
                opacity: shown ? (point.active ? 0.9 : 0.55) : 0,
                transition: 'opacity 600ms ease-out',
                transitionDelay: `${point.delay}ms`,
              }}
            />
          ))}
        </svg>

        {figure.legend && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">{figure.legend[0]}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">{figure.legend[1]}</span>
            </span>
          </div>
        )}
      </div>
    </FigureFrame>
  );
};

/* ------------------------------------------------------------------- swatches */

/**
 * Interface inventory.
 *
 * The argument for a design system is rarely made by describing inconsistency;
 * it is made by putting forty-one variants of one button on a wall. This draws
 * the count as actual swatches, so the number is felt rather than read.
 */
export const Swatches = ({ figure }: { figure: Of<'swatches'> }) => {
  const shown = useReveal(80);

  const tone = (which: 'grey' | 'blue' | 'mixed', index: number) => {
    if (which === 'blue') return `hsl(211 100% ${38 + ((index * 7) % 38)}%)`;
    if (which === 'grey') return `hsl(213 ${4 + ((index * 3) % 12)}% ${34 + ((index * 11) % 52)}%)`;
    return SERIES[index % SERIES.length];
  };

  return (
    <FigureFrame caption={figure.caption}>
      <div className="space-y-3">
        {figure.groups.map((group, groupIndex) => (
          <div key={group.label}>
            <div className="mb-1.5 flex items-baseline gap-2">
              <p className="text-sm font-bold text-primary tabular-nums">{group.count}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{group.label}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: group.count }, (_, index) => (
                <span
                  key={index}
                  className="h-4 w-7 rounded-[3px] transition-all [transition-duration:400ms] ease-out sm:h-5 sm:w-9"
                  style={{
                    background: tone(group.tone, index),
                    opacity: shown ? 1 : 0,
                    transform: shown ? 'none' : 'scale(0.7)',
                    transitionDelay: `${groupIndex * 160 + index * 22}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </FigureFrame>
  );
};

/* ---------------------------------------------------------------------- track */

/** Iteration track, with the pivot called out where the design actually changed. */
export const Track = ({ figure }: { figure: Of<'track'> }) => {
  const shown = useReveal(80);

  return (
    <FigureFrame caption={figure.caption}>
      <div className="space-y-4">
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[13px] h-0.5 bg-primary/25 transition-[width] [transition-duration:900ms] ease-out"
            style={{ width: shown ? '100%' : '0%' }}
          />
          <div className="relative flex gap-2">
            {figure.segments.map((segment, index) => (
              <div
                key={segment.range}
                className="flex-1 transition-all duration-500 ease-out"
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'none' : 'translateY(8px)',
                  transitionDelay: `${index * 130}ms`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary sm:text-[11px]">
                    {segment.range}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  {segment.label}
                </p>
                <p className="mt-1 text-[10.5px] leading-snug text-muted-foreground sm:text-[11.5px]">
                  {segment.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {figure.pivot && (
          <div
            className="rounded-md border-l-2 border-primary bg-primary/[0.07] px-3 py-2.5 transition-all
              [transition-duration:600ms] ease-out sm:px-4"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(8px)',
              transitionDelay: `${figure.segments.length * 130 + 120}ms`,
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
              {figure.pivot.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-foreground sm:text-sm">
              {figure.pivot.detail}
            </p>
          </div>
        )}
      </div>
    </FigureFrame>
  );
};

/* ------------------------------------------------------------------ reduction */

/**
 * Many steps collapsing into one.
 *
 * The whole value of a one-time setup is a ratio, so both sides are drawn as
 * countable tiles — forty on the left, one on the right — and the arrow between
 * does the arguing. Every tile is real: the grid gets denser as the count rises
 * rather than the count getting rounded down to fit, because a tile block that
 * undercounts is a chart that lies.
 */
export const Reduction = ({ figure }: { figure: Of<'reduction'> }) => {
  const shown = useReveal(100);

  const Side = ({
    side,
    tone,
    baseDelay,
  }: {
    side: Of<'reduction'>['from'];
    tone: 'muted' | 'primary';
    baseDelay: number;
  }) => {
    const columns = side.count > 24 ? 8 : side.count > 6 ? 4 : side.count > 2 ? 3 : 1;
    // Stagger the whole block over a fixed budget, so forty tiles do not take
    // twenty times as long to arrive as two.
    const step = Math.min(45, 700 / Math.max(1, side.count));

    return (
      <div className="flex-1">
        <p className="mb-2 text-center text-xs font-semibold text-foreground sm:text-sm">
          {side.label}
        </p>
        <div
          className="mx-auto grid justify-center gap-1"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            maxWidth: columns >= 8 ? '210px' : columns === 4 ? '180px' : '140px',
          }}
        >
          {Array.from({ length: side.count }, (_, index) => (
            <span
              key={index}
              className={`rounded-sm transition-all [transition-duration:400ms] ease-out ${
                columns >= 8 ? 'h-4 sm:h-5' : 'h-8 sm:h-9'
              } ${tone === 'primary' ? 'bg-primary' : 'border border-border bg-secondary'}`}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'none' : 'scale(0.7)',
                transitionDelay: `${baseDelay + index * step}ms`,
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-2xl font-bold text-primary tabular-nums sm:text-3xl">
          {side.count}
        </p>
        {side.note && (
          <p className="mt-0.5 text-center text-[10.5px] leading-snug text-muted-foreground sm:text-[11.5px]">
            {side.note}
          </p>
        )}
      </div>
    );
  };

  return (
    <FigureFrame caption={figure.caption}>
      <div className="flex items-center gap-3 sm:gap-6">
        <Side side={figure.from} tone="muted" baseDelay={0} />
        <ArrowRight
          aria-hidden="true"
          className="h-6 w-6 shrink-0 text-primary transition-all duration-500 sm:h-8 sm:w-8"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? 'none' : 'translateX(-8px)',
            transitionDelay: '520ms',
          }}
        />
        <Side side={figure.to} tone="primary" baseDelay={640} />
      </div>
    </FigureFrame>
  );
};

/* --------------------------------------------------------------------- layers */

/** Architecture layers, offset so the stack reads as a stack. */
export const Layers = ({ figure }: { figure: Of<'layers'> }) => {
  const shown = useReveal(80);

  return (
    <FigureFrame caption={figure.caption}>
      <div className="space-y-1.5">
        {figure.items.map((item, index) => (
          <div
            key={item.label}
            className="flex items-baseline gap-3 rounded-md border border-border bg-card px-3 py-2.5
              shadow-[var(--shadow-card)] transition-all duration-500 ease-out sm:px-4"
            style={{
              marginLeft: `${index * 5}%`,
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateX(-12px)',
              transitionDelay: `${index * 110}ms`,
              background: `hsl(var(--primary) / ${0.05 + index * 0.045})`,
            }}
          >
            <span className="text-[10px] font-bold text-primary tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight text-foreground sm:text-sm">
                {item.label}
              </p>
              <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground sm:text-[11.5px]">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </FigureFrame>
  );
};

/* ---------------------------------------------------------------------- quote */

/** A participant, quoted. The only figure that is purely typographic. */
export const PullQuote = ({ figure }: { figure: Of<'quote'> }) => {
  const shown = useReveal(120);

  return (
    <figure
      className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center
        transition-all duration-700 ease-out"
      style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(10px)' }}
    >
      <Quote aria-hidden="true" className="mb-4 h-7 w-7 text-primary/35 sm:h-9 sm:w-9" />
      <blockquote className="text-lg font-medium leading-snug text-foreground sm:text-2xl lg:text-3xl">
        “{figure.text}”
      </blockquote>
      {figure.attribution && (
        <figcaption className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground sm:text-sm">
          {figure.attribution}
        </figcaption>
      )}
    </figure>
  );
};

/* ------------------------------------------------------------------- personas */

/** Two personas, compared column by column so the contrast is the content. */
export const Personas = ({ figure }: { figure: Of<'personas'> }) => (
  <FigureFrame caption={figure.caption}>
    <div className={`grid gap-3 ${figure.items.length > 1 ? 'sm:grid-cols-2' : ''} sm:gap-4`}>
      {figure.items.map((persona, index) => (
        <PersonaCard key={persona.name} persona={persona} index={index} />
      ))}
    </div>
  </FigureFrame>
);

const PersonaCard = ({
  persona,
  index,
}: {
  persona: Of<'personas'>['items'][number];
  index: number;
}) => {
  const shown = useReveal(index * 140);

  return (
    <div
      className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-3.5 shadow-[var(--shadow-card)]
        transition-all [transition-duration:600ms] ease-out sm:p-4"
      style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(10px)' }}
    >
      {persona.src && (
        <Shot
          shot={{ src: persona.src, alt: `${persona.name} persona` }}
          frame="paper"
          index={index}
          className="mb-3"
        />
      )}
      <p className="text-sm font-bold text-foreground sm:text-base">{persona.name}</p>
      <p className="mt-1 text-[11px] italic leading-snug text-muted-foreground sm:text-xs">
        {persona.mindset}
      </p>
      <p className="mt-2.5 text-[11px] leading-snug text-foreground sm:text-xs">
        <span className="font-semibold text-primary">Goal · </span>
        {persona.goal}
      </p>
      <ul className="mt-2.5 space-y-1">
        {persona.needs.map((need) => (
          <li key={need} className="flex gap-1.5 text-[10.5px] leading-snug text-muted-foreground sm:text-[11.5px]">
            <Check aria-hidden="true" className="mt-[2px] h-3 w-3 shrink-0 text-primary" />
            <span>{need}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
