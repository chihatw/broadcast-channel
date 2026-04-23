'use client';

import { type ChannelMessage, STORAGE_KEY, createChannel } from '@/lib/channel';
import { useEffect, useRef, useState } from 'react';

export function InputPage() {
  const [value, setValue] = useState('');
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = createChannel();
    channelRef.current = channel;
    setValue(localStorage.getItem(STORAGE_KEY) ?? '');

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  function updateValue(nextValue: string) {
    const message: ChannelMessage = {
      type: 'update',
      value: nextValue,
    };

    setValue(nextValue);
    localStorage.setItem(STORAGE_KEY, nextValue);
    channelRef.current?.postMessage(message);
  }

  function resetValue() {
    const message: ChannelMessage = {
      type: 'reset',
    };

    setValue('');
    localStorage.removeItem(STORAGE_KEY);
    channelRef.current?.postMessage(message);
  }

  return (
    <main className='min-h-screen bg-slate-50 px-5 py-8 text-slate-950'>
      <div className='mx-auto flex max-w-3xl flex-col gap-5'>
        <header className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-slate-500'>Page A</p>
            <h1 className='text-2xl font-semibold'>入力</h1>
          </div>
          <a
            className='rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white'
            href='/b'
            target='_blank'
            rel='noreferrer'
          >
            表示ページを開く
          </a>
        </header>

        <section className='flex flex-col gap-3'>
          <textarea
            className='min-h-64 resize-y rounded-md border border-slate-300 bg-white p-4 leading-7 shadow-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200'
            value={value}
            onChange={(event) => updateValue(event.target.value)}
            placeholder={
              '例:\na: こんにちは [小さく手を振る]\nb: [驚く] こんにちは\nmeta: 場面転換'
            }
          />
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm text-slate-500'>
              入力内容は同一オリジン内の /b に同期されます。
            </p>
            <button
              className='rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700'
              type='button'
              onClick={resetValue}
            >
              リセット
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
