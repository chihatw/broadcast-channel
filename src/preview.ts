import { ChannelMessage, STORAGE_KEY, createChannel } from './channel.js';

const channel = createChannel();
const output = document.getElementById('output');

if (!(output instanceof HTMLDivElement)) {
  throw new Error('Output element was not found.');
}

const saved = localStorage.getItem(STORAGE_KEY);
output.textContent = saved !== null ? saved : '';

channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
  const { type } = event.data;

  if (type === 'update') {
    output.textContent = event.data.value;
  }

  if (type === 'reset') {
    output.textContent = '';
  }
};
