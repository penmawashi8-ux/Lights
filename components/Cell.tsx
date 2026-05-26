"use client";

interface CellProps {
  on: boolean;
  onClick: () => void;
  size: number;
}

export default function Cell({ on, onClick, size }: CellProps) {
  const dims =
    size === 3 ? "w-20 h-20 sm:w-24 sm:h-24 text-3xl" :
    size === 4 ? "w-16 h-16 sm:w-20 sm:h-20 text-2xl" :
    size === 5 ? "w-12 h-12 sm:w-15 sm:h-15 text-xl" :
    "w-10 h-10 sm:w-12 sm:h-12 text-base";

  return (
    <button
      onClick={onClick}
      className={[
        dims,
        "rounded-2xl transition-all duration-200 active:scale-90",
        "flex items-center justify-center select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300",
        on
          ? "bg-gradient-to-br from-yellow-300 to-amber-400 cell-on border-2 border-yellow-200/80 shadow-lg shadow-yellow-400/50"
          : "bg-gradient-to-br from-green-900 to-green-950 hover:from-green-800 hover:to-green-900 border-2 border-green-700/50 shadow-inner shadow-black/40",
      ].join(" ")}
      aria-label={on ? "ライト ON" : "ライト OFF"}
    >
      {on ? "⭐" : "🍃"}
    </button>
  );
}
