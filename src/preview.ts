import { ChannelMessage, STORAGE_KEY, createChannel } from './channel.js';
import { Item, parseScript } from './parser.js';

const channel = createChannel();
const output = document.getElementById('output');

if (!(output instanceof HTMLDivElement)) {
  throw new Error('Output element was not found.');
}

const outputElement = output;

function createCell(className: string, text: string): HTMLDivElement {
  const element = document.createElement('div');
  element.className = className;
  element.textContent = text;
  return element;
}

function createItemRow(item: Item): HTMLDivElement {
  const row = document.createElement('div');
  row.className = `script-row ${item.type}`;

  const main = document.createElement('div');
  main.className = 'main';
  main.append(createCell('bubble', item.body));

  row.append(
    createCell('note other-note', item.otherNote ?? ''),
    main,
    createCell('note self-note', item.selfNote ?? ''),
  );

  return row;
}

function renderParseResult(value: string): void {
  outputElement.replaceChildren();

  try {
    const rows = parseScript(value).map(createItemRow);
    outputElement.append(...rows);
  } catch (error) {
    outputElement.append(
      createCell(
        'error',
        error instanceof Error ? error.message : 'パースに失敗しました。',
      ),
    );
  }
}

const saved = localStorage.getItem(STORAGE_KEY);
renderParseResult(saved !== null ? saved : '');

channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
  const { type } = event.data;

  if (type === 'update') {
    renderParseResult(event.data.value);
  }

  if (type === 'reset') {
    renderParseResult('');
  }
};
