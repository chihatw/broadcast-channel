export type ItemType = 'self' | 'other' | 'meta';

export type Item = {
  type: ItemType;
  body: string;
  otherNote?: string;
  selfNote?: string;
};

const speakerMap: Record<string, ItemType> = {
  a: 'self',
  b: 'other',
  meta: 'meta',
};

function decodeLineBreaks(value: string): string {
  return value.replace(/\\/g, '\n');
}

export function parseScript(input: string): Item[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const items: Item[] = [];

  for (const line of lines) {
    const m = line.match(/^(meta|a|b)\s*[:：]\s*(.*)$/);
    if (!m) {
      throw new Error(`行の形式が不正です: ${line}`);
    }

    const speaker = m[1];
    let rest = m[2].trim();

    const item: Item = {
      type: speakerMap[speaker],
      body: '',
    };

    const headNoteMatch = rest.match(/^\[([^[\]]*?)\]\s*/);
    if (headNoteMatch) {
      item.otherNote = decodeLineBreaks(headNoteMatch[1].trim());
      rest = rest.slice(headNoteMatch[0].length).trim();
    }

    const tailNoteMatch = rest.match(/\s*\[([^[\]]*?)\]$/);
    if (tailNoteMatch) {
      item.selfNote = decodeLineBreaks(tailNoteMatch[1].trim());
      rest = rest.slice(0, rest.length - tailNoteMatch[0].length).trim();
    }

    item.body = decodeLineBreaks(rest);

    items.push(item);
  }

  return items;
}
