"use client";

export default function ModeSelectScreen({
  onFreeMode,
  onChallenge,
  onAdventure,
}: {
  onFreeMode: () => void;
  onChallenge: () => void;
  onAdventure: () => void;
}) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-6 fade-in-up">
      {/* 木の看板タイトル */}
      <div className="text-center space-y-2">
        <div className="relative inline-block">
          <div className="absolute -top-3 left-8 w-2.5 h-6 bg-amber-600 rounded-full opacity-80" />
          <div className="absolute -top-3 right-8 w-2.5 h-6 bg-amber-600 rounded-full opacity-80" />
          <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-3xl px-8 py-3.5 shadow-2xl border-2 border-amber-500/60">
            <h1 className="text-yellow-100 font-black text-2xl tracking-wide drop-shadow-lg">
              ポコっとライト
            </h1>
          </div>
        </div>
        <p className="text-green-400 text-sm font-medium">全部のマスを光らせよう！</p>
      </div>

      {/* キャラクター列 */}
      <div className="flex items-end justify-around px-2">
        {[
          { src: "/chars/owl.png",    label: "フクロウ", delay: "0s" },
          { src: "/chars/rabbit.png", label: "ウサギ",   delay: "0.5s" },
          { src: "/chars/bear.png",   label: "クマ",     delay: "1s" },
          { src: "/chars/fox.png",    label: "キツネ",   delay: "1.5s" },
        ].map(({ src, label, delay }) => (
          <div key={label} className="flex flex-col items-center gap-1 float-anim" style={{ animationDelay: delay }}>
            <img src={src} alt={label} className="w-14 h-14 object-contain" draggable={false} />
          </div>
        ))}
      </div>

      {/* モード選択カード */}
      <div className="space-y-3 px-1">
        {/* フリーモード */}
        <button
          onClick={onFreeMode}
          className="w-full bg-gradient-to-br from-green-700/80 to-green-900/90 border border-green-600/50 rounded-2xl p-5 flex items-center gap-4 active:scale-95 transition-all duration-150 shadow-xl hover:from-green-600/80"
        >
          <div className="text-left">
            <p className="text-white font-black text-xl">フリーモード</p>
            <p className="text-green-300 text-sm mt-0.5">パターン・サイズを自分で選んで<br />自由にあそぶ</p>
          </div>
          <span className="ml-auto text-green-400 text-xl font-black">▶</span>
        </button>

        {/* チャレンジモード */}
        <button
          onClick={onChallenge}
          className="w-full bg-gradient-to-br from-red-700/80 to-red-900/90 border border-red-600/50 rounded-2xl p-5 flex items-center gap-4 active:scale-95 transition-all duration-150 shadow-xl hover:from-red-600/80"
        >
          <div className="text-left">
            <p className="text-white font-black text-xl">チャレンジモード</p>
            <p className="text-red-200 text-sm mt-0.5">手数制限あり！<br />限られた手数でクリアできるか？</p>
          </div>
          <span className="ml-auto text-red-400 text-xl font-black">▶</span>
        </button>

        {/* 冒険モード */}
        <button
          onClick={onAdventure}
          className="w-full bg-gradient-to-br from-amber-700/80 to-amber-900/90 border border-amber-600/50 rounded-2xl p-5 flex items-center gap-4 active:scale-95 transition-all duration-150 shadow-xl hover:from-amber-600/80"
        >
          <div className="text-left">
            <p className="text-white font-black text-xl">冒険モード</p>
            <p className="text-amber-200 text-sm mt-0.5">全1600ステージに挑戦！<br />パターン×サイズ×100問</p>
          </div>
          <span className="ml-auto text-amber-400 text-xl font-black">▶</span>
        </button>
      </div>

      {/* 下部キャラクター */}
      <div className="flex items-end justify-around px-4">
        {[
          { src: "/chars/hedgehog.png", delay: "0.3s" },
          { src: "/chars/campfire.png", delay: "0.8s" },
          { src: "/chars/raccoon.png",  delay: "1.3s" },
        ].map(({ src, delay }) => (
          <div key={src} className="float-anim" style={{ animationDelay: delay }}>
            <img src={src} alt="" className="w-14 h-14 object-contain" draggable={false} />
          </div>
        ))}
      </div>

      {/* トップへ戻るボタン */}
      <div className="flex justify-center pt-1">
        <a
          href="https://boardgamecat.com"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-500/70 text-amber-100 text-sm font-black shadow-lg shadow-black/50 active:scale-95 hover:from-amber-600 hover:to-amber-800 transition-all duration-150"
        >
          ◀ トップへ戻る
        </a>
      </div>
    </div>
  );
}
