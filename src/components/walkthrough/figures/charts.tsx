import { useId } from 'react';
import type { Figure } from '@/lib/walkthrough';
import { AXIS_TEXT, FigureFrame, GRID_STROKE, SERIES, useCountUp, useReveal } from './primitives';

type Of<K extends Figure['kind']> = Extract<Figure, { kind: K }>;

/** Rounds a maximum up to something an axis can be labelled with. */
const niceMax = (value: number) => {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / (magnitude / 2)) * (magnitude / 2);
};

/* ---------------------------------------------------------------------- stats */

/**
 * The numbers, counted up.
 *
 * A metric that simply appears reads as a label; a metric that counts reads as a
 * measurement, which is what these are. The count is also the only motion an
 * audience reliably watches to completion, so it buys a beat to talk over.
 */
export const Stats = ({ figure }: { figure: Of<'stats'> }) => (
  <FigureFrame caption={figure.caption}>
    <div
      className={`grid gap-3 sm:gap-4 ${
        figure.items.length <= 2
          ? 'grid-cols-2'
          : figure.items.length === 3
            ? 'grid-cols-3'
            : 'grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {figure.items.map((item, index) => (
        <StatTile key={item.label} item={item} index={index} />
      ))}
    </div>
  </FigureFrame>
);

const StatTile = ({
  item,
  index,
}: {
  item: { value: string; label: string; sub?: string };
  index: number;
}) => {
  const shown = useReveal(index * 110);
  const value = useCountUp(item.value);

  return (
    <div
      className={`rounded-lg border border-border bg-card p-4 transition-all duration-500 ease-out
        sm:p-5 ${shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
    >
      <p className="text-2xl font-bold leading-none tracking-tight text-primary tabular-nums sm:text-3xl lg:text-4xl">
        {shown ? value : ' '}
      </p>
      <p className="mt-2 text-xs font-medium leading-snug text-foreground sm:text-sm">
        {item.label}
      </p>
      {item.sub && <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{item.sub}</p>}
    </div>
  );
};

/* ----------------------------------------------------------------------- bars */

/**
 * Horizontal bars, grown from the axis.
 *
 * Horizontal by default because every bar chart in the source deck is a ranked
 * list of long category names — applications used, homepage elements — and a
 * vertical axis rotates those labels into illegibility.
 */
export const Bars = ({ figure }: { figure: Of<'bars'> }) => {
  const shown = useReveal(80);
  const max = niceMax(Math.max(...figure.data.map((d) => d.value)));

  return (
    <FigureFrame caption={figure.caption}>
      <div className="space-y-1.5">
        {figure.data.map((datum, index) => (
          <div key={datum.label} className="flex items-center gap-3">
            <p
              className={`w-[38%] shrink-0 truncate text-right text-[11px] leading-tight sm:text-xs ${
                datum.highlight ? 'font-semibold text-foreground' : 'text-muted-foreground'
              }`}
              title={datum.label}
            >
              {datum.label}
            </p>
            <div className="relative h-4 flex-1 rounded-sm bg-secondary sm:h-5">
              <div
                className={`h-full rounded-sm transition-[width] [transition-duration:900ms] ease-out ${
                  datum.highlight ? 'bg-primary' : 'bg-primary/45'
                }`}
                style={{
                  width: shown ? `${(datum.value / max) * 100}%` : '0%',
                  transitionDelay: `${index * 55}ms`,
                }}
              />
            </div>
            <p
              className={`w-10 shrink-0 text-[11px] tabular-nums sm:text-xs ${
                datum.highlight ? 'font-semibold text-primary' : 'text-muted-foreground'
              }`}
            >
              {datum.value}
              {figure.unit ?? ''}
            </p>
          </div>
        ))}
      </div>
    </FigureFrame>
  );
};

/* -------------------------------------------------------------------- grouped */

/** Two or three series against shared categories, e.g. participants vs population. */
export const Grouped = ({ figure }: { figure: Of<'grouped'> }) => {
  const shown = useReveal(80);
  const max = niceMax(Math.max(...figure.data.flatMap((d) => d.values)));

  return (
    <FigureFrame caption={figure.caption}>
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {figure.series.map((name, index) => (
            <span key={name} className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: SERIES[index % SERIES.length] }}
              />
              <span className="text-muted-foreground">{name}</span>
            </span>
          ))}
        </div>

        <div className="flex items-end gap-2 sm:gap-4" style={{ height: 'clamp(120px, 22vh, 220px)' }}>
          {figure.data.map((datum, column) => (
            <div key={datum.label} className="flex h-full flex-1 flex-col justify-end gap-1">
              <div className="flex flex-1 items-end justify-center gap-[3px]">
                {datum.values.map((value, series) => (
                  <div
                    key={series}
                    title={`${figure.series[series]}: ${value}${figure.unit ?? ''}`}
                    className="w-full max-w-[22px] rounded-t-sm transition-[height] [transition-duration:900ms] ease-out"
                    style={{
                      height: shown ? `${(value / max) * 100}%` : '0%',
                      background: SERIES[series % SERIES.length],
                      transitionDelay: `${column * 70 + series * 40}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
                {datum.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FigureFrame>
  );
};

/* ---------------------------------------------------------------------- donut */

/**
 * A proportion, swept in.
 *
 * Only ever two or three segments here: a donut with eight slices is a table
 * that has been made harder to read, and the source deck has several of those.
 * The centre carries the headline so the eye never has to visit the legend.
 */
export const Donut = ({ figure }: { figure: Of<'donut'> }) => {
  const shown = useReveal(120);
  const total = figure.segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const R = 52;
  const CIRC = 2 * Math.PI * R;

  let offset = 0;

  return (
    <FigureFrame caption={figure.caption}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <div className="relative w-[clamp(140px,20vh,200px)] shrink-0">
          <svg viewBox="0 0 140 140" className="w-full -rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" stroke={GRID_STROKE} strokeWidth="14" />
            {figure.segments.map((segment, index) => {
              const length = (segment.value / total) * CIRC;
              const dash = shown ? length : 0;
              const element = (
                <circle
                  key={segment.label}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke={SERIES[index % SERIES.length]}
                  strokeWidth="14"
                  strokeLinecap="butt"
                  strokeDasharray={`${dash} ${CIRC - dash}`}
                  strokeDashoffset={-offset}
                  style={{
                    transition: 'stroke-dasharray 900ms ease-out',
                    transitionDelay: `${index * 140}ms`,
                  }}
                />
              );
              offset += length;
              return element;
            })}
          </svg>

          {figure.centreValue && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold leading-none text-foreground tabular-nums sm:text-3xl">
                {figure.centreValue}
              </p>
              {figure.centreLabel && (
                <p className="mt-1 max-w-[70%] text-[10px] leading-tight text-muted-foreground sm:text-xs">
                  {figure.centreLabel}
                </p>
              )}
            </div>
          )}
        </div>

        <ul className="space-y-2">
          {figure.segments.map((segment, index) => (
            <li key={segment.label} className="flex items-baseline gap-2.5 text-xs sm:text-sm">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: SERIES[index % SERIES.length] }}
              />
              <span className="font-semibold tabular-nums text-foreground">
                {Math.round((segment.value / total) * 100)}%
              </span>
              <span className="text-muted-foreground">{segment.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </FigureFrame>
  );
};

/* ----------------------------------------------------------------------- line */

/** Trend lines, stroke-drawn left to right. */
export const Line = ({ figure }: { figure: Of<'line'> }) => {
  const shown = useReveal(100);
  const id = useId();
  const W = 320;
  const H = 150;
  const PAD = { l: 30, r: 8, t: 8, b: 20 };
  const max = niceMax(Math.max(...figure.series.flatMap((s) => s.points)));
  const count = figure.xLabels.length;

  const x = (index: number) =>
    PAD.l + (index / Math.max(1, count - 1)) * (W - PAD.l - PAD.r);
  const y = (value: number) => H - PAD.b - (value / max) * (H - PAD.t - PAD.b);

  return (
    <FigureFrame caption={figure.caption}>
      <div>
        {figure.series.length > 1 && (
          <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {figure.series.map((series, index) => (
              <span key={series.name} className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs">
                <span
                  className="h-0.5 w-4 rounded-full"
                  style={{ background: SERIES[index % SERIES.length] }}
                />
                <span className="text-muted-foreground">{series.name}</span>
              </span>
            ))}
          </div>
        )}

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
          {[0, 0.25, 0.5, 0.75, 1].map((step) => (
            <g key={step}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y(max * step)}
                y2={y(max * step)}
                stroke={GRID_STROKE}
                strokeWidth="1"
              />
              <text x={PAD.l - 5} y={y(max * step) + 3} textAnchor="end" fontSize="7" fill={AXIS_TEXT}>
                {Math.round(max * step)}
                {figure.unit ?? ''}
              </text>
            </g>
          ))}

          {figure.series.map((series, index) => {
            const path = series.points
              .map((value, position) => `${position ? 'L' : 'M'}${x(position)} ${y(value)}`)
              .join(' ');
            return (
              <g key={series.name}>
                {figure.area && (
                  <path
                    d={`${path} L${x(series.points.length - 1)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`}
                    fill={SERIES[index % SERIES.length]}
                    opacity={shown ? 0.12 : 0}
                    style={{ transition: 'opacity 700ms ease-out 500ms' }}
                  />
                )}
                <path
                  d={path}
                  fill="none"
                  stroke={SERIES[index % SERIES.length]}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={shown ? 0 : 1}
                  style={{
                    transition: 'stroke-dashoffset 1100ms ease-out',
                    transitionDelay: `${index * 180}ms`,
                  }}
                />
                {series.points.map((value, position) => (
                  <circle
                    key={position}
                    cx={x(position)}
                    cy={y(value)}
                    r="2.4"
                    fill={SERIES[index % SERIES.length]}
                    opacity={shown ? 1 : 0}
                    style={{
                      transition: 'opacity 300ms ease-out',
                      transitionDelay: `${600 + position * 40}ms`,
                    }}
                  />
                ))}
              </g>
            );
          })}

          {figure.xLabels.map((label, index) => (
            <text
              key={`${id}-${label}-${index}`}
              x={x(index)}
              y={H - 6}
              textAnchor="middle"
              fontSize="7"
              fill={AXIS_TEXT}
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </FigureFrame>
  );
};

/* ----------------------------------------------------------------------- ramp */

/** Growth across labelled milestones. Area under the curve, filled on entry. */
export const Ramp = ({ figure }: { figure: Of<'ramp'> }) => {
  const shown = useReveal(100);
  const max = niceMax(Math.max(...figure.points.map((p) => p.value)));

  return (
    <FigureFrame caption={figure.caption}>
      <div className="flex items-end gap-2 sm:gap-3" style={{ height: 'clamp(140px, 26vh, 240px)' }}>
        {figure.points.map((point, index) => (
          <div key={point.label} className="flex h-full flex-1 flex-col justify-end">
            <p
              className="mb-1 text-center text-sm font-bold text-primary tabular-nums transition-opacity duration-500 sm:text-base"
              style={{ opacity: shown ? 1 : 0, transitionDelay: `${index * 120 + 400}ms` }}
            >
              {point.value}
              {figure.unit ?? ''}
            </p>
            <div
              className="rounded-t-md bg-gradient-to-t from-primary/25 to-primary transition-[height] [transition-duration:900ms] ease-out"
              style={{
                height: shown ? `${(point.value / max) * 100}%` : '0%',
                transitionDelay: `${index * 120}ms`,
              }}
            />
            <p className="mt-2 text-center text-[11px] font-medium leading-tight text-foreground">
              {point.label}
            </p>
            {point.note && (
              <p className="mt-0.5 text-center text-[10px] leading-tight text-muted-foreground">
                {point.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </FigureFrame>
  );
};

/* ---------------------------------------------------------------------- gauge */

/** Circular score gauge. The SAVA Metabolic Score, and anything else out of 100. */
export const Gauge = ({ figure }: { figure: Of<'gauge'> }) => {
  const shown = useReveal(150);
  const R = 56;
  const CIRC = 2 * Math.PI * R;
  const dash = (Math.min(100, Math.max(0, figure.value)) / 100) * CIRC;
  const value = useCountUp(String(figure.value), 1100);

  return (
    <FigureFrame caption={figure.caption}>
      <div className="flex flex-col items-center">
        <div className="relative w-[clamp(150px,24vh,230px)]">
          <svg viewBox="0 0 140 140" className="w-full -rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" stroke={GRID_STROKE} strokeWidth="11" />
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={`${shown ? dash : 0} ${CIRC}`}
              style={{ transition: 'stroke-dasharray 1200ms cubic-bezier(0.22,1,0.36,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold leading-none text-foreground tabular-nums sm:text-5xl">
              {shown ? value : '0'}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
              {figure.label}
            </p>
          </div>
        </div>
        {figure.sub && (
          <p className="mt-3 max-w-sm text-center text-xs text-muted-foreground sm:text-sm">
            {figure.sub}
          </p>
        )}
      </div>
    </FigureFrame>
  );
};

/* --------------------------------------------------------------------- funnel */

/**
 * A screening funnel. 5,969 articles in, 7 out.
 *
 * Drawn as narrowing bands rather than as numbers in boxes, because the point of
 * the figure is the ratio, and the ratio is what a reader takes from a shape.
 */
export const Funnel = ({ figure }: { figure: Of<'funnel'> }) => {
  const shown = useReveal(100);
  const steps = figure.steps.length;

  return (
    <FigureFrame caption={figure.caption}>
      <ol className="space-y-1.5">
        {figure.steps.map((step, index) => {
          const width = 100 - (index / Math.max(1, steps)) * 72;
          return (
            <li
              key={step.label}
              className="mx-auto flex items-center justify-between gap-3 rounded-md px-3 py-2
                transition-all duration-700 ease-out sm:px-4 sm:py-2.5"
              style={{
                width: shown ? `${width}%` : '20%',
                opacity: shown ? 1 : 0,
                background: `hsl(var(--primary) / ${0.09 + (index / steps) * 0.5})`,
                transitionDelay: `${index * 130}ms`,
              }}
            >
              <div className="min-w-0">
                <p
                  className={`truncate text-xs font-medium sm:text-sm ${
                    index / steps > 0.6 ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {step.label}
                </p>
                {step.note && (
                  <p
                    className={`truncate text-[10px] sm:text-[11px] ${
                      index / steps > 0.6 ? 'text-primary-foreground/75' : 'text-muted-foreground'
                    }`}
                  >
                    {step.note}
                  </p>
                )}
              </div>
              <p
                className={`shrink-0 text-base font-bold tabular-nums sm:text-lg ${
                  index / steps > 0.6 ? 'text-primary-foreground' : 'text-primary'
                }`}
              >
                {step.value}
              </p>
            </li>
          );
        })}
      </ol>
    </FigureFrame>
  );
};

/* --------------------------------------------------------------------- matrix */

/** A table, with named cells called out. Used where the finding *is* the table. */
export const Matrix = ({ figure }: { figure: Of<'matrix'> }) => {
  const shown = useReveal(80);

  return (
    <FigureFrame caption={figure.caption}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[11px] sm:text-xs">
          <thead>
            <tr>
              <th className="border-b border-border pb-2 pr-3 font-semibold text-foreground" />
              {figure.cols.map((col) => (
                <th
                  key={col}
                  className="border-b border-border px-2 pb-2 font-semibold leading-tight text-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {figure.rows.map((row, rowIndex) => (
              <tr
                key={row.label}
                className="transition-opacity duration-500"
                style={{ opacity: shown ? 1 : 0, transitionDelay: `${rowIndex * 60}ms` }}
              >
                <th
                  scope="row"
                  className="border-b border-border/60 py-1.5 pr-3 text-left font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border-b border-border/60 px-2 py-1.5 tabular-nums ${
                      row.highlight?.includes(cellIndex)
                        ? 'rounded-sm bg-primary/10 font-semibold text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FigureFrame>
  );
};
