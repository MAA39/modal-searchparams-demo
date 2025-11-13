# Modal SearchParams Demo

Next.js + Radix UI Dialog + nuqs で **モーダルをURLのsearchParamsで管理する** デモアプリです。

## 🎯 このデモで学べること

- ✅ URLの `?dialog=detail&id=2` でモーダルの開閉状態を管理
- ✅ `useEffect` を使わずにイベントハンドラだけで完結
- ✅ Radix UI Dialog で a11y 対応（Esc キー、フォーカス管理）
- ✅ nuqs で searchParams を React state のように扱う
- ✅ リロードしてもモーダルが開いた状態を維持
- ✅ URL を共有すれば同じ状態を再現可能

## 🚀 セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/MAA39/modal-searchparams-demo.git
cd modal-searchparams-demo

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

http://localhost:3000 にアクセス

## 📁 ファイル構成

```
modal-searchparams-demo/
├── src/
│   └── app/
│       ├── layout.tsx      # NuqsAdapter のセットアップ
│       ├── page.tsx        # メインページ（一覧 + モーダル）
│       └── globals.css     # Tailwind + アニメーション
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 💡 核心コード

### URL状態管理（nuqs）
```typescript
const [dialog, setDialog] = useQueryState("dialog");  // ?dialog=...
const [id, setId] = useQueryState("id");              // ?id=...

const isOpen = dialog === "detail" && !!id;
```

### モーダルを開く
```typescript
const handleOpen = (itemId: string) => {
  setId(itemId);          // ?id=2
  setDialog("detail");    // ?dialog=detail&id=2
};
```

### モーダルを閉じる
```typescript
const handleClose = () => {
  setDialog(null);                    // dialog を消す
  setTimeout(() => setId(null), 200); // アニメ後に id も消す
};
```

## 🔍 動作確認ポイント

1. **「詳細を見る」をクリック**
   - URL が `/?dialog=detail&id=1` に変わる
   - モーダルが開く

2. **Esc キーを押す**
   - モーダルが閉じる
   - URL から `?dialog=...&id=...` が消える

3. **モーダルが開いた状態でリロード**
   - URL の状態が維持される
   - モーダルも開いたまま

4. **ブラウザの戻るボタン**
   - URL の履歴をたどってモーダルが閉じる

## 📚 技術スタック

- **Next.js 15** - App Router
- **Radix UI Dialog** - アクセシブルなモーダル
- **nuqs** - searchParams を React state 化
- **TypeScript** - 型安全
- **Tailwind CSS** - スタイリング

## 🎓 参考資料

このデモは以下のDiscordスレッドの議論を基に作成されました：
- Modalコンポーネントの表示非表示の書き方
- ninoさんのベストプラクティス提案

## 📝 ライセンス

MIT
