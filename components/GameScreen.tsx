"use client";

import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import Confetti from "./Confetti";
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
      ? "text-emerald-400"
      : difficulty === "normal"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="w-full max-w-md mx-auto space-y-5 fade-in-down">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">💡 ライツアウト</h1>
        <button
          onClick={onChangeSettings}
          className="text-sm px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
        >
          設定を変える
        </button>
      </div>

      {/* Info bar */}
      <div className="bg-slate-800/60 rounded-xl p-3 flex items-center justify-between border border-slate-700/50">
        <div className="text-sm text-slate-400 space-y-0.5">
          <p>
            <span className="text-slate-500">パターン: </span>
            <span className="text-slate-200 font-medium">{PATTERN_LABELS[pattern]}</span>
          </p>
          <p>
            <span className="text-slate-500">難易度: </span>
            <span className={`font-medium ${difficultyColor}`}>
              {DIFFICULTY_LABELS[difficulty]}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-xs">手数</p>
          <p className="text-3xl font-bold text-white tabular-nums">{moves}</p>
        </div>
      </div>

      {/* Clear banner */}
      {solved && (
        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-xl p-4 text-center fade-in-down">
          <p className="text-2xl font-bold text-yellow-400">🎉 クリア！</p>
          <p className="text-slate-300 text-sm mt-1">
            {moves} 手でクリアしました！
          </p>
        </div>
      )}

      {/* Board */}
      <div className="flex justify-center">
        <Board
          board={board}
          size={boardSize}
          onCellClick={handleCellClick}
          celebrating={celebrating}
        />
      </div>

      {/* Size info */}
      <p className="text-center text-slate-500 text-xs">
        {boardSize}×{boardSize} ボード
      </p>

      {/* Actions */}
      <button
        onClick={newPuzzle}
        className="w-full py-3.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-semibold rounded-xl transition-all duration-150"
      >
        新しいパズル
      </button>
    </div>
  );
}
