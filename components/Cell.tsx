"use client";

interface CellProps {
  on: boolean;
  onClick: () => void;
  size: number;
}

export default function Cell({ on, onClick, size }: CellProps) {
  const cellPx =
    size === 3 ? "w-20 h-20 sm:w-24 sm:h-24" :
    size === 4 ? "w-16 h-16 sm:w-20 sm:h-20" :
    size === 5 ? "w-13 h-13 sm:w-16 sm:h-16" :
    "w-11 h-11 sm:w-14 sm:h-14";

  return (
    <button
      onClick={onClick}
      className={[
        cellPx,
        "rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
        on
          ? "bg-yellow-400 cell-on shadow-yellow-400/60 shadow-lg"
          : "bg-slate-700 hover:bg-slate-600 shadow-inner shadow-slate-900/50",
      ].join(" ")}
      aria-label={on ? "オン" : "オフ"}
    />
  );
}
