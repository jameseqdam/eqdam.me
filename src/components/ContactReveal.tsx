import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Lock, Mail, Phone } from 'lucide-react';
import { CONTACT_CHANNELS, type ContactChannel } from '@/lib/contact';
import { cn } from '@/lib/utils';

const HOLD_DURATION_MS = 1200;
/** Cancelling rewinds faster than the fill so an aborted press feels snappy. */
const REWIND_FACTOR = 2.5;
const COPIED_TOOLTIP_MS = 1800;

const RING_RADIUS = 13;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const CHANNEL_ICONS = {
  email: Mail,
  phone: Phone,
} as const;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ContactRevealProps {
  channel: ContactChannel;
  /** "card" matches the bordered rows in ContactSection; "inline" suits the hero strip. */
  variant?: 'card' | 'inline';
  className?: string;
}

/**
 * Hold-to-reveal contact chip. The real value is decoded only once the visitor
 * completes the press, so bots scraping the markup see the mask instead.
 */
const ContactReveal = ({ channel, variant = 'card', className }: ContactRevealProps) => {
  const config = CONTACT_CHANNELS[channel];
  const Icon = CHANNEL_ICONS[channel];

  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Decoded lazily on reveal so the strings never exist before they are needed.
  const [value, setValue] = useState<string | null>(null);
  const [href, setHref] = useState<string | null>(null);

  const frameRef = useRef<number | null>(null);
  const holdingRef = useRef(false);
  const progressRef = useRef(0);
  const copiedTimerRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const reveal = useCallback(() => {
    holdingRef.current = false;
    stopFrame();
    progressRef.current = 1;
    setProgress(1);
    setValue(config.getValue());
    setHref(config.getHref());
    setRevealed(true);
    setPulsing(true);
    pulseTimerRef.current = window.setTimeout(() => setPulsing(false), 600);
  }, [config, stopFrame]);

  /** Drives the ring both ways: forward while held, back to 0 once released. */
  const runFrames = useCallback(() => {
    stopFrame();
    let last = performance.now();

    const step = (now: number) => {
      const delta = now - last;
      last = now;

      const direction = holdingRef.current ? 1 : -REWIND_FACTOR;
      const next = progressRef.current + (delta / HOLD_DURATION_MS) * direction;

      if (next >= 1) {
        reveal();
        return;
      }

      if (next <= 0) {
        progressRef.current = 0;
        setProgress(0);
        frameRef.current = null;
        return;
      }

      progressRef.current = next;
      setProgress(next);
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
  }, [reveal, stopFrame]);

  const startHold = useCallback(() => {
    if (revealed || holdingRef.current) return;

    // A hold gesture is motion-based feedback; honour reduced-motion by
    // revealing on a plain press instead of animating a ring.
    if (prefersReducedMotion()) {
      reveal();
      return;
    }

    holdingRef.current = true;
    runFrames();
  }, [reveal, revealed, runFrames]);

  const cancelHold = useCallback(() => {
    if (revealed || !holdingRef.current) return;
    holdingRef.current = false;
    runFrames();
  }, [revealed, runFrames]);

  useEffect(
    () => () => {
      stopFrame();
      if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
      if (pulseTimerRef.current !== null) window.clearTimeout(pulseTimerRef.current);
    },
    [stopFrame],
  );

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older Safari and any non-secure context fall back to the legacy path.
      const scratch = document.createElement('textarea');
      scratch.value = value;
      scratch.setAttribute('readonly', '');
      scratch.style.position = 'fixed';
      scratch.style.opacity = '0';
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand('copy');
      document.body.removeChild(scratch);
    }

    setCopied(true);
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = window.setTimeout(() => setCopied(false), COPIED_TOOLTIP_MS);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    event.preventDefault();
    if (event.repeat) return;
    startHold();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    cancelHold();
  };

  const isCard = variant === 'card';

  return (
    <div
      className={cn(
        // Glassmorphic shell built from the site's own tokens.
        'group relative flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 backdrop-blur-md transition-shadow duration-300',
        isCard ? 'p-3 lg:p-4 lg:gap-4' : 'px-3 py-2',
        revealed && 'shadow-[var(--shadow-card)]',
        pulsing && 'animate-reveal-pulse',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-lg bg-primary/10',
          isCard ? 'h-10 w-10 lg:h-12 lg:w-12' : 'h-8 w-8',
        )}
      >
        <Icon className={cn('text-primary', isCard ? 'h-5 w-5 lg:h-6 lg:w-6' : 'h-4 w-4')} />
      </div>

      <div className="min-w-0 flex-1">
        {isCard && <p className="text-sm font-medium sm:text-base">{config.label}</p>}
        <p
          className={cn(
            'truncate text-muted-foreground transition-[filter,opacity,color] duration-500 ease-out',
            isCard ? 'text-sm sm:text-base' : 'text-sm',
            revealed
              ? 'text-foreground opacity-100 blur-0'
              : 'select-none opacity-70 blur-[8px]',
          )}
          // Screen readers should not announce the decorative mask.
          aria-hidden={!revealed}
        >
          {revealed ? value : config.mask}
        </p>
      </div>

      {revealed && href ? (
        <div className="flex flex-shrink-0 items-center gap-1">
          <div className="relative">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={`Copy ${config.label.toLowerCase()} to clipboard`}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
            <span
              role="status"
              aria-live="polite"
              className={cn(
                'pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover/90 px-2 py-1 text-xs font-medium text-popover-foreground shadow-[var(--shadow-card)] backdrop-blur-md transition-all duration-200',
                copied ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
              )}
            >
              {copied ? 'Copied!' : ''}
            </span>
          </div>

          <a
            href={href}
            aria-label={`${config.actionLabel}: ${value}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon className="h-4 w-4" />
          </a>
        </div>
      ) : (
        <button
          type="button"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onContextMenu={(event) => event.preventDefault()}
          aria-label={`Hold to reveal ${config.label.toLowerCase()}`}
          className="relative flex h-9 w-9 flex-shrink-0 touch-none select-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              className="stroke-border"
            />
            <circle
              cx="16"
              cy="16"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
              style={{ filter: progress > 0 ? 'drop-shadow(0 0 4px hsl(var(--primary) / 0.6))' : undefined }}
            />
          </svg>
          <Lock className="h-3.5 w-3.5" />
        </button>
      )}

      {!isCard && !revealed && (
        <span className="sr-only">{config.label} hidden until revealed</span>
      )}
    </div>
  );
};

export default ContactReveal;
