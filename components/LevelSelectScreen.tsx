"use client";

import { useState, useEffect } from "react";
import {
  PATTERN_KEYS, BOARD_SIZES, PATTERN_DISPLAY,
  getLevelDifficulty, type PatternKey,
} from "@/lib/levels";
import {
  loadProgress, getClearedSet, getUnlockedUpTo, getTotalCleared,
  type ProgressData,
} from "@/lib/progress";
import type { BoardSize } from "@/lib/gameLogic";

interface Props {
  onSelectLevel: (pattern: PatternKey, size: BoardSize, levelIndex: number) => void;
  onBack: () => void;
}

type Step = "pattern" | "size" | "levels";

const DIFF_COLOR: Record<string, string> = {
  easy:   "bg-emerald-700/60 text-emerald-100",
  normal: "bg-amber-700/60   text-amber-100",
  hard:   "bg-red-800/60     text-red-100",
};

export default function LevelSelectScreen({ onSelectLevel, onBack }: Props) {
  const [step, setStep]         = useState<Step>("pattern");
  const [pattern, setPattern]   = useState<PatternKey>("plus");
  const [size, setSize]         = useState<BoardSize>(3);
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => { setProgress(loadProgress()); }, []);

  const total = getTotalCleared(progress);

  /* ── Step 1: Choose pattern ── */
  if (step === "pattern") {
    return (
      <div className="w-full max-w-sm mx-auto fade-in-up space-y-4">
        <Header onBack={onBack} title="冒険モード" />

        <div className="bg-green-900/50 rounded-2xl px-4 py-2 border border-green-700/40 flex justify-between items-center">
          <span className="text-green-300 text-sm">全クリア済み</span>
          <span className="text-yellow-300 font-black">{total} / 1600</span>
        </div>

        <p className="text-green-300 text-sm text-center font-semibold">パターンを選ぼう</p>

        <div className="grid grid-cols-2 gap-3">
          {PATTERN_KEYS.map((pk) => {
            const d = PATTERN_DISPLAY[pk];
            // count cleared for this pattern
            const cleared = BOARD_SIZES.reduce((n, s) =>
              n + getClearedSet(progress, pk, s).size, 0);
            return (
              <button
                key={pk}
                onClick={() => { setPattern(pk); setStep("size"); }}
                className="bg-gradient-to-br from-green-800/80 to-green-900/80 hover:from-green-700/80 active:scale-95 rounded-2xl p-4 border border-green-600/40 shadow-lg transition-all duration-150 text-left"
              >
                <div className="text-3xl font-black text-yellow-300 mb-1">{d.emoji}</div>
                <div className="text-white font-bold text-sm">{d.label}</div>
                <div className="text-green-300 text-xs mt-0.5 leading-tight">{d.desc}</div>
                <div className="mt-2 text-yellow-400 text-xs font-semibold">
                  {cleared} / 400
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Step 2: Choose board size ── */
  if (step === "size") {
    return (
      <div className="w-full max-w-sm mx-auto fade-in-up space-y-4">
        <Header onBack={() => setStep("pattern")} title={PATTERN_DISPLAY[pattern].label} />

        <p className="text-green-300 text-sm text-center font-semibold">ボードサイズを選ぼう</p>

        <div className="grid grid-cols-2 gap-3">
          {BOARD_SIZES.map((s) => {
            const cleared = getClearedSet(progress, pattern, s);
            const unlocked = getUnlockedUpTo(cleared);
            return (
              <button
                key={s}
                onClick={() => { setSize(s); setStep("levels"); }}
                className="bg-gradient-to-br from-green-800/80 to-green-900/80 hover:from-green-700/80 active:scale-95 rounded-2xl p-4 border border-green-600/40 shadow-lg transition-all duration-150 text-center"
              >
                <div className="text-2xl font-black text-yellow-200 mb-1">{s}×{s}</div>
                <div className="text-green-300 text-xs">ボード</div>
                <div className="mt-2 text-yellow-400 text-xs font-semibold">
                  {cleared.size} / 100
                </div>
                <div className="text-green-400 text-xs">
                  Lv {unlocked + 1} まで解放
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Step 3: 100-level grid ── */
  const cleared  = getClearedSet(progress, pattern, size);
  const unlocked = getUnlockedUpTo(cleared);
  // nextLevel: first uncompleted unlocked level
  const nextIdx  = (() => {
    for (let i = 0; i <= unlocked; i++) { if (!cleared.has(i)) return i; }
    return null;
  })();

  return (
    <div className="w-full max-w-sm mx-auto fade-in-up space-y-3">
      <Header
        onBack={() => setStep("size")}
        title={`${PATTERN_DISPLAY[pattern].label} — ${size}×${size}`}
      />

      <div className="bg-green-900/50 rounded-2xl px-4 py-2 border border-green-700/40 flex justify-between items-center">
        <span className="text-green-300 text-sm">クリア</span>
        <span className="text-yellow-300 font-black">{cleared.size} / 100</span>
      </div>

      {/* Difficulty legend */}
      <div className="flex gap-2 justify-center text-[10px]">
        <span className="px-2 py-0.5 bg-emerald-700/60 text-emerald-100 rounded-full">かんたん 1-33</span>
        <span className="px-2 py-0.5 bg-amber-700/60 text-amber-100 rounded-full">ふつう 34-66</span>
        <span className="px-2 py-0.5 bg-red-800/60 text-red-100 rounded-full">むずかしい 67-100</span>
      </div>

      <div className="grid grid-cols-10 gap-1 overflow-y-auto max-h-[55vh]">
        {Array.from({ length: 100 }, (_, i) => {
          const isCleared  = cleared.has(i);
          const isLocked   = i > unlocked;
          const isNext     = i === nextIdx;
          const diff       = getLevelDifficulty(i);
          const baseColor  = DIFF_COLOR[diff];

          return (
            <button
              key={i}
              disabled={isLocked}
              onClick={() => !isLocked && onSelectLevel(pattern, size, i)}
              className={[
                "relative flex flex-col items-center justify-center rounded-xl border transition-all duration-150 aspect-square text-xs font-bold shadow-sm",
                isLocked
                  ? "bg-black/50 border-white/10 cursor-not-allowed"
                  : baseColor + " border-transparent active:scale-90 hover:brightness-125 cursor-pointer",
                isNext ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-transparent animate-pulse" : "",
              ].filter(Boolean).join(" ")}
            >
              {isLocked ? (
                <span className="text-white/25 text-base leading-none">×</span>
              ) : (
                <span className="leading-none">{i + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md border-b-2 border-green-900/60"
      >
        ◀ もどる
      </button>
      <div className="flex-1 text-center">
        <div className="relative inline-block">
          <div className="absolute -top-2 left-5 w-2 h-4 bg-amber-600 rounded-full opacity-80" />
          <div className="absolute -top-2 right-5 w-2 h-4 bg-amber-600 rounded-full opacity-80" />
          <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-xl px-4 py-2 shadow-lg border border-amber-500/50">
            <p className="text-yellow-100 font-black text-sm leading-tight drop-shadow-md">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
