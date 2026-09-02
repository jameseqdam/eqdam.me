/**
 * Walkthroughs: the presentable form of a case study.
 *
 * `/work/:slug` is written to be read — justified prose, scannable metrics. A
 * walkthrough is the same project rebuilt to be *presented*: one argument per
 * slide, a figure carrying the weight, and presenter notes for the person
 * talking. The source material is the portfolio deck, but the diagrams and
 * charts in it are re-drawn here as live components rather than pasted in as
 * pictures of charts, so they animate, respond to the theme, and stay legible
 * when a projector crushes the mid-tones.
 *
 * Content lives in `src/data/walkthroughs/*.json`, one file per case study, and
 * is keyed to the case study by `slug`.
 */

/** Screenshot chrome. `paper` is for photographs of sketches and workshops. */
export type ShotFrame = 'browser' | 'phone' | 'tablet' | 'paper' | 'plain';

export interface ShotRef {
  src: string;
  alt: string;
  /** Printed under the shot in a filmstrip or grid. */
  label?: string;
}

/**
 * A figure. One discriminated union rather than one component per slide, so a
 * slide's JSON stays declarative and the deck shell never has to know what it
 * is drawing.
 */
export type Figure =
  /** A single artefact from the source deck, in optional device chrome. */
  | {
      kind: 'shot';
      src: string;
      alt: string;
      frame?: ShotFrame;
      caption?: string;
      /** Slow Ken Burns drift. For wide artefacts that cannot be read whole. */
      pan?: boolean;
      /** `contain` letterboxes, `cover` crops to fill. Defaults to contain. */
      fit?: 'contain' | 'cover';
    }
  /** Several artefacts at once: side by side, tiled, layered, or as a strip. */
  | {
      kind: 'shots';
      layout: 'row' | 'grid' | 'stack' | 'filmstrip';
      items: ShotRef[];
      frame?: ShotFrame;
      caption?: string;
    }
  /** Draggable before/after wipe. */
  | {
      kind: 'compare';
      before: ShotRef & { label: string };
      after: ShotRef & { label: string };
      frame?: ShotFrame;
      caption?: string;
    }
  /** Headline numbers, counted up on entry. */
  | {
      kind: 'stats';
      items: { value: string; label: string; sub?: string }[];
      caption?: string;
    }
  /** Single-series bars, drawn in on entry. */
  | {
      kind: 'bars';
      data: { label: string; value: number; highlight?: boolean }[];
      unit?: string;
      orientation?: 'horizontal' | 'vertical';
      caption?: string;
    }
  /** Two or three series against shared categories. */
  | {
      kind: 'grouped';
      series: string[];
      data: { label: string; values: number[] }[];
      unit?: string;
      caption?: string;
    }
  /** Proportion, with the split called out in the middle. */
  | {
      kind: 'donut';
      segments: { label: string; value: number }[];
      centreValue?: string;
      centreLabel?: string;
      caption?: string;
    }
  /** Trend lines, stroke-drawn on entry. */
  | {
      kind: 'line';
      series: { name: string; points: number[] }[];
      xLabels: string[];
      unit?: string;
      area?: boolean;
      caption?: string;
    }
  /**
   * Service blueprint. Lanes are the horizontal layers (actions, frontstage,
   * backstage, support); `stages` label the vertical columns; `dividers` draw
   * the named lines a blueprint depends on — interaction, visibility, internal
   * interaction — after the lane they sit below.
   */
  | {
      kind: 'blueprint';
      stages: string[];
      lanes: { name: string; role?: string; steps: (string | null)[] }[];
      dividers?: { after: string; label: string }[];
      caption?: string;
    }
  /** Node-and-edge diagram on a column/row grid, with a travelling pulse. */
  | {
      kind: 'flow';
      nodes: {
        id: string;
        label: string;
        col: number;
        row: number;
        tone?: 'primary' | 'neutral' | 'accent' | 'warn';
      }[];
      edges: { from: string; to: string; label?: string }[];
      caption?: string;
    }
  /** The four-stage project ribbon the source decks run along the bottom. */
  | {
      kind: 'phases';
      items: { label: string; detail?: string }[];
      /** Zero-based. Dims the rest. */
      active?: number;
      caption?: string;
    }
  /** Journey map: phases across the top, rows of observations down the side. */
  | {
      kind: 'journey';
      phases: string[];
      rows: { label: string; cells: string[] }[];
      caption?: string;
    }
  /** Social network graph. Positions are seeded, so the layout is stable. */
  | {
      kind: 'network';
      nodes: number;
      /** How many nodes are drawn as active participants. */
      highlight: number;
      legend?: [string, string];
      seed?: number;
      caption?: string;
    }
  /** Screening funnel, e.g. 5,969 articles down to 7. */
  | {
      kind: 'funnel';
      steps: { label: string; value: string; note?: string }[];
      caption?: string;
    }
  /** Live resonant-breathing pacer with the coupled heart-rate wave. */
  | { kind: 'pacer'; caption?: string }
  /** Animated continuous glucose trace with target band and forward prediction. */
  | { kind: 'glucose'; caption?: string }
  /** Circular score gauge, swept on entry. */
  | { kind: 'gauge'; value: number; label: string; sub?: string; caption?: string }
  /** Interface-inventory swatches: the cost of inconsistency, counted out. */
  | {
      kind: 'swatches';
      groups: { label: string; count: number; tone: 'grey' | 'blue' | 'mixed' }[];
      caption?: string;
    }
  /** Iteration track, v1 to vN, with an optional pivot marker. */
  | {
      kind: 'track';
      segments: { range: string; label: string; detail: string }[];
      pivot?: { label: string; detail: string };
      caption?: string;
    }
  /** Many steps collapsing into one. The whole point of a one-time setup. */
  | {
      kind: 'reduction';
      from: { count: number; label: string; note?: string };
      to: { count: number; label: string; note?: string };
      caption?: string;
    }
  /** Data table with cells called out by index. */
  | {
      kind: 'matrix';
      cols: string[];
      rows: { label: string; cells: string[]; highlight?: number[] }[];
      caption?: string;
    }
  /** Growth over labelled points. */
  | {
      kind: 'ramp';
      points: { label: string; value: number; note?: string }[];
      unit?: string;
      caption?: string;
    }
  /** Architecture layers, offset and staggered in. */
  | {
      kind: 'layers';
      items: { label: string; detail: string }[];
      caption?: string;
    }
  /** Pull quote from a participant or stakeholder. */
  | { kind: 'quote'; text: string; attribution?: string }
  /** Two personas, compared column by column. */
  | {
      kind: 'personas';
      items: {
        name: string;
        src?: string;
        goal: string;
        mindset: string;
        needs: string[];
      }[];
      caption?: string;
    };

/**
 * Slide layout.
 *
 * `cover` and `close` bookend on the hero gradient; `section` divides; the rest
 * differ only in how much room the figure gets, from none (`statement`) to all
 * of it (`full`).
 */
export type SlideKind =
  | 'cover'
  | 'section'
  | 'statement'
  | 'split'
  | 'full'
  | 'cards'
  | 'close';

export interface Slide {
  kind: SlideKind;
  eyebrow?: string;
  title: string;
  standfirst?: string;
  bullets?: { lead?: string; text: string }[];
  cards?: { title: string; text: string }[];
  callout?: { lead: string; text: string };
  figure?: Figure;
  /** Shown only in presenter mode. What to say, not what is on the slide. */
  notes?: string;
}

export interface Walkthrough {
  /** Matches a case study slug in src/data/work. */
  slug: string;
  title: string;
  subtitle: string;
  slides: Slide[];
}

const modules = import.meta.glob<{ default: Walkthrough }>(
  '../data/walkthroughs/*.json',
  { eager: true },
);

export const walkthroughs: Walkthrough[] = Object.values(modules).map((mod) => mod.default);

const bySlug = new Map(walkthroughs.map((deck) => [deck.slug, deck]));

export const getWalkthrough = (slug?: string): Walkthrough | undefined =>
  slug ? bySlug.get(slug) : undefined;

export const hasWalkthrough = (slug?: string): boolean => Boolean(getWalkthrough(slug));
