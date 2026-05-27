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
    size === 5 ? "w-12 h-12 sm:w-14 sm:h-14" :
    "w-10 h-10 sm:w-12 sm:h-12";

  const emojiSize =
    size <= 3 ? "text-4xl sm:text-5xl" :
    size === 4 ? "text-3xl sm:text-4xl" :
    size === 5 ? "text-2xl sm:text-3xl" :
    "text-xl sm:text-2xl";

  return (
    <button
      onClick={onClick}
      className={[
        dims,
        "rounded-xl transition-all duration-300 active:scale-90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300",
        "flex items-center justify-center relative overflow-hidden select-none",
        on ? "cell-on" : "hover:brightness-110",
      ].join(" ")}
      style={on ? {
        background: "linear-gradient(145deg, #fefce8, #fde68a, #f59e0b)",
        border: "2px solid rgba(253,230,138,0.9)",
      } : {
        background: "linear-gradient(155deg, #78350f, #92400e, #451a03)",
        border: "2px solid rgba(120,70,20,0.7)",
        boxShadow: "inset 0 3px 8px rgba(0,0,0,0.65)",
      }}
      aria-label={on ? "ライト ON" : "ライト OFF"}
    >
      {/* Wood grain lines (OFF only) */}
      {!on && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.18,
            background:
              "repeating-linear-gradient(172deg, transparent, transparent 5px, rgba(0,0,0,0.6) 5px, rgba(0,0,0,0.6) 6px, transparent 6px, transparent 13px)",
          }}
        />
      )}
      {/* Radial glow core (ON only) */}
      {on && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,255,230,0.75) 0%, rgba(255,210,60,0.35) 45%, transparent 72%)",
          }}
        />
      )}
      <span
        className={`${emojiSize} relative z-10 select-none leading-none`}
        aria-hidden="true"
        style={{ filter: on ? "drop-shadow(0 0 4px rgba(255,220,80,0.9))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.8))" }}
      >
        {on ? "🏮" : "🍃"}
      </span>
    </button>
  );
}
