"use client";

import { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useQueryState } from "nuqs";

type Item = {
  id: string;
  title: string;
  description: string;
};

const ITEMS: Item[] = [
  { id: "1", title: "Item 1", description: "これは Item 1 の説明です" },
  { id: "2", title: "Item 2", description: "これは Item 2 の説明です" },
  { id: "3", title: "Item 3", description: "これは Item 3 の説明です" },
];

/**
 * アイテム一覧 + モーダル。
 *
 * - URL の searchParams (dialog, id) を状態として扱う
 * - useEffect は使わず、「イベントハンドラで URL を書き換える → 再レンダリング」の流れだけで制御する
 */
export default function ItemsPage() {
  // ?dialog=... （"detail" のときだけモーダルを開く想定）
  const [dialog, setDialog] = useQueryState("dialog");
  // ?id=... （どのアイテムを対象にするか）
  const [id, setId] = useQueryState("id");

  const isOpen = dialog === "detail" && !!id;

  const selectedItem = useMemo(
    () => ITEMS.find((item) => item.id === id ?? undefined) ?? null,
    [id]
  );

  /**
   * 一覧の「詳細を見る」ボタンを押したときに呼ばれる。
   *
   * 1. URL に `id` をセット
   * 2. URL に `dialog=detail` をセット
   *
   * 結果として:
   *   - URL が `/items?dialog=detail&id=2` になる
   *   - 再レンダリングされ、Dialog の `open` が true になるのでモーダルが表示される
   */
  const handleOpen = (itemId: string) => {
    setId(itemId); // -> ?id=2 が付く
    setDialog("detail"); // -> ?dialog=detail&id=2 になる
  };

  /**
   * モーダルを閉じるときに呼ばれる。
   *
   * 1. 先に `dialog` だけ消す（= open を false にする）
   * 2. 必要なら setTimeout などで少し待ってから `id` も消す（任意）
   *
   * ここでは簡略化のため、即両方消している。
   */
  const handleClose = () => {
    setDialog(null); // -> ?dialog が消える
    // アニメーション完了後に id を消すのが丁寧（今回は簡略化で即消す）
    setTimeout(() => setId(null), 200);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold">アイテム一覧</h1>
        
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="mb-4 text-sm text-gray-600">
            各アイテムの「詳細を見る」ボタンをクリックすると、URL の searchParams が変わってモーダルが開きます。
          </p>
          <ul className="space-y-2">
            {ITEMS.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded border p-3 hover:bg-gray-50"
              >
                <span className="font-medium">{item.title}</span>
                <button
                  type="button"
                  className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  onClick={() => handleOpen(item.id)}
                >
                  詳細を見る
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 現在のURL状態を表示（デバッグ用） */}
        <div className="rounded-lg bg-blue-50 p-4 text-sm">
          <p className="font-semibold mb-2">🔍 現在のURL状態:</p>
          <p>dialog: <code className="bg-white px-2 py-1 rounded">{dialog || "null"}</code></p>
          <p>id: <code className="bg-white px-2 py-1 rounded">{id || "null"}</code></p>
          <p>isOpen: <code className="bg-white px-2 py-1 rounded">{String(isOpen)}</code></p>
        </div>
      </div>

      <ItemDetailDialog open={isOpen} item={selectedItem} onClose={handleClose} />
    </div>
  );
}

/**
 * アイテム詳細モーダル。
 *
 * - `open` は親から完全にコントロールされる（制御コンポーネント）
 * - URL をいじる責務は親だけが持つ（このコンポーネントは URL を知らない）
 */
function ItemDetailDialog(props: {
  open: boolean;
  item: Item | null;
  onClose: () => void;
}) {
  const { open, item, onClose } = props;

  /**
   * Radix Dialog の `onOpenChange` は「ユーザー操作」による開閉を通知してくる。
   * 今回は `open` のソースオブトゥルースが親側なので、
   * false になったときだけ `onClose` を呼び出して URL 更新をしてもらう。
   */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* オーバーレイ */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        
        {/* コンテンツ */}
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down">
          <Dialog.Title className="mb-2 text-xl font-semibold">
            {item ? item.title : "No item"}
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-gray-600">
            {item ? item.description : "対象データがありません"}
          </Dialog.Description>

          <div className="rounded bg-gray-50 p-4 mb-4 text-sm">
            <p className="font-semibold mb-1">💡 ポイント:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>このモーダルは URL の <code className="bg-white px-1">?dialog=detail&id={item?.id}</code> で開いています</li>
              <li>Esc キーでも閉じられます</li>
              <li>閉じるとURLから searchParams が消えます</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                閉じる
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
