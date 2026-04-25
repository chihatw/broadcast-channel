import { uiColors } from './ui-colors';

export function HighlightText({ text }: { text?: string }) {
  if (!text) return null;

  const parts = text.split(/(`[^`]*`|~[^~]*~)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <span key={index} className={uiColors.text.highlight1}>
              {part.slice(1, -1)}
            </span>
          );
        }

        if (part.startsWith('~') && part.endsWith('~')) {
          return (
            <span key={index} className={uiColors.text.highlight2}>
              {part.slice(1, -1)}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
