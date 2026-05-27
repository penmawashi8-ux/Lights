// Adventure mode progress: tracks cleared levels per (pattern, size)
import type { PatternKey } from "@/lib/levels";
import type { BoardSize } from "@/lib/gameLogic";

const STORAGE_KEY = "pokotto_progress_v2";

export type ProgressKey = `${PatternKey}_${BoardSize}`;
export type ProgressData = Record<string, number[]>;

export function makeProgressKey(pattern: PatternKey, size: BoardSize): string {
  return `${pattern}_${size}`;
}

export function loadProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressData;
  } catch {
    return {};
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota / private browsing */ }
}

export function getClearedSet(data: ProgressData, pattern: PatternKey, size: BoardSize): Set<number> {
  const key = makeProgressKey(pattern, size);
  return new Set(data[key] ?? []);
}

export function markCleared(
  data: ProgressData,
  pattern: PatternKey,
  size: BoardSize,
  levelIndex: number,
): ProgressData {
  const key = makeProgressKey(pattern, size);
  const existing = new Set(data[key] ?? []);
  existing.add(levelIndex);
  return { ...data, [key]: Array.from(existing) };
}

export function getUnlockedUpTo(cleared: Set<number>): number {
  if (cleared.size === 0) return 0;
  return Math.min(99, Math.max(...Array.from(cleared)) + 1);
}

export function getTotalCleared(data: ProgressData): number {
  return Object.values(data).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
}
