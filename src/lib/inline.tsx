import { Fragment, ReactNode } from 'react';

/**
 * Inline `**bold**` and `*italic*` emphasis, shared by the article bodies and the
 * slide decks so the same source text reads the same in either form.
 */
export const renderInline = (
  text: string,
  /**
   * Bold text is lifted out of the surrounding ink, which on the default body
   * copy means the full-contrast foreground. Inverted surfaces pass their own,
   * since `foreground` would disappear into them.
   */
  strongClassName = 'text-foreground',
): ReactNode[] => {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={index} className={`font-semibold ${strongClassName}`}>
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <em key={index} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    return <Fragment key={index}>{token}</Fragment>;
  });
};
