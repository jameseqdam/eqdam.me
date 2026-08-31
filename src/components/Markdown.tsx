import { renderInline } from '@/lib/inline';

/**
 * Minimal renderer for the subset of Markdown used by the article bodies in
 * src/data/articles: ATX headings, paragraphs, ordered and unordered lists,
 * horizontal rules, and inline bold / italic emphasis.
 */

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'hr' };

const parseBlocks = (markdown: string): Block[] => {
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', lines: paragraph });
      paragraph = [];
    }
  };

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (/^-{3,}$/.test(line) || /^_{3,}$/.test(line)) {
      flushParagraph();
      blocks.push({ type: 'hr' });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/);
    const unordered = line.match(/^[-*+]\s+(.*)$/);
    if (ordered || unordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      const item = (ordered ?? unordered)[1];
      const previous = blocks[blocks.length - 1];

      if (previous && previous.type === 'list' && previous.ordered === isOrdered) {
        previous.items.push(item);
      } else {
        blocks.push({ type: 'list', ordered: isOrdered, items: [item] });
      }
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
};

const headingClasses: Record<number, string> = {
  1: 'text-3xl sm:text-4xl font-bold mt-12 mb-4',
  2: 'text-2xl sm:text-3xl font-semibold mt-10 mb-4',
  3: 'text-xl sm:text-2xl font-semibold mt-8 mb-3',
  4: 'text-lg sm:text-xl font-semibold mt-6 mb-3',
  5: 'text-base sm:text-lg font-semibold mt-6 mb-2',
  6: 'text-sm sm:text-base font-semibold mt-6 mb-2',
};

const Markdown = ({ content }: { content: string }) => {
  const blocks = parseBlocks(content);

  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'hr':
            return <hr key={index} className="my-10 border-border" />;

          case 'heading': {
            const Tag = `h${Math.min(block.level + 1, 6)}` as 'h2';
            return (
              <Tag key={index} className={`${headingClasses[block.level]} first:mt-0 text-foreground`}>
                {renderInline(block.text)}
              </Tag>
            );
          }

          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul';
            return (
              <ListTag
                key={index}
                className={`my-5 space-y-2 pl-6 text-base sm:text-lg text-muted-foreground leading-relaxed text-justify hyphens-auto ${
                  block.ordered ? 'list-decimal' : 'list-disc'
                }`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="pl-1">
                    {renderInline(item)}
                  </li>
                ))}
              </ListTag>
            );
          }

          default:
            return (
              <p
                key={index}
                className="my-5 text-base sm:text-lg text-muted-foreground leading-relaxed text-justify hyphens-auto"
              >
                {renderInline(block.lines.join(' '))}
              </p>
            );
        }
      })}
    </div>
  );
};

export default Markdown;
