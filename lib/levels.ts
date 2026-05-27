// Adventure mode: 4 patterns × 4 board sizes × 100 levels = 1600 total
import { BoardSize, getAffectedCells } from "@/lib/gameLogic";
import type { Difficulty } from "@/lib/gameLogic";

export type PatternKey = "plus" | "x" | "square" | "rowcol";
export const PATTERN_KEYS: PatternKey[] = ["plus", "x", "square", "rowcol"];
export const BOARD_SIZES: BoardSize[] = [3, 4, 5, 6];

export const PATTERN_DISPLAY: Record<PatternKey, { label: string; emoji: string; desc: string }> = {
  plus:   { label: "プラス型",   emoji: "＋", desc: "上下左右と自分が変わる" },
  x:      { label: "バツ型",    emoji: "✕", desc: "斜め4方向と自分が変わる" },
  square: { label: "四角型",    emoji: "■", desc: "周囲8マスと自分が変わる" },
  rowcol: { label: "行列型",    emoji: "田", desc: "同じ行・列が全部変わる" },
};

/** Difficulty ramp across 100 levels (0-indexed) */
export function getLevelDifficulty(levelIndex: number): Difficulty {
  if (levelIndex < 33) return "easy";
  if (levelIndex < 67) return "normal";
  return "hard";
}

/** Seeded LCG PRNG */
function makePrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Generate a deterministic puzzle board for the given combination.
 * @param pattern    - which toggle pattern
 * @param size       - board dimension (3-6)
 * @param levelIndex - 0-based level index (0-99)
 */
export function generateLevelBoard(
  pattern: PatternKey,
  size: BoardSize,
  levelIndex: number,
): boolean[][] {
  const difficulty = getLevelDifficulty(levelIndex);
  const clicks =
    difficulty === "easy"   ? size * 2 :
    difficulty === "normal" ? size * 4 : size * 8;

  const patternIdx = PATTERN_KEYS.indexOf(pattern);
  const seed = ((patternIdx * 10000 + (size - 3) * 2500 + levelIndex) * 31337 + 42) >>> 0;
  const rand = makePrng(seed);

  let board: boolean[][] = Array.from({ length: size }, () => Array(size).fill(true));

  for (let i = 0; i < clicks; i++) {
    const r = Math.floor(rand() * size);
    const c = Math.floor(rand() * size);
    for (const [ar, ac] of getAffectedCells(r, c, size, pattern)) {
      board[ar][ac] = !board[ar][ac];
    }
  }

  // Ensure not trivially solved
  if (board.every(row => row.every(cell => cell))) {
    for (const [ar, ac] of getAffectedCells(0, 0, size, pattern)) {
      board[ar][ac] = !board[ar][ac];
    }
  }

  return board;
}
