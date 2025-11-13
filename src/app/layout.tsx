import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const metadata = {
  title: "Modal SearchParams Demo",
  description: "Next.js + Radix UI Dialog + nuqs でモーダルをURL管理するデモ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {/* nuqs で searchParams を React state と同期するための Adapter */}
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
