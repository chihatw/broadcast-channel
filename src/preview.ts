import { ChannelMessage, STORAGE_KEY, createChannel } from './channel.js';
import { parseScript } from './parser.js';

const channel = createChannel();
const output = document.getElementById('output');

if (!(output instanceof HTMLPreElement)) {
  throw new Error('Output element was not found.');
}

const outputElement = output;

function renderParseResult(value: string): void {
  try {
    outputElement.textContent = JSON.stringify(parseScript(value), null, 2);
  } catch (error) {
    outputElement.textContent =
      error instanceof Error ? error.message : 'パースに失敗しました。';
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
