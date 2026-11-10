import type { NextConfig } from "next";

// 静的書き出し。GitHub Pages で配信するため。
//
// Vercel の無料枠超過でアカウントが停止され、このゲームも止まっている
// （自動復帰は 11/29）。このゲームはサーバー側の処理を持たない
// 1ページ構成なので、静的ファイルとして出せばリクエスト課金の無い
// GitHub Pages から配信できる。
const nextConfig: NextConfig = {
  output: "export",
  // next/image の最適化はサーバーが要るので、静的書き出しでは使わない
  images: { unoptimized: true },
};

export default nextConfig;
