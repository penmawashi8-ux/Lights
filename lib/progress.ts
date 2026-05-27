// Adventure mode progress persistence via localStorage

export const TOTAL_LEVELS = 100;

const STORAGE_KEY = "pokotto_progress";

export function loadProgress(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set<number>(parsed.filter((v): v is number => typeof v === "number"));
  } catch {
    return new Set();
  }
}

export function saveProgress(cleared: Set<number>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(cleared)));
  } catch {
    // ignore write errors (e.g. private browsing quota)
  }
}

// Returns the highest level number that is currently unlocked.
// Level 1 is always unlocked. After clearing level N, level N+1 unlocks.
export function getUnlockedUpTo(cleared: Set<number>): number {
  if (cleared.size === 0) return 1;
  const maxCleared = Math.max(...Array.from(cleared));
  return Math.min(TOTAL_LEVELS, maxCleared + 1);
}
