import { useEffect, useRef, useState } from 'react';
import type { Figure } from '@/lib/walkthrough';
import { AXIS_TEXT, FigureFrame, GRID_STROKE, prefersReducedMotion } from './primitives';

type Of<K extends Figure['kind']> = Extract<Figure, { kind: K }>;

/**
 * A clock that runs while the figure is mounted.
 *
 * These two figures are the only ones that animate continuously rather than on
 * entry — they are simulations of the thing the product does, and a still frame
 * of either says nothing. Both stop dead under `prefers-reduced-motion`, which
 * for a breathing pacer is not a nicety.
 */
const useClock = (enabled: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const started = performance.now();
    const tick = (now: number) => {
      setElapsed((now - started) / 1000);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [enabled]);

  return elapsed;
};

/* ---------------------------------------------------------------------- pacer */

const CYCLE = 10; // seconds. Six breaths a minute — the resonance frequency.

/**
 * The resonant-breathing pacer, live.
 *
 * This is the mechanic the HRV game is built on, so the walkthrough runs it
 * rather than describing it: a five-second inhale, a five-second exhale, and the
 * heart rate rising and falling *with* the breath. That coupling is respiratory
 * sinus arrhythmia — the thing the game scores — and watching the two curves
 * lock together explains in four seconds what a paragraph does not.
 */
export const Pacer = ({ figure }: { figure: Of<'pacer'> }) => {
  const still = prefersReducedMotion();
  const elapsed = useClock(!still);

  const phase = (elapsed % CYCLE) / CYCLE;
  // Cosine, so the turn at each end is a hold rather than a corner.
  const breath = (1 - Math.cos(phase * Math.PI * 2)) / 2;
  const inhaling = phase < 0.5;
  const secondsLeft = Math.ceil((inhaling ? 0.5 - phase : 1 - phase) * CYCLE);

  const W = 300;
  const H = 90;
  const SPAN = 20; // seconds of history on screen

  // Heart rate trails the breath slightly, the way RSA actually presents.
  const rate = (t: number) => 68 + 11 * Math.sin(((t - 0.7) / CYCLE) * Math.PI * 2);
  const now = still ? CYCLE * 1.5 : elapsed;
  const trace = Array.from({ length: 120 }, (_, index) => {
    const t = now - SPAN + (index / 119) * SPAN;
    return `${index ? 'L' : 'M'}${(index / 119) * W} ${H - ((rate(t) - 50) / 40) * H}`;
  }).join(' ');

  return (
    <FigureFrame caption={figure.caption}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="relative grid aspect-square w-[clamp(130px,22vh,190px)] shrink-0 place-items-center">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-dashed border-primary/25"
          />
          <span
            aria-hidden="true"
            className="absolute rounded-full bg-primary/15"
            style={{
              width: `${38 + breath * 62}%`,
              height: `${38 + breath * 62}%`,
              transition: still ? undefined : 'none',
            }}
          />
          <span
            aria-hidden="true"
            className="absolute rounded-full border-2 border-primary"
            style={{ width: `${38 + breath * 62}%`, height: `${38 + breath * 62}%` }}
          />
          <div className="relative text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
              {inhaling ? 'Inhale' : 'Exhale'}
            </p>
            <p className="text-2xl font-bold leading-none text-foreground tabular-nums sm:text-3xl">
              {still ? 5 : secondsLeft}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="text-[11px] font-semibold text-foreground sm:text-xs">
              Heart rate, coupled to the breath
            </p>
            <p className="text-[11px] tabular-nums text-primary sm:text-xs">
              {Math.round(rate(now))} bpm
            </p>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Heart-rate variability trace">
            {[0, 0.5, 1].map((step) => (
              <line
                key={step}
                x1="0"
                x2={W}
                y1={step * H}
                y2={step * H}
                stroke={GRID_STROKE}
                strokeWidth="1"
              />
            ))}
            <path
              d={trace}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <text x="2" y="9" fontSize="7" fill={AXIS_TEXT}>
              90
            </text>
            <text x="2" y={H - 3} fontSize="7" fill={AXIS_TEXT}>
              50
            </text>
          </svg>
          <p className="mt-2 text-[10.5px] leading-snug text-muted-foreground sm:text-[11.5px]">
            Six breaths a minute. The wider and smoother the wave, the higher the score —
            the game rewards the coupling, not the effort.
          </p>
        </div>
      </div>
    </FigureFrame>
  );
};

/* -------------------------------------------------------------------- glucose */

/**
 * A continuous glucose trace, with the forward prediction drawn dashed.
 *
 * SAVA's proposition is not the reading, it is the next twenty minutes — so the
 * figure shows a live trace crossing a target band and a dashed extrapolation
 * beyond the current point. The prediction is the product.
 */
export const Glucose = ({ figure }: { figure: Of<'glucose'> }) => {
  const still = prefersReducedMotion();
  const elapsed = useClock(!still);

  const W = 320;
  const H = 150;
  const PAD = { l: 26, r: 10, t: 10, b: 18 };
  const LOW = 3.9;
  const HIGH = 10;
  const MIN = 2;
  const MAX = 14;

  const y = (mmol: number) => H - PAD.b - ((mmol - MIN) / (MAX - MIN)) * (H - PAD.t - PAD.b);
  const x = (fraction: number) => PAD.l + fraction * (W - PAD.l - PAD.r);

  // A plausible day: a breakfast spike, a lunch spike, and drift between them.
  const level = (t: number) => {
    const meal = (at: number, size: number) =>
      size * Math.exp(-Math.pow((t - at) / 1.5, 2)) * (1 + 0.12 * Math.sin(t * 2.2));
    return 5.4 + meal(4.5, 5.1) + meal(11, 3.8) + 0.45 * Math.sin(t * 0.9) + 0.2 * Math.sin(t * 3.7);
  };

  // 18 simulated hours scroll past over roughly a minute of wall clock.
  const cursor = still ? 6.2 : 3 + ((elapsed * 0.55) % 12);
  const HISTORY = 9;

  const points = Array.from({ length: 90 }, (_, index) => {
    const t = cursor - HISTORY + (index / 89) * HISTORY;
    return { fraction: (index / 89) * 0.72, value: level(t) };
  });
  const path = points
    .map((point, index) => `${index ? 'L' : 'M'}${x(point.fraction)} ${y(point.value)}`)
    .join(' ');

  const forecast = Array.from({ length: 24 }, (_, index) => {
    const t = cursor + (index / 23) * 2.4;
    return { fraction: 0.72 + (index / 23) * 0.28, value: level(t) };
  });
  const forecastPath = forecast
    .map((point, index) => `${index ? 'L' : 'M'}${x(point.fraction)} ${y(point.value)}`)
    .join(' ');

  const current = level(cursor);
  const trend = level(cursor + 0.5) - current;
  const peak = Math.max(...forecast.map((point) => point.value));

  return (
    <FigureFrame caption={figure.caption}>
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Simulated glucose trace">
          <rect
            x={PAD.l}
            y={y(HIGH)}
            width={W - PAD.l - PAD.r}
            height={y(LOW) - y(HIGH)}
            fill="hsl(var(--primary) / 0.07)"
          />
          {[LOW, HIGH].map((bound) => (
            <line
              key={bound}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(bound)}
              y2={y(bound)}
              stroke="hsl(var(--primary) / 0.35)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}
          {[MIN, 6, 10, MAX].map((tick) => (
            <text key={tick} x={PAD.l - 4} y={y(tick) + 3} textAnchor="end" fontSize="7" fill={AXIS_TEXT}>
              {tick}
            </text>
          ))}

          <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />
          <path
            d={forecastPath}
            fill="none"
            stroke="hsl(var(--primary) / 0.55)"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinejoin="round"
          />

          <line
            x1={x(0.72)}
            x2={x(0.72)}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke={GRID_STROKE}
            strokeWidth="1"
          />
          <circle cx={x(0.72)} cy={y(current)} r="3.2" fill="hsl(var(--primary))" />
          <circle cx={x(0.72)} cy={y(current)} r="6" fill="hsl(var(--primary) / 0.2)" />

          <text x={x(0.735)} y={PAD.t + 7} fontSize="7" fill={AXIS_TEXT}>
            now
          </text>
          <text x={W - PAD.r} y={H - 4} textAnchor="end" fontSize="7" fill={AXIS_TEXT}>
            + 2 h predicted
          </text>
        </svg>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] sm:text-xs">
          <span className="tabular-nums text-foreground">
            <span className="font-semibold text-primary">{current.toFixed(1)}</span> mmol/L
          </span>
          <span className="text-muted-foreground">
            {trend > 0.25 ? 'Rising' : trend < -0.25 ? 'Falling' : 'Steady'}
          </span>
          <span className="text-muted-foreground">
            Predicted peak <span className="tabular-nums text-foreground">{peak.toFixed(1)}</span>
          </span>
          <span className="text-muted-foreground">
            Target band <span className="tabular-nums text-foreground">3.9 – 10</span>
          </span>
        </div>
      </div>
    </FigureFrame>
  );
};
