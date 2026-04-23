# BroadcastChannel テストプロジェクト

このプロジェクトは、ブラウザの `BroadcastChannel` を使って
同一オリジン内の複数ページ間でリアルタイム同期を行う簡単なデモです。

- `/a`：入力ページ
- `/b`：表示ページ

入力内容はリアルタイムで共有され、`localStorage` によってリロード後も保持されます。

---

## 構成

```
project/
├── index.html   # /a（入力）
├── preview.html # /b（表示）
└── server.js    # ローカルサーバー
```

---

## 動作環境

- Node.js（v14 以上推奨）
- モダンブラウザ（Chrome / Edge / Firefox）

---

## 実行手順

### 1. プロジェクトフォルダに移動

```bash
cd project
```

### 2. サーバーを起動

```bash
node server.js
```

### 3. ブラウザで開く

以下の2つを**別ウィンドウまたは別タブで開く**

- http://localhost:3000/a
- http://localhost:3000/b

---

## 機能

### リアルタイム同期

- `/a` に入力すると `/b` に即時反映される

### 状態保持

- リロードしても入力内容は保持される（localStorage使用）

### リセット機能

- `/a` の「リセット」ボタンで
  - 入力内容削除
  - `/b` の表示も同時にクリア

---

## 使用技術

- BroadcastChannel API（ブラウザ間通信）
- localStorage（簡易永続化）
- Node.js（簡易HTTPサーバー）

---

## 制限事項

- 同一オリジン（localhost:3000）でのみ動作
- 別デバイス間では同期されない
- データベースは使用していない（完全クライアント内状態）

---

## 今後の拡張案

- WebSocket を使ったサーバー経由のリアルタイム通信
- SQLite / Supabase などとの連携
- 双方向編集（/b → /a）
- データ構造の複雑化（JSONベース）

---

## 補足

BroadcastChannel は「同一ブラウザ内の軽量な Pub/Sub」のような仕組みです。
Supabase Realtime の概念をローカルで理解するのに適しています。
