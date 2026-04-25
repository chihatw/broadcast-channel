'use client';

import { type ChannelMessage, STORAGE_KEY, createChannel } from '@/lib/channel';
import { type Item, parseScript } from '@/lib/parser';
import { useEffect, useRef, useState } from 'react';
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
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = createChannel();
    channelRef.current = channel;
    setResult(parseValue(localStorage.getItem(STORAGE_KEY) ?? ''));

    channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      if (event.data.type === 'update') {
        setResult(parseValue(event.data.value));
      }

      if (event.data.type === 'reset') {
        setResult(parseValue(''));
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col gap-2 ${uiColors.screen.background} p-4 ${uiColors.text.base}`}
    >
      {result.status === 'error' ? (
        <div
          className={`rounded-md ${uiColors.card.error} px-3.5 py-3 ${uiColors.text.error}`}
        >
          {result.message}
        </div>
      ) : (
        result.items.map((item, index) => (
          <ScriptRow key={`${item.type}-${index}-${item.body}`} item={item} />
        ))
      )}
    </main>
  );
}
