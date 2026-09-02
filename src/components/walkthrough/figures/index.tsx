import type { Figure } from '@/lib/walkthrough';
import { Bars, Donut, Funnel, Gauge, Grouped, Line, Matrix, Ramp, Stats } from './charts';
import {
  Blueprint,
  Flow,
  Journey,
  Layers,
  Network,
  Personas,
  Phases,
  PullQuote,
  Reduction,
  Swatches,
  Track,
} from './diagrams';
import { Glucose, Pacer } from './motion';
import { Compare, ShotSet, SingleShot } from './shots';

/**
 * One switch, so a slide never knows what it is rendering.
 *
 * Exhaustive over `Figure['kind']` — adding a figure type to the union without
 * adding it here is a type error at the `never` branch, which is the point.
 */
export const FigureView = ({ figure }: { figure: Figure }) => {
  switch (figure.kind) {
    case 'shot':
      return <SingleShot figure={figure} />;
    case 'shots':
      return <ShotSet figure={figure} />;
    case 'compare':
      return <Compare figure={figure} />;
    case 'stats':
      return <Stats figure={figure} />;
    case 'bars':
      return <Bars figure={figure} />;
    case 'grouped':
      return <Grouped figure={figure} />;
    case 'donut':
      return <Donut figure={figure} />;
    case 'line':
      return <Line figure={figure} />;
    case 'ramp':
      return <Ramp figure={figure} />;
    case 'gauge':
      return <Gauge figure={figure} />;
    case 'funnel':
      return <Funnel figure={figure} />;
    case 'matrix':
      return <Matrix figure={figure} />;
    case 'blueprint':
      return <Blueprint figure={figure} />;
    case 'flow':
      return <Flow figure={figure} />;
    case 'phases':
      return <Phases figure={figure} />;
    case 'journey':
      return <Journey figure={figure} />;
    case 'network':
      return <Network figure={figure} />;
    case 'swatches':
      return <Swatches figure={figure} />;
    case 'track':
      return <Track figure={figure} />;
    case 'reduction':
      return <Reduction figure={figure} />;
    case 'layers':
      return <Layers figure={figure} />;
    case 'quote':
      return <PullQuote figure={figure} />;
    case 'personas':
      return <Personas figure={figure} />;
    case 'pacer':
      return <Pacer figure={figure} />;
    case 'glucose':
      return <Glucose figure={figure} />;
    default: {
      const exhaustive: never = figure;
      return exhaustive;
    }
  }
};
