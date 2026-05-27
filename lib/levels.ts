// Level specifications for adventure mode (100 levels)
// Uses a seeded PRNG to generate deterministic puzzle boards

import { Pattern, Difficulty, BoardSize, getAffectedCells } from "@/lib/gameLogic";

export interface LevelSpec {
  size: BoardSize;
  pattern: Pattern;
  difficulty: Difficulty;
}

const PATTERNS: Pattern[] = ["plus", "x", "square", "rowcol", "self"];

function makePattern(index: number): Pattern {
  return PATTERNS[index % PATTERNS.length];
}

export const LEVEL_SPECS: LevelSpec[] = [
  // Lv 1-10: size=3, cycling patterns, easy
  ...Array.from({ length: 10 }, (_, i): LevelSpec => ({
    size: 3,
    pattern: makePattern(i),
    difficulty: "easy",
  })),

  // Lv 11-20: size=4, cycling patterns, easy
  ...Array.from({ length: 10 }, (_, i): LevelSpec => ({
    size: 4,
    pattern: makePattern(i),
    difficulty: "easy",
  })),

  // Lv 21-30: size=4, cycling patterns, normal
  ...Array.from({ length: 10 }, (_, i): LevelSpec => ({
    size: 4,
    pattern: makePattern(i),
    difficulty: "normal",
  })),

  // Lv 31-38: size=5, cycling patterns, easy
  ...Array.from({ length: 8 }, (_, i): LevelSpec => ({
    size: 5,
    pattern: makePattern(i),
    difficulty: "easy",
  })),

  // Lv 39-45: size=5, cycling patterns, normal
  ...Array.from({ length: 7 }, (_, i): LevelSpec => ({
    size: 5,
    pattern: makePattern(i),
    difficulty: "normal",
  })),

  // Lv 46-60: size=5, all patterns, hard
  ...Array.from({ length: 15 }, (_, i): LevelSpec => ({
    size: 5,
    pattern: makePattern(i),
    difficulty: "hard",
  })),

  // Lv 61-68: size=6, cycling patterns, easy
  ...Array.from({ length: 8 }, (_, i): LevelSpec => ({
    size: 6,
    pattern: makePattern(i),
    difficulty: "easy",
  })),

  // Lv 69-75: size=6, cycling patterns, normal
  ...Array.from({ length: 7 }, (_, i): LevelSpec => ({
    size: 6,
    pattern: makePattern(i),
    difficulty: "normal",
  })),

  // Lv 76-100: size=6, cycling patterns, hard
  ...Array.from({ length: 25 }, (_, i): LevelSpec => ({
    size: 6,
    pattern: makePattern(i),
    difficulty: "hard",
  })),
];

// Seeded LCG PRNG — returns a next-state function and a value extractor
function makePrng(seed: number) {
  let state = seed >>> 0; // treat as unsigned 32-bit
  return function next(): number {
    // LCG parameters from Numerical Recipes
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x100000000; // [0, 1)
  };
}

export function generateLevelBoard(levelIndex: number, spec: LevelSpec): boolean[][] {
  const { size, pattern, difficulty } = spec;
  const seed = (levelIndex * 31337 + 42) >>> 0;
  const rand = makePrng(seed);

  const clicks =
    difficulty === "easy"
      ? size * 2
      : difficulty === "normal"
      ? size * 4
      : size * 8;

  // Start from all-true board
  let board: boolean[][] = Array.from({ length: size }, () => Array(size).fill(true));

  function applyClick(r: number, c: number) {
    const affected = getAffectedCells(r, c, size, pattern);
    for (const [ar, ac] of affected) {
      board[ar][ac] = !board[ar][ac];
    }
  }

  for (let i = 0; i < clicks; i++) {
    const row = Math.floor(rand() * size);
    const col = Math.floor(rand() * size);
    applyClick(row, col);
  }

  // Ensure not trivially solved (at least one cell off)
  const anyOff = board.some((row) => row.some((cell) => !cell));
  if (!anyOff) {
    // Force top-left click to create an unsolved state
    applyClick(0, 0);
  }

  return board;
}
