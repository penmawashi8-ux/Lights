"use client";

import Cell from "./Cell";

interface BoardProps {
  board: boolean[][];
  size: number;
  onCellClick: (row: number, col: number) => void;
  celebrating: boolean;
}

export default function Board({ board, size, onCellClick, celebrating }: BoardProps) {
  const gap =
    size === 3 ? "gap-3" :
    size === 4 ? "gap-2.5" :
    size === 5 ? "gap-2" :
    "gap-1.5";

  return (
    <div className="bg-gradient-to-br from-green-800/70 to-green-950/80 p-4 rounded-3xl border-4 border-green-600/60 shadow-2xl shadow-black/50">
      <div
        className={["grid", gap, celebrating ? "board-celebrate" : ""].join(" ")}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              on={cell}
              onClick={() => onCellClick(r, c)}
              size={size}
            />
          ))
        )}
      </div>
    </div>
  );
}
