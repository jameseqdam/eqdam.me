import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

/**
 * The walkthroughs sit behind one shared passphrase.
 *
 * This is a courtesy lock, not security: the deck content ships in the bundle, so
 * anyone determined can read it out of the JavaScript. It exists to keep the
 * presentation material off the public case-study pages and out of search
 * results, which is what it is actually for — and it is hardcoded on purpose, so
 * there is no build step or backend to keep in sync.
 */
const PASSPHRASE = 'absolute';

/** Per-tab, so a shared laptop does not stay unlocked forever. */
const STORAGE_KEY = 'walkthrough-unlocked';

const isUnlocked = () => sessionStorage.getItem(STORAGE_KEY) === 'yes';

export const WalkthroughGate = ({
  title,
  backTo,
  children,
}: {
  title: string;
  backTo: string;
  children: ReactNode;
}) => {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) input.current?.focus();
  }, [unlocked]);

  if (unlocked) return <>{children}</>;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (value.trim().toLowerCase() === PASSPHRASE) {
      sessionStorage.setItem(STORAGE_KEY, 'yes');
      setUnlocked(true);
      return;
    }
    setWrong(true);
    setValue('');
    input.current?.focus();
  };

  return (
    <div className="portfolio-hero-bg grid min-h-[100dvh] place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-hover)] sm:p-7">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock aria-hidden="true" className="h-5 w-5" />
          </span>

          <h1 className="mt-4 text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl">
            Presentation walkthrough
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {title} — the presenting version of this case study, with the working material.
            Enter the passphrase to continue.
          </p>

          <form onSubmit={submit} className="mt-5">
            <label htmlFor="walkthrough-passphrase" className="sr-only">
              Passphrase
            </label>
            <input
              ref={input}
              id="walkthrough-passphrase"
              type="password"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setWrong(false);
              }}
              placeholder="Passphrase"
              aria-invalid={wrong}
              aria-describedby={wrong ? 'walkthrough-error' : undefined}
              className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground
                placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring ${wrong ? 'border-destructive' : 'border-border'}`}
            />
            {wrong && (
              <p id="walkthrough-error" role="alert" className="mt-2 text-xs text-destructive">
                That is not the passphrase. Try again.
              </p>
            )}

            <button type="submit" className="portfolio-button portfolio-button-primary mt-4 w-full">
              Unlock
            </button>
          </form>
        </div>

        <Link
          to={backTo}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/85
            transition-colors hover:text-primary-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to the case study
        </Link>
      </div>
    </div>
  );
};
