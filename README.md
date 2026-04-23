# BroadcastChannel テストプロジェクト

Next.js + TypeScript + Tailwind CSS + pnpm で構成した、ブラウザの `BroadcastChannel` デモです。
同一オリジン内の複数ページ間で入力内容をリアルタイム同期します。

- `/a`: 入力ページ
- `/b`: 表示ページ

入力内容は `localStorage` に保存されるため、リロード後も保持されます。

## 構成

```txt
project/
├── src/
│   ├── app/
│   │   ├── a/          # /a 入力ページ
│   │   ├── b/          # /b 表示ページ
│   │   ├── globals.css # Tailwind CSS
│   │   ├── layout.tsx
│   │   └── page.tsx    # / から /a へリダイレクト
│   ├── channel.ts      # BroadcastChannel 共通設定
│   └── parser.ts       # 入力テキストのパーサー
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## 動作環境

- Node.js 20.9 以上
- pnpm
- モダンブラウザ（Chrome / Edge / Firefox）

## 実行手順

依存関係をインストールします。

```bash
pnpm install
```

開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで以下の2つを別ウィンドウまたは別タブで開きます。

- http://localhost:3000/a
- http://localhost:3000/b

## コマンド

```bash
pnpm dev        # 開発サーバー
pnpm build      # 本番ビルド
pnpm start      # 本番サーバー
pnpm typecheck  # 型チェック
```

## 機能

- `/a` に入力すると `/b` に即時反映
- 入力内容を `localStorage` に保存
- `/a` のリセットボタンで入力と表示を同時にクリア
- `/` は `/a` にリダイレクト

## 入力形式

```txt
a: 自分の発話 [自分側メモ]
b: [相手側メモ] 相手の発話
meta: 場面転換
```

角括弧内の `\` は表示時に改行として扱われます。

## 制限事項

- 同一オリジンでのみ同期されます
- 別デバイス間では同期されません
- データベースは使用していません
