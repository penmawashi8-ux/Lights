"use client";

import { useState, useEffect } from "react";
import { loadProgress, getUnlockedUpTo, TOTAL_LEVELS } from "@/lib/progress";

interface LevelSelectScreenProps {
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

interface ChapterInfo {
  label: string;
  start: number; // 1-based level number
}

const CHAPTERS: ChapterInfo[] = [
  { label: "Chapter 1 (3×3)", start: 1 },
  { label: "Chapter 2 (4×4)", start: 11 },
  { label: "Chapter 3 (5×5)", start: 31 },
  { label: "Chapter 4 (6×6)", start: 61 },
];

function getLevelColorClass(level: number): string {
  if (level <= 10) return "bg-green-800/70 text-green-100 border-green-600/50";
  if (level <= 30) return "bg-amber-800/70 text-amber-100 border-amber-600/50";
  if (level <= 60) return "bg-orange-800/70 text-orange-100 border-orange-600/50";
  if (level <= 80) return "bg-red-800/70 text-red-100 border-red-600/50";
  return "bg-purple-800/70 text-purple-100 border-purple-600/50";
}

export default function LevelSelectScreen({ onSelectLevel, onBack }: LevelSelectScreenProps) {
  const [cleared, setCleared] = useState<Set<number>>(new Set());
  const [unlockedUpTo, setUnlockedUpTo] = useState<number>(1);

  useEffect(() => {
    const progress = loadProgress();
    setCleared(progress);
    setUnlockedUpTo(getUnlockedUpTo(progress));
  }, []);

  // The "next" level is the first uncompleted level that is unlocked
  const nextLevel = (() => {
    for (let l = 1; l <= unlockedUpTo; l++) {
      if (!cleared.has(l)) return l;
    }
    return null;
  })();

  // Build rows of 10 for rendering
  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-lg mx-auto fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 active:scale-95 text-white font-bold text-sm rounded-xl transition-all duration-150 shadow-md border-b-2 border-green-900/60"
        >
          ◀ もどる
        </button>

        {/* Wooden sign title */}
        <div className="flex-1 text-center">
          <div className="relative inline-block">
            <div className="absolute -top-2.5 left-5 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="absolute -top-2.5 right-5 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-2xl px-5 py-2.5 shadow-xl border-2 border-amber-500/50">
              <p className="text-yellow-100 font-black text-base sm:text-lg leading-tight tracking-wide drop-shadow-md">
                🏔️ 冒険モード
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="mb-4 bg-green-900/50 rounded-2xl px-4 py-2.5 border border-green-700/40 flex items-center justify-between shadow">
        <span className="text-green-200 text-sm font-semibold">
          ⭐ クリア済み
        </span>
        <span className="text-yellow-300 font-black text-lg tabular-nums">
          {cleared.size} / {TOTAL_LEVELS}
        </span>
      </div>

      {/* Scrollable level grid */}
      <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-4">
        {CHAPTERS.map((chapter, ci) => {
          const nextChapter = CHAPTERS[ci + 1];
          const chapterEnd = nextChapter ? nextChapter.start - 1 : TOTAL_LEVELS;
          const chapterLevels = levels.filter(
            (l) => l >= chapter.start && l <= chapterEnd
          );

          return (
            <div key={chapter.label}>
              {/* Chapter label */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-green-700/40" />
                <span className="text-green-300 text-xs font-bold px-2 py-0.5 bg-green-900/60 rounded-full border border-green-700/40">
                  {chapter.label}
                </span>
                <div className="h-px flex-1 bg-green-700/40" />
              </div>

              {/* Level buttons grid — 10 per row */}
              <div className="grid grid-cols-10 gap-1.5">
                {chapterLevels.map((level) => {
                  const isCleared = cleared.has(level);
                  const isLocked = level > unlockedUpTo;
                  const isNext = level === nextLevel;
                  const colorClass = getLevelColorClass(level);

                  return (
                    <button
                      key={level}
                      disabled={isLocked}
                      onClick={() => !isLocked && onSelectLevel(level)}
                      className={[
                        "relative flex flex-col items-center justify-center rounded-xl border transition-all duration-150 aspect-square text-xs font-bold shadow-sm",
                        colorClass,
                        isLocked
                          ? "opacity-40 cursor-not-allowed"
                          : "active:scale-90 hover:brightness-125 cursor-pointer",
                        isNext
                          ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-transparent animate-pulse"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {isLocked ? (
                        <>
                          <span className="text-base leading-none">🔒</span>
                          <span className="text-[9px] mt-0.5 opacity-70">{level}</span>
                        </>
                      ) : (
                        <>
                          <span className="leading-none">{level}</span>
                          {isCleared && (
                            <span className="text-[10px] leading-none mt-0.5">⭐</span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Color legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center text-[10px]">
        <span className="px-2 py-0.5 bg-green-800/70 text-green-100 rounded-full border border-green-600/50">Chapter 1</span>
        <span className="px-2 py-0.5 bg-amber-800/70 text-amber-100 rounded-full border border-amber-600/50">Chapter 2</span>
        <span className="px-2 py-0.5 bg-orange-800/70 text-orange-100 rounded-full border border-orange-600/50">Chapter 3</span>
        <span className="px-2 py-0.5 bg-red-800/70 text-red-100 rounded-full border border-red-600/50">Chapter 4a</span>
        <span className="px-2 py-0.5 bg-purple-800/70 text-purple-100 rounded-full border border-purple-600/50">Chapter 4b</span>
      </div>
    </div>
  );
}
