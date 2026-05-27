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
        "rounded-2xl transition-all duration-200 active:scale-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300",
        on ? "cell-on" : "hover:brightness-110",
      ].join(" ")}
      aria-label={on ? "ライト ON" : "ライト OFF"}
    >
      {/* Inner wrapper forces proper overflow clipping on iOS Safari */}
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <img
          src={on ? "/icons/star.png" : "/icons/leaf.png"}
          alt={on ? "ON" : "OFF"}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </button>
  );
}
