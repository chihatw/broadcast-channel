'use client';

import { type ChannelMessage, STORAGE_KEY, createChannel } from '@/lib/channel';
import { type Item, parseScript } from '@/lib/parser';
import { useEffect, useRef, useState } from 'react';

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

function ScriptRow({ item }: { item: Item }) {
  const justify =
    item.type === 'self'
      ? 'justify-end'
      : item.type === 'meta'
        ? 'justify-center'
        : 'justify-start';
  const bubble =
    item.type === 'self'
      ? 'bg-[#a9f58b] text-slate-950'
      : item.type === 'meta'
        ? 'max-w-[64%] rounded-md bg-slate-100 px-4 py-1.5 text-center text-sm text-slate-500'
        : 'bg-white text-slate-950';

  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)] items-start gap-3 sm:grid-cols-[minmax(7rem,10rem)_minmax(16rem,1fr)_minmax(7rem,10rem)] sm:gap-4 ${item.type}`}
    >
      <div className='min-h-5 whitespace-pre-wrap wrap-break-word rounded-md bg-[#fff7b8] px-3.5 py-3 empty:invisible'>
        {item.otherNote}
      </div>
      <div className={`flex ${justify}`}>
        <div
          className={`max-w-[72%] whitespace-pre-wrap wrap-break-word rounded-md px-4.5 py-3 ${bubble}`}
        >
          {item.body}
        </div>
      </div>
      <div className='min-h-5 whitespace-pre-wrap wrap-break-word rounded-md bg-[#fff7b8] px-3.5 py-3 empty:invisible'>
        {item.selfNote}
      </div>
    </div>
  );
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
    <main className='flex min-h-screen flex-col gap-2 bg-[#a9bdea] p-4 text-slate-950'>
      {result.status === 'error' ? (
        <div className='rounded-md bg-red-100 px-3.5 py-3 text-red-900'>
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
