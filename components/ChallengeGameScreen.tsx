"use client";

import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import Confetti from "./Confetti";
import {
  Pattern, BoardSize,
  PATTERN_LABELS,
  generatePuzzle, getAffectedCells, isSolved,
} from "@/lib/gameLogic";

const PATTERN_HINTS: Record<Pattern, string> = {
  plus: "上下左右と自分自身がON/OFFするよ！",
  x: "斜め4方向と自分自身がON/OFFするよ！",
  square: "周囲8マスと自分自身がON/OFFするよ！",
  rowcol: "同じ行・列の全マスがON/OFFするよ！",
  self: "自分自身だけがON/OFFするよ！",
};

interface Props {
  pattern: Pattern;
  boardSize: BoardSize;
  onChangeSettings: () => void;
}

function makePuzzle(boardSize: BoardSize, pattern: Pattern) {
  return generatePuzzle(boardSize, pattern);
}

export default function ChallengeGameScreen({ pattern, boardSize, onChangeSettings }: Props) {
  const moveLimit = boardSize * 4;

  const [board, setBoard]             = useState<boolean[][]>(() => makePuzzle(boardSize, pattern));
  const [moves, setMoves]             = useState(0);
  const [solved, setSolved]           = useState(false);
  const [failed, setFailed]           = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const remaining = moveLimit - moves;

  const newPuzzle = useCallback(() => {
    setBoard(makePuzzle(boardSize, pattern));
    setMoves(0);
    setSolved(false);
    setFailed(false);
    setCelebrating(false);
    setShowConfetti(false);
  }, [boardSize, pattern]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (solved || failed) return;
    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      for (const [r, c] of getAffectedCells(row, col, boardSize, pattern)) {
        next[r][c] = !next[r][c];
      }
      return next;
    });
    setMoves((m) => m + 1);
  }, [solved, failed, boardSize, pattern]);

  // Check win
  useEffect(() => {
    if (!solved && !failed && isSolved(board)) {
      setSolved(true);
      setCelebrating(true);
      setShowConfetti(true);
      const t = setTimeout(() => setCelebrating(false), 600);
      return () => clearTimeout(t);
    }
  }, [board, solved, failed]);

  // Check fail
  useEffect(() => {
    if (!solved && !failed && moves >= moveLimit) {
      setFailed(true);
    }
  }, [moves, moveLimit, solved, failed]);

  const remainingColor =
    remaining <= 3
      ? "text-red-500"
      : remaining <= Math.ceil(moveLimit * 0.4)
      ? "text-amber-500"
      : "text-green-700";

  const barPercent = Math.max(0, (remaining / moveLimit) * 100);
  const barColor =
    remaining <= 3
      ? "bg-red-500"
      : remaining <= Math.ceil(moveLimit * 0.4)
      ? "bg-amber-400"
      : "bg-emerald-500";

  return (
    <div className="w-full max-w-sm mx-auto space-y-3 fade-in-up">
      {showConfetti && <Confetti />}

      {/* Clear popup */}
      {solved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative pop-in bg-gradient-to-b from-yellow-300 to-amber-400 rounded-3xl p-6 text-center shadow-2xl shadow-yellow-500/40 border-4 border-yellow-200/80 w-full max-w-xs">
            <p className="text-3xl font-black text-white drop-shadow-md">クリア！</p>
            <p className="text-yellow-900/80 font-bold text-sm mt-1">
              {moves} 手使用・残り {remaining} 手
            </p>
            <button
              onClick={newPuzzle}
              className="mt-5 w-full py-3 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 active:scale-95 text-white font-black text-base rounded-2xl transition-all shadow-md border-b-2 border-green-900/60"
            >
              次のパズル
            </button>
          </div>
        </div>
      )}

      {/* Fail popup */}
      {failed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative pop-in bg-gradient-to-b from-red-500 to-red-700 rounded-3xl p-6 text-center shadow-2xl shadow-red-900/50 border-4 border-red-400/60 w-full max-w-xs">
            <p className="text-3xl font-black text-white drop-shadow-md">手数切れ！</p>
            <p className="text-red-100/80 font-bold text-sm mt-1">
              {moveLimit} 手以内にクリアできなかった…
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={newPuzzle}
                className="flex-1 py-3 bg-gradient-to-b from-white/20 to-white/10 hover:from-white/30 active:scale-95 text-white font-black text-sm rounded-2xl transition-all border border-white/30"
              >
                新しいパズル
              </button>
              <button
                onClick={() => {
                  setBoard(makePuzzle(boardSize, pattern));
                  setMoves(0);
                  setSolved(false);
                  setFailed(false);
                  setCelebrating(false);
                  setShowConfetti(false);
                }}
                className="flex-1 py-3 bg-gradient-to-b from-yellow-400 to-amber-500 hover:from-yellow-300 active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-md border-b-2 border-amber-700/60"
              >
                リトライ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onChangeSettings}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md border-2 border-green-500/60 overflow-hidden">
            <img src="/chars/owl.png" alt="メニュー" className="w-11 h-11 object-contain" draggable={false} />
          </div>
          <span className="text-green-300 text-xs font-bold">メニュー</span>
        </button>

        <div className="flex-1 mx-3 text-center">
          <div className="relative inline-block">
            <div className="absolute -top-2.5 left-6 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="absolute -top-2.5 right-6 w-2 h-5 bg-amber-600 rounded-full opacity-80" />
            <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-2xl px-5 py-2.5 shadow-xl border-2 border-amber-500/50">
              <p className="text-yellow-100 font-black text-base leading-tight tracking-wide drop-shadow-md">
                チャレンジ
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onChangeSettings}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-md border-2 border-green-500/60 overflow-hidden">
            <img src="/chars/fox.png" alt="設定" className="w-11 h-11 object-contain" draggable={false} />
          </div>
          <span className="text-green-300 text-xs font-bold">設定</span>
        </button>
      </div>

      {/* Move limit bar */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-4 py-3 shadow-md border border-amber-200/60 space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-green-700 text-xs font-semibold">残り手数</span>
          <span className={`font-black text-2xl tabular-nums leading-tight ${remainingColor}`}>
            {remaining}
            <span className="text-xs font-bold text-green-600 ml-1">/ {moveLimit}</span>
          </span>
        </div>
        <div className="w-full h-2.5 bg-green-200/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ${barColor}`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-md border border-amber-200/60">
        <div className="flex-1 min-w-0">
          <p className="text-green-700 text-xs font-semibold">パターン</p>
          <p className="text-green-900 font-bold text-sm leading-tight truncate">
            {PATTERN_LABELS[pattern]}
          </p>
        </div>
        <div className="w-px h-8 bg-green-200/80" />
        <div className="flex-1 min-w-0">
          <p className="text-green-700 text-xs font-semibold">ヒント</p>
          <p className="text-green-800 text-[11px] leading-tight">{PATTERN_HINTS[pattern]}</p>
        </div>
      </div>

      {/* Board */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none float-anim">
          <img src="/chars/rabbit.png" alt="" className="w-16 h-16 object-contain" draggable={false} />
        </div>
        <Board board={board} size={boardSize} onCellClick={handleCellClick} celebrating={celebrating} />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 select-none pointer-events-none float-anim" style={{ animationDelay: "0.8s" }}>
          <img src="/chars/raccoon.png" alt="" className="w-16 h-16 object-contain" draggable={false} />
        </div>
      </div>

      {/* Board size label */}
      <div className="flex justify-center">
        <span className="bg-gradient-to-br from-amber-800 to-amber-900 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-amber-700/60">
          {boardSize}×{boardSize} ボード
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-end gap-2">
        <div className="flex-shrink-0 float-anim" style={{ animationDelay: "0.4s" }}>
          <img src="/chars/hedgehog.png" alt="" className="w-14 h-14 object-contain" draggable={false} />
        </div>
        <button
          onClick={newPuzzle}
          className="flex-1 py-3.5 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 active:scale-95 text-white font-black text-base rounded-2xl transition-all duration-150 shadow-lg shadow-green-900/50 border-b-4 border-green-800/60"
        >
          新しいパズル
        </button>
        <div className="flex-shrink-0 float-anim" style={{ animationDelay: "1.2s" }}>
          <img src="/chars/campfire.png" alt="" className="w-14 h-14 object-contain" draggable={false} />
        </div>
      </div>
    </div>
  );
}
