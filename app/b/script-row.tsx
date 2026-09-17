import { Item } from '@/lib/parser';
import { HighlightText } from './highlight-text';
import { uiColors } from './ui-colors';

export function ScriptRow({
  item,
  hideNotes,
}: {
  item: Item;
  hideNotes: boolean;
}) {
  const justify =
    item.type === 'self'
      ? 'justify-end'
      : item.type === 'meta'
        ? 'justify-center'
        : 'justify-start';
  const bubble =
    item.type === 'self'
      ? `${uiColors.text.base} ${uiColors.card.self}`
      : item.type === 'meta'
        ? `rounded-md ${uiColors.card.meta} px-4 py-1.5 text-center text-[0.875em] ${uiColors.text.meta}`
        : `${uiColors.card.other} ${uiColors.text.base}`;
  const bodyWidth = hideNotes
    ? 'max-w-full'
    : item.type === 'meta'
      ? 'max-w-[64%]'
      : 'max-w-[72%]';

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] items-start gap-3 ${hideNotes ? '' : 'sm:grid-cols-[minmax(7rem,10rem)_minmax(16rem,1fr)_minmax(7rem,10rem)] sm:gap-4'} ${item.type}`}
    >
      {hideNotes ? null : (
        <div
          className={`min-h-5 whitespace-pre-wrap wrap-break-word rounded-md ${uiColors.card.note} px-3.5 py-3 empty:invisible`}
        >
          <HighlightText text={item.otherNote} />
        </div>
      )}
      <div className={`flex ${justify}`}>
        <div
          className={`${bodyWidth} whitespace-pre-wrap wrap-break-word rounded-md px-4.5 py-3 ${bubble}`}
        >
          <HighlightText text={item.body} />
        </div>
      </div>
      {hideNotes ? null : (
        <div
          className={`min-h-5 whitespace-pre-wrap wrap-break-word rounded-md ${uiColors.card.note} px-3.5 py-3 empty:invisible`}
        >
          <HighlightText text={item.selfNote} />
        </div>
      )}
    </div>
  );
}
