import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getWorkItem } from '@/lib/content';
import { getWalkthrough } from '@/lib/walkthrough';
import { Deck } from '@/components/walkthrough/Deck';
import { WalkthroughGate } from '@/components/walkthrough/WalkthroughGate';

/**
 * The presenting version of a case study.
 *
 * Rendered without the site navigation on purpose: this is a deck, and a fixed
 * header eating sixty pixels of a projected 16:9 stage is sixty pixels of the
 * argument. The way back is the link in the deck's own bar.
 */
const Walkthrough = () => {
  const { slug } = useParams<{ slug: string }>();
  const deck = getWalkthrough(slug);
  const work = getWorkItem(slug);
  const backTo = `/work/${slug}`;

  // Presentation material, not published pages. Kept out of the index for as
  // long as the tab is open on one.
  useEffect(() => {
    const tag = document.createElement('meta');
    tag.name = 'robots';
    tag.content = 'noindex, nofollow';
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  useEffect(() => {
    if (!deck) return;
    const previous = document.title;
    document.title = `${deck.title} — Walkthrough`;
    return () => {
      document.title = previous;
    };
  }, [deck]);

  if (!deck) {
    return (
      <div className="grid min-h-[100dvh] place-items-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-foreground">No walkthrough for this project yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {work ? work.title : 'This case study'} does not have a presentation deck.
          </p>
          <Link to={work ? backTo : '/work'} className="portfolio-button portfolio-button-primary mt-5">
            {work ? 'Back to the case study' : 'See all work'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <WalkthroughGate title={deck.title} backTo={backTo}>
      <Deck deck={deck} backTo={backTo} />
    </WalkthroughGate>
  );
};

export default Walkthrough;
