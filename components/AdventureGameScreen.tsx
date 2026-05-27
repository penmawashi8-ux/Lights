"use client";

import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import Confetti from "./Confetti";
import {
  PATTERN_DISPLAY, generateLevelBoard, getLevelDifficulty, type PatternKey,
} from "@/lib/levels";
import { loadProgress, saveProgress, markCleared } from "@/lib/progress";
import { getAffectedCells, isSolved, DIFFICULTY_LABELS } from "@/lib/gameLogic";
import type { BoardSize } from "@/lib/gameLogic";

interface Props {
  pattern: PatternKey;
  size: BoardSize;
  levelIndex: number; // 0-based (0-99)
  onComplete: (pattern: PatternKey, size: BoardSize, completedIndex: number) => void;
  onBack: () => void;
}

export default function AdventureGameScreen({ pattern, size, levelIndex, onComplete, onBack }: Props) {
  const difficulty = getLevelDifficulty(levelIndex);

  const [board, setBoard]           = useState<boolean[][]>(() => generateLevelBoard(pattern, size, levelIndex));
  const [moves, setMoves]           = useState(0);
  const [solved, setSolved]         = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset when key changes (handled by parent via key prop)
  useEffect(() => {
    setBoard(generateLevelBoard(pattern, size, levelIndex));
    setMoves(0); setSolved(false); setCelebrating(false); setShowConfetti(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, size, levelIndex]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (solved) return;
    setBoard(prev => {
      const next = prev.map(row => [...row]);
      for (const [ar, ac] of getAffectedCells(r, c, size, pattern)) next[ar][ac] = !next[ar][ac];
      return next;
    });
    setMoves(m => m + 1);
  }, [solved, size, pattern]);

  useEffect(() => {
    if (!solved && isSolved(board)) {
      setSolved(true); setCelebrating(true); setShowConfetti(true);
      const data = loadProgress();
      saveProgress(markCleared(data, pattern, size, levelIndex));
      const t = setTimeout(() => setCelebrating(false), 600);
      return () => clearTimeout(t);
    }
  }, [board, solved, pattern, size, levelIndex]);

  const diffColor =
    difficulty === "easy" ? "text-emerald-400" :
    difficulty === "normal" ? "text-amber-400" : "text-red-400";

  const isLast = levelIndex >= 99;

  return (
    <div className="w-full max-w-sm mx-auto space-y-3 fade-in-up">
      {showConfetti && <Confetti />}

      {/* Top nav */}
      <div className="flex items-center justify-between px-1">
        <button onClick={onBack}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md border-2 border-green-500/60">
            <span className="text-white text-xl font-black">◀</span>
          </div>
          <span className="text-green-300 text-xs font-bold">もどる</span>
        </button>

        <div className="flex-1 mx-3 text-center">
          <div className="relative inline-block">
            <div className="absolute -top-2.5 left-5 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="absolute -top-2.5 right-5 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-2xl px-5 py-2.5 shadow-xl border-2 border-amber-500/50">
              <p className="text-yellow-100 font-black text-base leading-tight drop-shadow-md">
                🏔️ 冒険モード
              </p>
            </div>
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Level info */}
      <div className="bg-gradient-to-r from-green-900/80 to-green-800/60 rounded-2xl px-4 py-3 border border-green-700/40 shadow text-center">
        <p className="text-yellow-200 font-black text-2xl leading-tight">
          ステージ {levelIndex + 1} / 100
        </p>
        <p className="text-green-300 text-xs mt-0.5">
          {PATTERN_DISPLAY[pattern].label}
          <span className="mx-1.5 text-green-600">|</span>
          <span className={diffColor}>{DIFFICULTY_LABELS[difficulty]}</span>
          <span className="mx-1.5 text-green-600">|</span>
          {size}×{size}
        </p>
      </div>

      {/* Move counter */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-md border border-amber-200/60">
        <div className="flex-1">
          <p className="text-green-700 text-xs font-semibold">🐾 パターン</p>
          <p className="text-green-900 font-bold text-sm truncate">{PATTERN_DISPLAY[pattern].label}</p>
        </div>
        <div className="w-px h-8 bg-green-200/80" />
        <div className="text-center w-14">
          <p className="text-green-700 text-xs font-semibold">手数</p>
          <p className="text-green-900 font-black text-2xl tabular-nums leading-tight">{moves}</p>
        </div>
      </div>

      {/* Clear banner */}
      {solved && (
        <div className="bg-gradient-to-r from-yellow-400 to-amber-400 border-2 border-yellow-300/80 rounded-2xl p-3 text-center pop-in shadow-lg shadow-yellow-500/30">
          <p className="text-2xl font-black text-white drop-shadow-md">🎉 ステージクリア！</p>
          <p className="text-yellow-100 text-sm mt-0.5">{moves} 手でクリア！</p>
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={() => onComplete(pattern, size, levelIndex)}
              disabled={isLast}
              className="px-4 py-2 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 disabled:opacity-40 active:scale-95 text-white font-black text-sm rounded-xl transition-all shadow-md border-b-2 border-green-900/60"
            >
              次のステージ ▶
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 active:scale-95 text-white font-black text-sm rounded-xl transition-all shadow-md border-b-2 border-amber-900/60"
            >
              ステージ選択へ
            </button>
          </div>
        </div>
      )}

      {/* Board */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none float-anim">
          <img src="/chars/rabbit.png" alt="" className="w-16 h-16 object-contain" draggable={false} />
        </div>
        <Board board={board} size={size} onCellClick={handleCellClick} celebrating={celebrating} />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 select-none pointer-events-none float-anim" style={{ animationDelay: "0.8s" }}>
          <img src="/chars/raccoon.png" alt="" className="w-16 h-16 object-contain" draggable={false} />
        </div>
      </div>

      <div className="flex justify-center">
        <span className="bg-gradient-to-br from-amber-800 to-amber-900 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-amber-700/60">
          {size}×{size} ボード
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-end gap-2">
        <div className="flex-shrink-0 float-anim" style={{ animationDelay: "0.4s" }}>
          <img src="/chars/hedgehog.png" alt="" className="w-14 h-14 object-contain" draggable={false} />
        </div>
        <button
          onClick={() => { setBoard(generateLevelBoard(pattern, size, levelIndex)); setMoves(0); setSolved(false); setCelebrating(false); setShowConfetti(false); }}
          disabled={solved}
          className="flex-1 py-3.5 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 disabled:opacity-50 active:scale-95 text-white font-black text-base rounded-2xl transition-all shadow-lg border-b-4 border-green-800/60 flex items-center justify-center gap-2"
        >
          リセット 🔄
        </button>
        <div className="flex-shrink-0 float-anim" style={{ animationDelay: "1.2s" }}>
          <img src="/chars/campfire.png" alt="" className="w-14 h-14 object-contain" draggable={false} />
        </div>
      </div>
    </div>
  );
}
