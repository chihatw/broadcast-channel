'use client';

import {
  DEFAULT_FONT_SCALE,
  FONT_SCALE_STORAGE_KEY,
  type ChannelMessage,
  STORAGE_KEY,
  clampFontScale,
  createChannel,
} from '@/lib/channel';
import { type Item, parseScript } from '@/lib/parser';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScriptRow } from './script-row';
import { uiColors } from './ui-colors';

type ParseState =
  | {
      status: 'success';
      items: Item[];
    }
  | {
      status: 'error';
      message: string;
    };

function parseValue(value: string): ParseState {
  try {
    return {
      status: 'success',
      items: parseScript(value),
    };
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error ? error.message : 'パースに失敗しました。',
    };
  }
}

export function PreviewPage() {
  const [result, setResult] = useState<ParseState>({
    status: 'success',
    items: [],
  });
  const [fontScale, setFontScale] = useState(DEFAULT_FONT_SCALE);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const scrollPositionRef = useRef<number | null>(null);
  const hideNotes = fontScale >= 2;

  useLayoutEffect(() => {
    if (scrollPositionRef.current === null) return;

    window.scrollTo(0, scrollPositionRef.current);
    scrollPositionRef.current = null;
  }, [result]);

  useEffect(() => {
    const channel = createChannel();
    channelRef.current = channel;
    setResult(parseValue(localStorage.getItem(STORAGE_KEY) ?? ''));
    setFontScale(
      clampFontScale(Number(localStorage.getItem(FONT_SCALE_STORAGE_KEY))),
    );

    channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data.type === 'update') {
        scrollPositionRef.current = window.scrollY;
        setResult(parseValue(event.data.value));
      }

      if (event.data.type === 'reset') {
        scrollPositionRef.current = window.scrollY;
        setResult(parseValue(''));
      }

      if (event.data.type === 'font-scale') {
        setFontScale(clampFontScale(event.data.value));
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col gap-[0.5em] ${uiColors.screen.background} px-4 pt-4 pb-[100dvh] ${uiColors.text.base}`}
      style={{ fontSize: `calc(1rem * ${fontScale})` }}
    >
      {result.status === 'error' ? (
        <div
          className={`rounded-md ${uiColors.card.error} px-3.5 py-3 ${uiColors.text.error}`}
        >
          {result.message}
        </div>
      ) : (
        result.items.map((item, index) => (
          <ScriptRow
            key={`${item.type}-${index}-${item.body}`}
            item={item}
            hideNotes={hideNotes}
          />
        ))
      )}
    </main>
  );
}
