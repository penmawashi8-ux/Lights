"use client";

interface CellProps {
  on: boolean;
  onClick: () => void;
  size: number;
}

export default function Cell({ on, onClick, size }: CellProps) {
  const dims =
    size === 3 ? "w-20 h-20 sm:w-24 sm:h-24" :
    size === 4 ? "w-16 h-16 sm:w-20 sm:h-20" :
    size === 5 ? "w-12 h-12 sm:w-15 sm:h-15" :
    "w-10 h-10 sm:w-12 sm:h-12";

  return (
    <button
      onClick={onClick}
      className={[
        dims,
        "rounded-2xl overflow-hidden transition-all duration-200 active:scale-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300",
        on ? "cell-on shadow-lg shadow-yellow-400/50" : "hover:brightness-110",
      ].join(" ")}
      aria-label={on ? "ライト ON" : "ライト OFF"}
    >
      <img
        src={on ? "/icons/star.png" : "/icons/leaf.png"}
        alt={on ? "ON" : "OFF"}
        className="w-full h-full object-contain p-0.5"
        draggable={false}
      />
    </button>
  );
}
