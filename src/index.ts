import { ChannelMessage, STORAGE_KEY, createChannel } from './channel.js';

const channel = createChannel();
const input = document.getElementById('input');
const resetButton = document.getElementById('reset');

if (!(input instanceof HTMLInputElement)) {
  throw new Error('Input element was not found.');
}

if (!(resetButton instanceof HTMLButtonElement)) {
  throw new Error('Reset button was not found.');
}

const saved = localStorage.getItem(STORAGE_KEY);
if (saved !== null) {
  input.value = saved;
}

input.addEventListener('input', () => {
  const value = input.value;
  const message: ChannelMessage = {
    type: 'update',
    value,
  };

  localStorage.setItem(STORAGE_KEY, value);
  channel.postMessage(message);
});

resetButton.addEventListener('click', () => {
  const message: ChannelMessage = {
    type: 'reset',
  };

  localStorage.removeItem(STORAGE_KEY);
  input.value = '';
  channel.postMessage(message);
});
