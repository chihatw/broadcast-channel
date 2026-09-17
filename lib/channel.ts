export const CHANNEL_NAME = 'demo';
export const STORAGE_KEY = 'shared';
export const FONT_SCALE_STORAGE_KEY = 'preview-font-scale';
export const DEFAULT_FONT_SCALE = 1;
export const MIN_FONT_SCALE = 1;
export const MAX_FONT_SCALE = 8;

export function clampFontScale(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_FONT_SCALE;

  return Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, value));
}

export type ChannelMessage =
  | {
      type: 'update';
      value: string;
    }
  | {
      type: 'reset';
    }
  | {
      type: 'font-scale';
      value: number;
    };

export function createChannel(): BroadcastChannel {
  return new BroadcastChannel(CHANNEL_NAME);
}
