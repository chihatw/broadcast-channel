export const CHANNEL_NAME = 'demo';
export const STORAGE_KEY = 'shared';

export type ChannelMessage =
  | {
      type: 'update';
      value: string;
    }
  | {
      type: 'reset';
    };

export function createChannel(): BroadcastChannel {
  return new BroadcastChannel(CHANNEL_NAME);
}
