'use client';

import {
  DEFAULT_FONT_SCALE,
  FONT_SCALE_STORAGE_KEY,
  MAX_FONT_SCALE,
  MIN_FONT_SCALE,
  type ChannelMessage,
  STORAGE_KEY,
  clampFontScale,
  createChannel,
} from '@/lib/channel';
import { stripScriptNotes } from '@/lib/parser';
import { useEffect, useRef, useState } from 'react';

export function InputPage() {
  const [value, setValue] = useState('');
  const [copyStatus, setCopyStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [fontScale, setFontScale] = useState(DEFAULT_FONT_SCALE);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = createChannel();
    channelRef.current = channel;
    setValue(localStorage.getItem(STORAGE_KEY) ?? '');
    setFontScale(
      clampFontScale(Number(localStorage.getItem(FONT_SCALE_STORAGE_KEY))),
    );

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
    setCopyStatus('idle');
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

  function updateFontScale(nextScale: number) {
    const scale = clampFontScale(nextScale);
    const message: ChannelMessage = {
      type: 'font-scale',
      value: scale,
    };

    setFontScale(scale);
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(scale));
    channelRef.current?.postMessage(message);
  }

  async function copyOriginalText() {
    try {
      await navigator.clipboard.writeText(stripScriptNotes(value));
      setCopyStatus('success');
    } catch (error) {
      console.error(error);
      setCopyStatus('error');
    }
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
              {copyStatus === 'success'
                ? 'オリジナルをクリップボードにコピーしました。'
                : copyStatus === 'error'
                  ? 'コピーに失敗しました。入力形式を確認してください。'
                  : '入力内容は同一オリジン内の /b に同期されます。'}
            </p>
            <div className='flex shrink-0 items-center gap-2'>
              <button
                className='rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100'
                type='button'
                onClick={copyOriginalText}
              >
                オリジナル
              </button>
              <button
                className='rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700'
                type='button'
                onClick={resetValue}
              >
                リセット
              </button>
            </div>
          </div>
        </section>

        <section className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='mb-3 flex items-center justify-between gap-4'>
            <div>
              <h2 className='font-semibold'>表示ページの文字サイズ</h2>
              <p className='text-sm text-slate-500'>
                /b の文字だけをリアルタイムに拡大します。
              </p>
            </div>
            <output
              className='min-w-16 text-right text-lg font-semibold tabular-nums'
              htmlFor='font-scale'
            >
              {Math.round(fontScale * 100)}%
            </output>
          </div>
          <div className='flex items-center gap-3'>
            <input
              id='font-scale'
              className='min-w-0 flex-1 accent-slate-900'
              type='range'
              min={MIN_FONT_SCALE}
              max={MAX_FONT_SCALE}
              step={0.1}
              value={fontScale}
              aria-label='表示ページの文字サイズ'
              onChange={(event) => updateFontScale(event.target.valueAsNumber)}
            />
            <button
              className='shrink-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100'
              type='button'
              onClick={() => updateFontScale(DEFAULT_FONT_SCALE)}
            >
              100%に戻す
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
