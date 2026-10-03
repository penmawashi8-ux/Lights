import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://poko.boardgamecat.com"),
  title: "ポコっとライト",
  description: "全部のマスを光らせよう！森の妖精ライトパズルゲーム",
  // このサブドメインはゲーム本体で、クローラーが読める本文がほとんどない。
  // 審査対象ドメイン boardgamecat.com に本文のないページを並べることになり、
  // AdSense の「screens without publisher-content」に当たるため
  // 検索インデックスから外す。説明文を持つ正規のページは
  // https://boardgamecat.com/games/poko-light 側。
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
