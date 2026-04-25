import { Item } from '@/lib/parser';
import { HighlightText } from './highlight-text';
import { uiColors } from './ui-colors';

export function ScriptRow({ item }: { item: Item }) {
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
        ? `max-w-[64%] rounded-md ${uiColors.card.meta} px-4 py-1.5 text-center text-sm ${uiColors.text.meta}`
        : `${uiColors.card.other} ${uiColors.text.base}`;

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] items-start gap-3 sm:grid-cols-[minmax(7rem,10rem)_minmax(16rem,1fr)_minmax(7rem,10rem)] sm:gap-4 ${item.type}`}
    >
      <div
        className={`min-h-5 whitespace-pre-wrap wrap-break-word rounded-md ${uiColors.card.note} px-3.5 py-3 empty:invisible`}
      >
        <HighlightText text={item.otherNote} />
      </div>
      <div className={`flex ${justify}`}>
        <div
          className={`max-w-[72%] whitespace-pre-wrap wrap-break-word rounded-md px-4.5 py-3 ${bubble}`}
        >
          <HighlightText text={item.body} />
        </div>
      </div>
      <div
        className={`min-h-5 whitespace-pre-wrap wrap-break-word rounded-md ${uiColors.card.note} px-3.5 py-3 empty:invisible`}
      >
        <HighlightText text={item.selfNote} />
      </div>
    </div>
  );
}
