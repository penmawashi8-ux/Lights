"use client";

import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import Confetti from "./Confetti";
import {
  OwlIcon,
  FoxIcon,
  BearIcon,
  RabbitCharacter,
  RaccoonCharacter,
  HedgehogCharacter,
  CampfireIcon,
} from "./illustrations/Characters";
import {
  Pattern,
  Difficulty,
  BoardSize,
  PATTERN_LABELS,
  DIFFICULTY_LABELS,
  generatePuzzle,
  getAffectedCells,
  isSolved,
} from "@/lib/gameLogic";

const PATTERN_HINTS: Record<Pattern, string> = {
  plus: "タイルをタップすると、上下左右と自分自身の明かりがON/OFFするよ！",
  x: "タイルをタップすると、斜め4方向と自分自身の明かりがON/OFFするよ！",
  square: "タイルをタップすると、周囲8マスと自分自身の明かりがON/OFFするよ！",
  rowcol: "タイルをタップすると、同じ行・列の全ての明かりがON/OFFするよ！",
  self: "タイルをタップすると、自分自身の明かりだけがON/OFFするよ！",
};

interface GameScreenProps {
  pattern: Pattern;
  difficulty: Difficulty;
  boardSize: BoardSize;
  onChangeSettings: () => void;
}

export default function GameScreen({
  pattern,
  difficulty,
  boardSize,
  onChangeSettings,
}: GameScreenProps) {
  const [board, setBoard] = useState<boolean[][]>(() =>
    generatePuzzle(boardSize, pattern, difficulty)
  );
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const newPuzzle = useCallback(() => {
    setBoard(generatePuzzle(boardSize, pattern, difficulty));
    setMoves(0);
    setSolved(false);
    setCelebrating(false);
    setShowConfetti(false);
  }, [boardSize, pattern, difficulty]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (solved) return;
      setBoard((prev) => {
        const next = prev.map((r) => [...r]);
        const affected = getAffectedCells(row, col, boardSize, pattern);
        for (const [r, c] of affected) {
          next[r][c] = !next[r][c];
        }
        return next;
      });
      setMoves((m) => m + 1);
    },
    [solved, boardSize, pattern]
  );

  useEffect(() => {
    if (!solved && isSolved(board)) {
      setSolved(true);
      setCelebrating(true);
      setShowConfetti(true);
      const t = setTimeout(() => setCelebrating(false), 600);
      return () => clearTimeout(t);
    }
  }, [board, solved]);

  const difficultyColor =
    difficulty === "easy"
      ? "text-emerald-600"
      : difficulty === "normal"
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="w-full max-w-sm mx-auto space-y-3 fade-in-up">
      {showConfetti && <Confetti />}

      {/* Top navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onChangeSettings}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md border-2 border-green-500/60 overflow-hidden">
            <OwlIcon size={46} />
          </div>
          <span className="text-green-300 text-xs font-bold">メニュー</span>
        </button>

        {/* Wooden title sign */}
        <div className="flex-1 mx-3 text-center">
          <div className="relative inline-block">
            <div className="absolute -top-2.5 left-6 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="absolute -top-2.5 right-6 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-2xl px-5 py-2.5 shadow-xl border-2 border-amber-500/50">
              <p className="text-yellow-100 font-black text-base sm:text-lg leading-tight tracking-wide drop-shadow-md">
                💡 ポコっとライト
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onChangeSettings}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md border-2 border-green-500/60 overflow-hidden">
            <FoxIcon size={46} />
          </div>
          <span className="text-green-300 text-xs font-bold">設定</span>
        </button>
      </div>

      {/* Info bar */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-md border border-amber-200/60">
        <div className="flex-1 min-w-0">
          <p className="text-green-700 text-xs font-semibold">🐾 パターン</p>
          <p className="text-green-900 font-bold text-sm leading-tight truncate">
            {PATTERN_LABELS[pattern]}
          </p>
        </div>
        <div className="float-anim flex-shrink-0">
          <BearIcon size={40} />
        </div>
        <div className="flex-1 text-center">
          <p className="text-green-700 text-xs font-semibold">🍀 難易度</p>
          <p className={`font-bold text-sm leading-tight ${difficultyColor}`}>
            {DIFFICULTY_LABELS[difficulty]}
          </p>
        </div>
        <div className="w-px h-8 bg-green-200/80" />
        <div className="text-center w-12 flex-shrink-0">
          <p className="text-green-700 text-xs font-semibold">手数</p>
          <p className="text-green-900 font-black text-2xl tabular-nums leading-tight">
            {moves}
          </p>
        </div>
      </div>

      {/* Clear banner */}
      {solved && (
        <div className="bg-gradient-to-r from-yellow-400 to-amber-400 border-2 border-yellow-300/80 rounded-2xl p-3 text-center pop-in shadow-lg shadow-yellow-500/30">
          <p className="text-2xl font-black text-white drop-shadow-md">
            🎉 全部ついた！クリア！
          </p>
          <p className="text-yellow-100 text-sm mt-0.5">
            {moves} 手でクリアしました！⭐
          </p>
        </div>
      )}

      {/* Board with side characters */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 select-none pointer-events-none float-anim">
          <RabbitCharacter size={72} />
        </div>
        <Board
          board={board}
          size={boardSize}
          onCellClick={handleCellClick}
          celebrating={celebrating}
        />
        <div
          className="absolute -right-2 top-1/2 -translate-y-1/2 select-none pointer-events-none float-anim"
          style={{ animationDelay: "0.8s" }}
        >
          <RaccoonCharacter size={72} />
        </div>
      </div>

      {/* Board size label */}
      <div className="flex justify-center">
        <span className="bg-gradient-to-br from-amber-800 to-amber-900 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-amber-700/60">
          {boardSize}×{boardSize} ボード
        </span>
      </div>

      {/* Hint text */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-4 py-3 flex items-start gap-2.5 border border-amber-200/50 shadow">
        <span className="text-yellow-500 text-lg flex-shrink-0 mt-0.5">💡</span>
        <p className="text-green-800 text-xs leading-relaxed">
          {PATTERN_HINTS[pattern]}
        </p>
      </div>

      {/* Bottom row: characters + new puzzle button */}
      <div className="flex items-end gap-2">
        <div
          className="flex-shrink-0 select-none float-anim"
          style={{ animationDelay: "0.4s" }}
        >
          <HedgehogCharacter size={52} />
        </div>
        <button
          onClick={newPuzzle}
          className="flex-1 py-3.5 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 active:scale-95 text-white font-black text-base rounded-2xl transition-all duration-150 shadow-lg shadow-green-900/50 border-b-4 border-green-800/60 flex items-center justify-center gap-2"
        >
          新しいパズル <span className="text-base">🐾</span>
        </button>
        <div
          className="flex-shrink-0 select-none float-anim"
          style={{ animationDelay: "1.2s" }}
        >
          <CampfireIcon size={52} />
        </div>
      </div>
    </div>
  );
}
