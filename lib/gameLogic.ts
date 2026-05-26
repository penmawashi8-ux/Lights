export type Pattern = "plus" | "x" | "square" | "rowcol" | "self";
export type Difficulty = "easy" | "normal" | "hard";
export type BoardSize = 3 | 4 | 5 | 6;

export const PATTERN_LABELS: Record<Pattern, string> = {
  plus: "プラス型（＋）",
  x: "X型（×）",
  square: "四角型（■）",
  rowcol: "同行同列",
  self: "自分のみ",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "かんたん",
  normal: "ふつう",
  hard: "むずかしい",
};

export function getAffectedCells(
  row: number,
  col: number,
  size: number,
  pattern: Pattern
): [number, number][] {
  const cells: [number, number][] = [];

  if (pattern === "plus") {
    cells.push([row, col]);
    if (row > 0) cells.push([row - 1, col]);
    if (row < size - 1) cells.push([row + 1, col]);
    if (col > 0) cells.push([row, col - 1]);
    if (col < size - 1) cells.push([row, col + 1]);
  } else if (pattern === "x") {
    cells.push([row, col]);
    if (row > 0 && col > 0) cells.push([row - 1, col - 1]);
    if (row > 0 && col < size - 1) cells.push([row - 1, col + 1]);
    if (row < size - 1 && col > 0) cells.push([row + 1, col - 1]);
    if (row < size - 1 && col < size - 1) cells.push([row + 1, col + 1]);
  } else if (pattern === "square") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          cells.push([nr, nc]);
        }
      }
    }
  } else if (pattern === "rowcol") {
    for (let c = 0; c < size; c++) cells.push([row, c]);
    for (let r = 0; r < size; r++) {
      if (r !== row) cells.push([r, col]);
    }
  } else if (pattern === "self") {
    cells.push([row, col]);
  }

  return cells;
}

function applyClick(
  board: boolean[][],
  row: number,
  col: number,
  size: number,
  pattern: Pattern
): boolean[][] {
  const next = board.map((r) => [...r]);
  const affected = getAffectedCells(row, col, size, pattern);
  for (const [r, c] of affected) {
    next[r][c] = !next[r][c];
  }
  return next;
}

function makeFullBoard(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array(size).fill(true));
}

export function generatePuzzle(
  size: number,
  pattern: Pattern,
  difficulty: Difficulty
): boolean[][] {
  const clicks =
    difficulty === "easy"
      ? size * 2
      : difficulty === "normal"
      ? size * 4
      : size * 8;

  let board = makeFullBoard(size);

  let count = 0;
  let attempts = 0;
  while (count < clicks && attempts < clicks * 10) {
    attempts++;
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    board = applyClick(board, row, col, size, pattern);
    count++;
  }

  // If board is all-on (degenerate), force at least one off
  const anyOff = board.some((row) => row.some((cell) => !cell));
  if (!anyOff) {
    board = applyClick(board, 0, 0, size, pattern);
  }

  return board;
}

// Win = all cells ON (lit)
export function isSolved(board: boolean[][]): boolean {
  return board.every((row) => row.every((cell) => cell));
}
